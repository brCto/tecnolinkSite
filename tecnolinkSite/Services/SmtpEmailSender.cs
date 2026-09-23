using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

namespace tecnolinkSite.Services;

public class SmtpEmailSender : IEmailSender
{
    private readonly SmtpSettings _settings;
    private readonly ILogger<SmtpEmailSender> _logger;

    public SmtpEmailSender(IOptions<SmtpSettings> settings, ILogger<SmtpEmailSender> logger)
    {
        _settings = settings.Value;
        _logger = logger;
    }

    public async Task<bool> SendAsync(string subject, string bodyHtml, string? replyToEmail, string? replyToName, CancellationToken ct = default)
    {
        // Modalità di prova: si scrive il messaggio su disco invece di spedirlo, così
        // si può verificare che i moduli producano la mail giusta senza avere ancora
        // le credenziali del server di posta.
        var scriveSuDisco = !string.IsNullOrWhiteSpace(_settings.PickupDirectory);

        if ((!scriveSuDisco && string.IsNullOrWhiteSpace(_settings.Host)) || string.IsNullOrWhiteSpace(_settings.ToAddress))
        {
            _logger.LogWarning("SMTP non configurato: richiesta ricevuta ma non inoltrata via email. Oggetto: {Subject}. Mittente: {ReplyTo}", subject, replyToEmail);
            return false;
        }

        try
        {
            // Il mittente resta un indirizzo di Tecnolink. Spedire "da" l'indirizzo di
            // chi compila il modulo sarebbe spoofing: il server di posta rifiuterebbe il
            // messaggio, oppure lo consegnerebbe in spam, perché SPF e DKIM del dominio
            // del visitatore non autorizzano il nostro server a spedire per lui.
            // Il risultato utile si ottiene lo stesso: nel nome visualizzato c'è chi ha
            // scritto, così in casella si vede subito da chi arriva la richiesta, e il
            // Reply-To qui sotto fa sì che "Rispondi" scriva davvero a lui.
            var mittenteVisualizzato = string.IsNullOrWhiteSpace(replyToName)
                ? _settings.FromName
                : $"{replyToName} (via sito Tecnolink)";

            using var message = new MailMessage
            {
                From = new MailAddress(_settings.FromAddress, mittenteVisualizzato),
                Subject = subject,
                Body = bodyHtml,
                IsBodyHtml = true
            };
            message.To.Add(_settings.ToAddress);

            if (!string.IsNullOrWhiteSpace(replyToEmail))
            {
                message.ReplyToList.Add(new MailAddress(replyToEmail, string.IsNullOrWhiteSpace(replyToName) ? replyToEmail : replyToName));
            }

            using var client = new SmtpClient();

            if (scriveSuDisco)
            {
                Directory.CreateDirectory(_settings.PickupDirectory);
                client.DeliveryMethod = SmtpDeliveryMethod.SpecifiedPickupDirectory;
                client.PickupDirectoryLocation = _settings.PickupDirectory;
            }
            else
            {
                client.Host = _settings.Host;
                client.Port = _settings.Port;
                // EnableSsl su SmtpClient significa STARTTLS: ci si connette in chiaro e
                // si alza la cifratura subito dopo, con un comando. NON significa SSL
                // implicito, quello della porta 465, dove la connessione nasce già
                // cifrata: questa classe non lo sa fare e non lo saprà mai fare (è
                // dichiarata obsoleta proprio per questo).
                //
                // Quindi la porta da configurare è quella STARTTLS del provider, di
                // norma la 587. Con la 465 l'invio resta appeso fino al timeout, la
                // richiesta non arriva a nessuno e il visitatore vede comunque il
                // messaggio di conferma: il modo peggiore in cui questa cosa può
                // rompersi. Se un giorno servisse davvero la 465, va sostituita la
                // libreria (MailKit), non cambiata la porta.
                client.EnableSsl = _settings.EnableSsl;
                client.Credentials = new NetworkCredential(_settings.User, _settings.Password);
            }

            await client.SendMailAsync(message, ct);

            if (scriveSuDisco)
            {
                _logger.LogInformation("Messaggio scritto in {Cartella} (modalità di prova, non spedito).", _settings.PickupDirectory);
            }
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Invio email fallito. Oggetto: {Subject}", subject);
            return false;
        }
    }
}
