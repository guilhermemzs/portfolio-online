param([int]$Porta = 4173)

$ErrorActionPreference = 'Stop'
$pythonCodex = Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe'
Push-Location -LiteralPath $PSScriptRoot
try {
    Write-Host "Prévia em http://127.0.0.1:$Porta/  (Ctrl+C para encerrar)"
    if (Test-Path -LiteralPath $pythonCodex) {
        & $pythonCodex -m http.server $Porta --bind 127.0.0.1
    } elseif (Get-Command py -ErrorAction SilentlyContinue) {
        py -3 -m http.server $Porta --bind 127.0.0.1
    } else {
        python -m http.server $Porta --bind 127.0.0.1
    }
} finally {
    Pop-Location
}
