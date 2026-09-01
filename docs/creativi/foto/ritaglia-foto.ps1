#Requires -Version 5.1
<#
  Ritaglia le quattro fotografie di campagna nelle misure dei social.

  Gli originali sono tutti 2000x1333, cioe' 3:2 orizzontale: nel feed di
  Facebook e Instagram e' il rapporto peggiore possibile, perche' su mobile
  occupa meno della meta' dello schermo che occuperebbe un 4:5. Questo script
  produce le tre misure che servono davvero, tenendo il soggetto al centro
  dell'inquadratura invece che al centro del file.

  Uso:
      powershell -ExecutionPolicy Bypass -File ritaglia-foto.ps1

  Gli originali non si toccano: i ritagli finiscono in
  wwwroot/img/campagne/foto/ritagli/ e si guardano da /interno/materiali-campagne.
#>

param(
  # Qualita' JPEG. 88 e' il punto in cui il file dimezza senza che si veda:
  # sopra 92 si pagano megabyte per niente, sotto 80 il rumore di compressione
  # si nota sulle tinte piatte (il fondo bianco della telecamera).
  [int]$Qualita = 88
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

# ------------------------------------------------------------------ #
# Le foto e il loro punto di fuoco                                    #
# ------------------------------------------------------------------ #

# `fuoco` e' la posizione orizzontale del soggetto nell'originale, da 0 (bordo
# sinistro) a 1 (bordo destro). Serve perche' il ritaglio centrato — quello che
# fa `center/cover` in CSS e qualunque taglio automatico — su tre foto su
# quattro mangia meta' soggetto: in nessuna di queste il soggetto sta al centro
# geometrico dell'inquadratura.
$FOTO = @(
  @{ nome = "privati-router"     ; fuoco = 0.56
     nota = "Il router sta nella meta' destra, in diagonale: centrato perde le antenne." }
  @{ nome = "privati-telecamera" ; fuoco = 0.50
     nota = "Gia' centrata. Il bianco intorno e' lo spazio per il titolo, va tenuto." }
  @{ nome = "aziende-switch"     ; fuoco = 0.45
     nota = "L'unica parte leggibile e' la fila di porte numerate, a sinistra del centro." }
  @{ nome = "aziende-porte"      ; fuoco = 0.38
     nota = "Le due placche e il bagliore rosso stanno nella meta' sinistra." }
)

# ------------------------------------------------------------------ #
# Le misure                                                           #
# ------------------------------------------------------------------ #

#   feed-verticale  la principale: e' il formato che occupa piu' schermo su
#                   mobile. Ritaglio secco, si perdono i lati.
#   quadrato        di riserva, per i posizionamenti che non accettano il 4:5.
#   storia          9:16. Qui NON si ritaglia: un 9:16 preso a morsi da un 3:2
#                   userebbe il 37% dell'originale e andrebbe poi ingrandito
#                   del 44%, cioe' molle. La foto resta intera a tutta
#                   larghezza e il resto dell'altezza lo riempie una copia di
#                   se stessa sfocata e scurita. Il soggetto non si tocca e la
#                   risoluzione resta quella nativa.
$MISURE = @(
  @{ nome = "feed-verticale" ; w = 1080 ; h = 1350 ; modo = "ritaglio" }
  @{ nome = "quadrato"       ; w = 1080 ; h = 1080 ; modo = "ritaglio" }
  @{ nome = "storia"         ; w = 1080 ; h = 1920 ; modo = "sfondo" }
)

# Nel 9:16 le app coprono 250px in alto (nome account) e 340px in basso
# (didascalia e pulsanti). La foto si posa a 520px dall'alto: sopra restano
# 270px liberi, sotto 340px, che e' dove va il titolo.
$STORIA_Y = 520

# ------------------------------------------------------------------ #
# Disegno                                                             #
# ------------------------------------------------------------------ #

function Nuovo-Grafico([System.Drawing.Bitmap]$tela) {
  $g = [System.Drawing.Graphics]::FromImage($tela)
  $g.InterpolationMode  = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode    = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode      = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  return $g
}

<#
  Il rettangolo dell'originale che riempie un contenitore di un dato rapporto
  senza deformare nulla: e' il "cover" del CSS, ma centrato sul punto di fuoco
  invece che sul centro del file. Si taglia solo il lato che avanza, e il
  rettangolo viene poi ricacciato dentro i bordi dell'immagine.
#>
function Rettangolo-Cover([int]$sw, [int]$sh, [double]$rapporto, [double]$fuoco) {
  if (($sw / $sh) -gt $rapporto) {
    # Il minimo protegge dall'arrotondamento: su una foto alta 1334 il calcolo
    # del 3:2 chiederebbe 2001 pixel di larghezza, uno piu' di quelli che ci sono.
    $w = [Math]::Min($sw, [int][Math]::Round($sh * $rapporto))
    $x = [int][Math]::Round($sw * $fuoco - $w / 2)
    $x = [Math]::Max(0, [Math]::Min($sw - $w, $x))
    return [System.Drawing.Rectangle]::new($x, 0, $w, $sh)
  }
  $h = [Math]::Min($sh, [int][Math]::Round($sw / $rapporto))
  $y = [Math]::Max(0, [int][Math]::Round(($sh - $h) / 2))
  return [System.Drawing.Rectangle]::new(0, $y, $sw, $h)
}

<#
  Disegna una porzione dell'originale dentro un rettangolo della tela.
  WrapMode TileFlipXY evita la riga di pixel sporchi che compare sul bordo
  quando si ridimensiona partendo da un ritaglio.
#>
function Disegna([System.Drawing.Graphics]$g, [System.Drawing.Image]$img,
                 [System.Drawing.Rectangle]$dest, [System.Drawing.Rectangle]$src) {
  $attr = [System.Drawing.Imaging.ImageAttributes]::new()
  $attr.SetWrapMode([System.Drawing.Drawing2D.WrapMode]::TileFlipXY)
  $g.DrawImage($img, $dest, $src.X, $src.Y, $src.Width, $src.Height,
               [System.Drawing.GraphicsUnit]::Pixel, $attr)
  $attr.Dispose()
}

<#
  Sfocatura ottenuta rimpicciolendo a francobollo e riportando alla misura
  piena: l'interpolazione fa il resto. Molto piu' rapida di una gaussiana vera
  e, per uno sfondo che deve solo stare indietro, indistinguibile.
#>
function Sfondo-Sfocato([System.Drawing.Image]$img, [int]$w, [int]$h, [double]$fuoco) {
  # 22x39 e non di piu': a francobollo piu' grande il soggetto resta
  # riconoscibile e la storia sembra avere due foto invece di una.
  $mini = [System.Drawing.Bitmap]::new(22, 39)
  $gm = Nuovo-Grafico $mini
  Disegna $gm $img ([System.Drawing.Rectangle]::new(0, 0, 22, 39)) `
          (Rettangolo-Cover $img.Width $img.Height ($w / $h) $fuoco)
  $gm.Dispose()

  $tela = [System.Drawing.Bitmap]::new($w, $h)
  $g = Nuovo-Grafico $tela
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBilinear
  Disegna $g $mini ([System.Drawing.Rectangle]::new(0, 0, $w, $h)) `
          ([System.Drawing.Rectangle]::new(0, 0, 22, 39))

  # Scurito col blu notte del marchio, e parecchio: lo sfondo non deve essere
  # una seconda immagine, deve essere il campo su cui la foto si stacca e su
  # cui il titolo bianco si legge. Resta solo un'ombra di colore della foto.
  #
  # CompositingQuality va riportato a Default proprio qui: HighQuality fonde
  # con la correzione gamma, e un velo scuro applicato cosi' perde meta' della
  # sua forza (bianco + nero all'85% esce 110 invece di 47). Va bene per
  # ridimensionare, non per coprire.
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::Default
  $velo = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(216, 10, 15, 34))
  $g.FillRectangle($velo, 0, 0, $w, $h)
  $velo.Dispose()
  $g.Dispose()
  $mini.Dispose()
  return $tela
}

function Salva-Jpeg([System.Drawing.Bitmap]$bmp, [string]$percorso, [int]$qualita) {
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
           Where-Object { $_.MimeType -eq 'image/jpeg' }
  $par = [System.Drawing.Imaging.EncoderParameters]::new(1)
  $par.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new(
                    [System.Drawing.Imaging.Encoder]::Quality, [int64]$qualita)
  $bmp.Save($percorso, $codec, $par)
  $par.Dispose()
}

# ------------------------------------------------------------------ #

$repo    = (Resolve-Path (Join-Path $PSScriptRoot '..\..\..')).Path
$origini = Join-Path $repo 'tecnolinkSite\wwwroot\img\campagne\foto'
$uscita  = Join-Path $origini 'ritagli'
if (-not (Test-Path $uscita)) { New-Item -ItemType Directory -Path $uscita | Out-Null }

foreach ($f in $FOTO) {
  $percorso = Join-Path $origini ($f.nome + '.jpg')
  if (-not (Test-Path $percorso)) { Write-Warning "manca $percorso"; continue }

  $img = [System.Drawing.Image]::FromFile($percorso)
  try {
    foreach ($m in $MISURE) {
      if ($m.modo -eq 'ritaglio') {
        $tela = [System.Drawing.Bitmap]::new($m.w, $m.h)
        $g = Nuovo-Grafico $tela
        Disegna $g $img ([System.Drawing.Rectangle]::new(0, 0, $m.w, $m.h)) `
                (Rettangolo-Cover $img.Width $img.Height ($m.w / $m.h) $f.fuoco)
        $g.Dispose()
      }
      else {
        $tela = Sfondo-Sfocato $img $m.w $m.h $f.fuoco
        $g = Nuovo-Grafico $tela
        # La foto resta 3:2 a tutta larghezza: si taglia solo il minimo per
        # arrivare al rapporto esatto, cosi' il soggetto non si perde mai.
        $hFoto = [int][Math]::Round($m.w * 2 / 3)
        Disegna $g $img ([System.Drawing.Rectangle]::new(0, $STORIA_Y, $m.w, $hFoto)) `
                (Rettangolo-Cover $img.Width $img.Height (3 / 2) $f.fuoco)
        $g.Dispose()
      }

      $nomeFile = '{0}-{1}.jpg' -f $f.nome, $m.nome
      $destinazione = Join-Path $uscita $nomeFile
      Salva-Jpeg $tela $destinazione $Qualita
      $tela.Dispose()

      $peso = [Math]::Round((Get-Item $destinazione).Length / 1KB)
      '  wwwroot/img/campagne/foto/ritagli/{0}  ({1}x{2}, {3} KB)' -f $nomeFile, $m.w, $m.h, $peso
    }
  }
  finally { $img.Dispose() }
}

'Fatto.'
