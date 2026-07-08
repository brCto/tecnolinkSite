using System.Threading.RateLimiting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.RateLimiting;
using tecnolinkSite.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.Configure<SmtpSettings>(builder.Configuration.GetSection("Smtp"));
builder.Services.AddSingleton<IEmailSender, SmtpEmailSender>();

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("leads", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(10),
                QueueLimit = 0
            }));
});

var app = builder.Build();

// Most production hosting (Azure App Service, IIS, a reverse proxy) terminates TLS and
// forwards the client IP/scheme via headers. Without this, every request looks like it
// comes from the proxy's own IP (breaking per-IP rate limiting on /api/*) and the scheme
// can be misreported as http.
//
// This app ships with a docker-compose setup where Caddy (reverse proxy + automatic HTTPS)
// is the only container with a published port; the app container is reachable solely from
// Caddy over the private Docker network, never directly from the internet. That makes it
// safe to trust forwarded headers from any source here — ASP.NET Core's default restriction
// (loopback-only trusted proxies) would otherwise reject them, since Caddy's container IP
// isn't loopback. If you ever expose the app's port directly to the internet (bypassing
// Caddy), remove the KnownNetworks/KnownProxies clearing below and pin it to the real
// proxy's address instead.
var forwardedHeadersOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
};
forwardedHeadersOptions.KnownIPNetworks.Clear();
forwardedHeadersOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeadersOptions);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStatusCodePagesWithReExecute("/Error/{0}");

app.UseHttpsRedirection();

app.UseRouting();

app.UseRateLimiter();

app.UseAuthorization();

app.UseStaticFiles();
app.MapRazorPages();
app.MapLeadEndpoints();

app.Run();
