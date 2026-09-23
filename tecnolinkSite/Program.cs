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

// Intestazioni di sicurezza su ogni risposta, pagine ed errori compresi. Stanno qui
// e non nel Caddyfile perché così viaggiano con l'applicazione: se un domani il sito
// finisse dietro IIS o su App Service, non sparirebbero insieme al proxy.
//
// Si scrivono dentro OnStarting, non subito: il gestore delle eccezioni più sotto
// azzera la risposta prima di rendere la pagina /Error, e intestazioni scritte adesso
// se ne andrebbero con essa — proprio sulle risposte in cui servono di più.
//
// Manca di proposito una Content-Security-Policy: le pagine hanno stili e script in
// linea in quantità, e una policy sensata li romperebbe. Vale la pena aggiungerla,
// ma è un lavoro a sé, da fare con le pagine sotto gli occhi.
app.Use(async (context, next) =>
{
    context.Response.OnStarting(() =>
    {
        var headers = context.Response.Headers;
        // Niente indovinelli sul tipo di contenuto: un .txt caricato da un modulo non
        // deve poter essere eseguito come JavaScript perché il browser "ci ha visto" del codice.
        headers["X-Content-Type-Options"] = "nosniff";
        // Il referrer esce solo verso lo stesso sito o, fuori, ridotto al dominio.
        headers["Referrer-Policy"] = "strict-origin-when-cross-origin";
        // Nessuno ci carica dentro un iframe per sovrapporci sopra i propri pulsanti.
        headers["X-Frame-Options"] = "SAMEORIGIN";
        // Il sito non usa posizione, telecamera o microfono: che non possa chiederli
        // nemmeno uno script di terze parti finito qui dentro.
        headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=(), payment=()";
        return Task.CompletedTask;
    });

    await next();
});

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

// Immagini, CSS, script e video non cambiano quasi mai, e quando cambiano il loro
// indirizzo cambia con loro: site.css e site.js portano in coda una versione
// calcolata sul contenuto (asp-append-version), le librerie hanno il numero di
// versione nel percorso. Senza questa riga il browser li richiede di nuovo a ogni
// visita: sono qualche megabyte, e il video da solo ne pesa più di tre.
const int trentaGiorni = 60 * 60 * 24 * 30;
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.CacheControl = $"public, max-age={trentaGiorni}";
    }
});
app.MapRazorPages();
app.MapLeadEndpoints();

app.Run();
