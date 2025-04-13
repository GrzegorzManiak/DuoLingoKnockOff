using System.Text;
using DuoLingoKnockOff.Data.Context;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

builder.WebHost.UseUrls($"{scheme}://{host}:{port}");
builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();
app.UseHttpsRedirection();
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

app.Run();