# Sintesi vocale delle battute del narratore.
# Chiamato da narrazione.mjs, che prepara il manifesto JSON e legge i WAV prodotti.

param([Parameter(Mandatory = $true)][string]$Manifesto)

Add-Type -AssemblyName System.Speech

$voci = (New-Object System.Speech.Synthesis.SpeechSynthesizer).GetInstalledVoices()
$italiana = $voci | Where-Object { $_.VoiceInfo.Culture.Name -like 'it*' } | Select-Object -First 1

if ($null -eq $italiana) {
    Write-Error "Nessuna voce italiana installata. Si aggiunge da Impostazioni > Ora e lingua > Lingua e area geografica > Italiano > Opzioni > Voce."
    exit 1
}

$nome = $italiana.VoiceInfo.Name
Write-Host "  voce: $nome"

$battute = Get-Content -Raw -Encoding UTF8 $Manifesto | ConvertFrom-Json

foreach ($b in $battute) {
    # Un sintetizzatore nuovo per battuta: riusare lo stesso dopo
    # SetOutputToWaveFile lascia ogni tanto il file aperto e il successivo
    # esce troncato.
    $s = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $s.SelectVoice($nome)
    $s.Rate = 1          # un filo più svelto del normale: le scene sono corte
    $s.Volume = 100
    $s.SetOutputToWaveFile($b.file)
    $s.Speak($b.testo)
    $s.SetOutputToNull()
    $s.Dispose()
    Write-Host ("  " + [System.IO.Path]::GetFileName($b.file))
}
