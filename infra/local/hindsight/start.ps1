param(
    [switch]$AllowNonSensitiveGeminiData
)

$ErrorActionPreference = 'Stop'
$VenvPython = Join-Path $PSScriptRoot '.venv\Scripts\python.exe'

if (-not (Test-Path -LiteralPath $VenvPython)) {
    throw 'Hindsight is not installed. Run .\infra\local\hindsight\install.ps1 first.'
}
if ([string]::IsNullOrWhiteSpace($env:GEMINI_API_KEY)) {
    throw 'GEMINI_API_KEY is missing. Set it in this PowerShell process; its value is never written by this script.'
}
if (-not $AllowNonSensitiveGeminiData) {
    throw 'Free-tier Gemini content may be used to improve Google products. Use only explicitly allowed, non-sensitive data; pass -AllowNonSensitiveGeminiData to acknowledge this boundary.'
}

$managedEnvironment = @{
    HINDSIGHT_API_HOST = '127.0.0.1'
    HINDSIGHT_API_PORT = '8888'
    HINDSIGHT_API_DATABASE_URL = 'pg0://nexus-dev'
    HINDSIGHT_API_LLM_PROVIDER = 'gemini'
    HINDSIGHT_API_LLM_MODEL = 'gemini-3.5-flash'
    HINDSIGHT_API_LLM_API_KEY = $env:GEMINI_API_KEY
    HINDSIGHT_API_LLM_MAX_RETRIES = '0'
    HINDSIGHT_API_LLM_DEBUG_DUMP_4XX = 'false'
    HINDSIGHT_API_EMBEDDINGS_PROVIDER = 'local'
    HINDSIGHT_API_RERANKER_PROVIDER = 'local'
    HINDSIGHT_API_WORKER_ENABLED = 'true'
    PYTHONUTF8 = '1'
}
$previousEnvironment = @{}
foreach ($name in $managedEnvironment.Keys) {
    $previousEnvironment[$name] = [Environment]::GetEnvironmentVariable($name, 'Process')
    [Environment]::SetEnvironmentVariable($name, $managedEnvironment[$name], 'Process')
}

try {
    Write-Host 'Starting Hindsight on localhost only. No cloud resources or paid fallback are configured.'
    & (Join-Path $PSScriptRoot '.venv\Scripts\hindsight-api.exe') --host 127.0.0.1 --port 8888
}
finally {
    foreach ($name in $managedEnvironment.Keys) {
        [Environment]::SetEnvironmentVariable($name, $previousEnvironment[$name], 'Process')
    }
}
