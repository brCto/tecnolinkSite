using System.ComponentModel.DataAnnotations;
using System.Net;

namespace tecnolinkSite.Services;

public static class LeadEndpoints
{
    private const int MaxShortField = 200;
    private const int MaxMessageField = 5000;

    public static void MapLeadEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api").RequireRateLimiting("leads");

        group.MapPost("/contact", async (ContactRequest req, IEmailSender email, ILogger<Program> logger, CancellationToken ct) =>
        {
            // Honeypot: bots tend to fill every field, including this hidden one. Pretend success.
            if (!string.IsNullOrEmpty(req.HpField))
            {
                logger.LogInformation("Contact form honeypot triggered, silently dropped.");
                return Results.Ok(new { ok = true });
            }

            var nome = Truncate(req.Nome, MaxShortField);
            var emailAddr = Truncate(req.Email, MaxShortField);
            var telefono = Truncate(req.Telefono, MaxShortField);
            var azienda = Truncate(req.Azienda, MaxShortField);
            var dimensione = Truncate(req.Dimensione, MaxShortField);
            var messaggio = Truncate(req.Messaggio, MaxMessageField);
            var source = Truncate(req.Source, MaxShortField);
            var campagna = Truncate(req.Campagna, MaxShortField);

            // Il messaggio è facoltativo: sulle landing delle campagne un campo di
            // testo obbligatorio costa più lead di quanti ne qualifichi.
            if (string.IsNullOrWhiteSpace(nome))
            {
                return Results.BadRequest(new { ok = false, error = "Il nome è obbligatorio." });
            }
            if (string.IsNullOrWhiteSpace(emailAddr) || !new EmailAddressAttribute().IsValid(emailAddr))
            {
                return Results.BadRequest(new { ok = false, error = "Indirizzo email non valido." });
            }

            var body = $"""
                <h2>Nuova richiesta dal sito Tecnolink</h2>
                <p><strong>Pagina:</strong> {WebUtility.HtmlEncode(source ?? "n/d")}</p>
                <p><strong>Nome:</strong> {WebUtility.HtmlEncode(nome)}</p>
                <p><strong>Email:</strong> {WebUtility.HtmlEncode(emailAddr)}</p>
                <p><strong>Telefono:</strong> {WebUtility.HtmlEncode(Or(telefono))}</p>
                <p><strong>Azienda:</strong> {WebUtility.HtmlEncode(Or(azienda))}</p>
                <p><strong>Dimensione rete:</strong> {WebUtility.HtmlEncode(Or(dimensione))}</p>
                <p><strong>Campagna:</strong> {WebUtility.HtmlEncode(Or(campagna))}</p>
                <p><strong>Messaggio:</strong><br/>{WebUtility.HtmlEncode(Or(messaggio)).Replace("\n", "<br/>")}</p>
                """;

            var sent = await email.SendAsync($"Nuova richiesta dal sito — {nome}", body, emailAddr, nome, ct);
            return Results.Ok(new { ok = true, delivered = sent });
        });

        group.MapPost("/security-check", async (ScanRequest req, IEmailSender email, ILogger<Program> logger, CancellationToken ct) =>
        {
            if (!string.IsNullOrEmpty(req.HpField))
            {
                logger.LogInformation("Security-check form honeypot triggered, silently dropped.");
                return Results.Ok(new { ok = true });
            }

            var azienda = Truncate(req.Azienda, MaxShortField);
            var emailAddr = Truncate(req.Email, MaxShortField);

            if (string.IsNullOrWhiteSpace(azienda))
            {
                return Results.BadRequest(new { ok = false, error = "Il nome azienda è obbligatorio." });
            }
            if (string.IsNullOrWhiteSpace(emailAddr) || !new EmailAddressAttribute().IsValid(emailAddr))
            {
                return Results.BadRequest(new { ok = false, error = "Indirizzo email non valido." });
            }

            var body = $"""
                <h2>Nuova richiesta di Security Check gratuito</h2>
                <p><strong>Azienda:</strong> {WebUtility.HtmlEncode(azienda)}</p>
                <p><strong>Email:</strong> {WebUtility.HtmlEncode(emailAddr)}</p>
                """;

            var sent = await email.SendAsync($"Richiesta Security Check — {azienda}", body, emailAddr, azienda, ct);
            return Results.Ok(new { ok = true, delivered = sent });
        });
    }

    private static string Or(string? value) => string.IsNullOrWhiteSpace(value) ? "n/d" : value;

    private static string? Truncate(string? value, int maxLength)
    {
        if (string.IsNullOrEmpty(value)) return value;
        value = value.Trim();
        return value.Length > maxLength ? value[..maxLength] : value;
    }
}
