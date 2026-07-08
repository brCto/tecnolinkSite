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
        if (string.IsNullOrWhiteSpace(_settings.Host) || string.IsNullOrWhiteSpace(_settings.ToAddress))
        {
            _logger.LogWarning("SMTP non configurato: richiesta ricevuta ma non inoltrata via email. Oggetto: {Subject}. Mittente: {ReplyTo}", subject, replyToEmail);
            return false;
        }

        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(_settings.FromAddress, _settings.FromName),
                Subject = subject,
                Body = bodyHtml,
                IsBodyHtml = true
            };
            message.To.Add(_settings.ToAddress);

            if (!string.IsNullOrWhiteSpace(replyToEmail))
            {
                message.ReplyToList.Add(new MailAddress(replyToEmail, string.IsNullOrWhiteSpace(replyToName) ? replyToEmail : replyToName));
            }

            using var client = new SmtpClient(_settings.Host, _settings.Port)
            {
                EnableSsl = _settings.EnableSsl,
                Credentials = new NetworkCredential(_settings.User, _settings.Password)
            };

            await client.SendMailAsync(message, ct);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Invio email fallito. Oggetto: {Subject}", subject);
            return false;
        }
    }
}
