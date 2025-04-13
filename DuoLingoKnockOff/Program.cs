using System.Text;
using DuoLingoKnockOff.Data.Context;
using DuoLingoKnockOff.Data.Repos.Implementations;
using DuoLingoKnockOff.Data.Repos.Interfaces;
using DuoLingoKnockOff.Services.Implementations;
using DuoLingoKnockOff.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

// -- Load server settings from config
var builder = WebApplication.CreateBuilder(args);
var host = builder.Configuration["Host"] ?? "localhost";
var port = builder.Configuration.GetValue<int>("Port", 5165);
var scheme = builder.Configuration["Scheme"] ?? "http";

// -- DATABASE -- //
builder.Services.AddDbContext<ApplicationContext>(options =>
{
    // -- NOTE: I am using MariaDB because i've alreay have it setup on AWS and im using it
    //          for my final project.
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var serverVersion = new MySqlServerVersion(new Version(10, 11, 0));
    options.UseMySql(connectionString, serverVersion);
});

// -- REPOSITORIES -- //
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ILanguageRepository, LanguageRepository>();
builder.Services.AddScoped<IChallengeRepository, ChallengeRepository>();
builder.Services.AddScoped<IUserStreakRepository, UserStreakRepository>();

// -- APP CONFIG -- //
builder.Services.Configure<AppConfig>(builder.Configuration.GetSection("AppConfig"));

// -- JWT AUTHENTICATION -- //
// https://dotnetfullstackdev.medium.com/jwt-token-authentication-in-c-a-beginners-guide-with-code-snippets-7545f4c7c597
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"] ?? 
            throw new InvalidOperationException("TokenKey not found"))),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true
    };
});

// -- CORS -- //
// Cors is not necessarly needed for this since itll be a mobile app, but
// for testing it is needed.
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

// -- SWAGGER -- //
// https://dev.to/eduardstefanescu/aspnet-core-swagger-documentation-with-bearer-authentication-40l6
builder.Services.AddSwaggerGen(c => 
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DuoLingoKnockOff API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Auth header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {{
        new OpenApiSecurityScheme
        {
            Reference = new OpenApiReference
            {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
            }
        }, []
    }});
});

// -- OUR SERVICES -- //
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddScoped<IChallengeService, ChallengeService>();

builder.WebHost.UseUrls($"{scheme}://{host}:{port}");
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

// -- STATIC FILES -- //
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new Microsoft.Extensions.FileProviders.PhysicalFileProvider(
        Path.Combine(builder.Environment.ContentRootPath, "Static")),
    RequestPath = "/static"
});

app.Logger.LogInformation("Static files are being served from: {Path}", 
    Path.Combine(builder.Environment.ContentRootPath, "Static"));

// -- Finally, run migration and seed data
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationContext>();
        context.Database.Migrate();
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred during migration");
    }
}

app.Run();