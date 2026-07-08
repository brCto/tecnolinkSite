namespace tecnolinkSite.Services;

public interface IEmailSender
{
    /// <summary>
    /// Sends a notification email. Returns false (without throwing) if SMTP isn't configured
    /// or if delivery fails; callers should still treat the lead as captured (it's logged)
    /// and show the user a success message, falling back to a phone/email suggestion only
    /// if they want to surface delivery problems.
    /// </summary>
    Task<bool> SendAsync(string subject, string bodyHtml, string? replyToEmail, string? replyToName, CancellationToken ct = default);
}
