using DuoLingoKnockOff.Data.Context;
using Microsoft.EntityFrameworkCore;

// -- Load server settings from config
var builder = WebApplication.CreateBuilder(args);
var host = builder.Configuration["Host"] ?? "localhost";
var port = builder.Configuration.GetValue<int>("Port", 5165);
var scheme = builder.Configuration["Scheme"] ?? "http";

builder.Services.AddDbContext<ApplicationContext>(options =>
{
    // -- NOTE: I am using MariaDB because i've alreay have it setup on AWS and im using it
    //          for my final project.
    var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
    var serverVersion = new MySqlServerVersion(new Version(10, 11, 0));
    options.UseMySql(connectionString, serverVersion);
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