FROM mcr.microsoft.com/dotnet/sdk:9.0 AS builder
WORKDIR /app

COPY . .

ENV ASPNETCORE_ENVIRONMENT=Production
RUN dotnet restore
RUN dotnet publish -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/publish .
COPY ./DuoLingoKnockOff/Static ./Static

RUN mkdir -p /data && chown -R nobody:nogroup /data /app/Static

ENV ASPNETCORE_URLS=http://+:80
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 80

CMD ["dotnet", "ApiService.dll"]