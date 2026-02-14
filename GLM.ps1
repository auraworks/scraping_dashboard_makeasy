# GLM (Global Model) Configuration Script for PowerShell
# Usage: .\GLM.ps1 on|off

$settingsDir = Join-Path $PSScriptRoot ".claude"
$settingsFile = Join-Path $settingsDir "settings.json"

function Show-Help {
    Write-Host "Usage: .\GLM.ps1 on|off"
    Write-Host ""
    Write-Host "Commands:"
    Write-Host "  on   - Enable GLM configuration with custom API settings"
    Write-Host "  off  - Disable GLM configuration (clear settings)"
    Write-Host ""
    Write-Host "This script manages .claude\settings.json configuration."
}

function Enable-GLM {
    Write-Host "🔧 Enabling GLM configuration..." -ForegroundColor Cyan
    
    if (-not (Test-Path $settingsDir)) {
        New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null
    }

    $config = @{
        env = @{
            ANTHROPIC_AUTH_TOKEN           = "bca79bcdcac34bd0ba5f4eccbf3dbcda.a4m8Cd5OPwCWyuos"
            ANTHROPIC_BASE_URL             = "https://api.z.ai/api/anthropic"
            ANTHROPIC_DEFAULT_OPUS_MODEL   = "GLM-5"
            ANTHROPIC_DEFAULT_SONNET_MODEL = "GLM-5"
            ANTHROPIC_DEFAULT_HAIKU_MODEL  = "GLM-5"
            API_TIMEOUT_MS                 = "3000000"
        }
    }

    $config | ConvertTo-Json | Set-Content -Path $settingsFile
    
    Write-Host "✅ GLM configuration enabled" -ForegroundColor Green
    Write-Host "📁 Settings saved to: $settingsFile"
}

function Disable-GLM {
    Write-Host "🔧 Disabling GLM configuration..." -ForegroundColor Cyan
    
    if (-not (Test-Path $settingsDir)) {
        New-Item -ItemType Directory -Path $settingsDir -Force | Out-Null
    }

    "{}" | Set-Content -Path $settingsFile
    
    Write-Host "✅ GLM configuration disabled" -ForegroundColor Green
    Write-Host "📁 Settings cleared in: $settingsFile"
}

# Main Logic
$command = $args[0]

switch ($command) {
    "on" { Enable-GLM }
    "off" { Disable-GLM }
    { $_ -in "help", "-h", "--help" } { Show-Help }
    $null {
        Write-Host "❌ Error: Missing command" -ForegroundColor Red
        Show-Help
        exit 1
    }
    Default {
        Write-Host "❌ Error: Unknown command '$command'" -ForegroundColor Red
        Show-Help
        exit 1
    }
}
