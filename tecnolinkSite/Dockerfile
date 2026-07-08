# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY tecnolinkSite.csproj .
RUN dotnet restore tecnolinkSite.csproj

COPY . .
RUN dotnet publish tecnolinkSite.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

# Runs as the non-root user built into the ASP.NET image.
USER app

COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

ENTRYPOINT ["dotnet", "tecnolinkSite.dll"]
