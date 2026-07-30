namespace tecnolinkSite.Services;

public class SmtpSettings
{
    public string Host { get; set; } = "";
    public int Port { get; set; } = 587;
    public bool EnableSsl { get; set; } = true;
    public string User { get; set; } = "";
    public string Password { get; set; } = "";
    public string FromAddress { get; set; } = "";
    public string FromName { get; set; } = "Sito Tecnolink";
    public string ToAddress { get; set; } = "";

    /// <summary>
    /// Solo per le prove: se valorizzata, i messaggi vengono scritti come file .eml
    /// in questa cartella invece di essere spediti. Serve a verificare che i moduli
    /// producano la mail giusta prima di avere le credenziali del server di posta.
    /// In produzione va lasciata vuota.
    /// </summary>
    public string PickupDirectory { get; set; } = "";
}
