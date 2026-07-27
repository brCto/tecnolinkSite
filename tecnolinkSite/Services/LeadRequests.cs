namespace tecnolinkSite.Services;

public record ContactRequest(
    string? Nome,
    string? Email,
    string? Telefono,
    string? Azienda,
    string? Dimensione,
    string? Messaggio,
    string? Source,
    string? Campagna,
    string? HpField);

public record ScanRequest(string? Azienda, string? Email, string? HpField);
