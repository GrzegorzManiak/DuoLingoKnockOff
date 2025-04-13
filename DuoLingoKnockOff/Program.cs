// -- Load server settings from config
var builder = WebApplication.CreateBuilder(args);
var host = builder.Configuration["Host"] ?? "localhost";
var port = builder.Configuration.GetValue<int>("Port", 5165);
builder.WebHost.UseUrls($"http://{host}:{port}");

builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment()) 
    app.MapOpenApi();


app.UseHttpsRedirection();

app.Run();