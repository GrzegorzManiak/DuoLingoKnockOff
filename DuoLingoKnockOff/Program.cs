using System.Text;
using DuoLingoKnockOff.Data.Context;
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

// -- APP CONFIG -- //
builder.Services.Configure<AppConfig>(builder.Configuration.GetSection("AppConfig"));

// -- JWT AUTHENTICATION -- //
// https://dotnetfullstackdev.medium.com/jwt-token-authentication-in-c-a-beginners-guide-with-code-snippets-7545f4c7c597
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["TokenKey"] ?? 
            throw new InvalidOperationException("TokenKey not found"))),
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Issuer"] ?? "localhost",
        ValidAudience = builder.Configuration["Audience"] ?? "localhost",
    };
});

// -- CORS -- //
// Cors is not necessarly needed for this since itll be a mobile app, but
// for testing it is needed.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();
        policy.WithOrigins(allowedOrigins ?? ["http://localhost:3000"])
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// -- SWAGGER -- //
// https://dev.to/eduardstefanescu/aspnet-core-swagger-documentation-with-bearer-authentication-40l6
builder.Services.AddSwaggerGen(c => 
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "DuoLingo Knock Off API", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Auth header using the Bearer scheme",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
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

builder.WebHost.UseUrls($"{scheme}://{host}:{port}");
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

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