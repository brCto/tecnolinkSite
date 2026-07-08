namespace tecnolinkSite.Services;

public record ContactRequest(string? Nome, string? Email, string? Azienda, string? Messaggio, string? Source, string? HpField);

public record ScanRequest(string? Azienda, string? Email, string? HpField);
