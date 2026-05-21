param(
    [string]$EnvFile
)

$ErrorActionPreference = 'Stop'

if (-not $EnvFile) {
    if (Test-Path -Path "new.env.yaml") {
        $EnvFile = "new.env.yaml"
    } elseif (Test-Path -Path "env.yaml") {
        $EnvFile = "env.yaml"
    } else {
        throw "No env file found. Provide -EnvFile or create env.yaml/new.env.yaml."
    }
}

if (-not (Test-Path -Path $EnvFile)) {
    throw "Env file not found: $EnvFile"
}

Write-Host "[seed] Using env file: $EnvFile"

# Parse very simple YAML lines: KEY: "value" / KEY: 'value' / KEY: value
Get-Content -Path $EnvFile | ForEach-Object {
    $line = $_.Trim()
    if (-not $line) { return }
    if ($line.StartsWith('#')) { return }

    if ($line -match '^(?<key>[A-Za-z_][A-Za-z0-9_]*)\s*:\s*(?:"(?<dq>[^"]*)"|''(?<sq>[^'']*)''|(?<bare>[^#\s]+))\s*(?:#.*)?$') {
        $key = $Matches['key']
        $val = $Matches['dq']
        if ($val -eq $null -or $val -eq '') { $val = $Matches['sq'] }
        if ($val -eq $null -or $val -eq '') { $val = $Matches['bare'] }

        if ($key) {
            Set-Item -Path ("Env:" + $key) -Value $val
        }
    }
}

Push-Location -Path "server"
try {
    Write-Host "[seed] Running: node seed.js"
    node seed.js
} finally {
    Pop-Location
}
