# ─── Load deploy.env ──────────────────────────────────────────────
$envFile = Join-Path $PSScriptRoot "deploy.env"
if (-not (Test-Path $envFile)) {
    Write-Host "ERROR: deploy.env not found. Copy deploy.env.example to deploy.env and fill in your values." -ForegroundColor Red
    exit 1
}

$config = @{}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
        $config[$matches[1].Trim()] = $matches[2].Trim()
    }
}

$GCP_PROJECT_ID  = $config["GCP_PROJECT_ID"]
$GCP_REGION      = $config["GCP_REGION"]
$GCP_REGISTRY    = $config["GCP_REGISTRY"]
$SERVICE_CLIENT  = $config["SERVICE_CLIENT"]
$SERVICE_SERVER  = $config["SERVICE_SERVER"]
$IMAGE_CLIENT    = $config["IMAGE_CLIENT"]
$IMAGE_SERVER    = $config["IMAGE_SERVER"]
$SERVER_ENV_FILE = $config["SERVER_ENV_FILE"]

$CLIENT_IMAGE_TAG = "$GCP_REGISTRY/$GCP_PROJECT_ID/$IMAGE_CLIENT"
$SERVER_IMAGE_TAG = "$GCP_REGISTRY/$GCP_PROJECT_ID/$IMAGE_SERVER"

# ─── Menu ─────────────────────────────────────────────────────────
$validChoices = @("1", "2", "3")
$choice = ""

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Kitchen Connection Deployment Menu " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  Project : $GCP_PROJECT_ID"
Write-Host "  Region  : $GCP_REGION"
Write-Host "-----------------------------------------"
Write-Host "1. Deploy Client (Frontend) Only"
Write-Host "2. Deploy Server (API) Only"
Write-Host "3. Deploy Both (Client & Server)"
Write-Host ""

while ($choice -notin $validChoices) {
    $choice = Read-Host "Enter your choice (1, 2, or 3)"
}

$deployClient = ($choice -eq "1" -or $choice -eq "3")
$deployServer = ($choice -eq "2" -or $choice -eq "3")

# ─── Deploy Client ────────────────────────────────────────────────
if ($deployClient) {
    Write-Host "`n>>> Building and Deploying CLIENT..." -ForegroundColor Yellow

    docker build -t $CLIENT_IMAGE_TAG -f Dockerfile.client .
    if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit $LASTEXITCODE }

    docker push $CLIENT_IMAGE_TAG
    if ($LASTEXITCODE -ne 0) { Write-Host "Push failed!" -ForegroundColor Red; exit $LASTEXITCODE }

    gcloud run deploy $SERVICE_CLIENT `
        --image $CLIENT_IMAGE_TAG `
        --platform managed `
        --region $GCP_REGION `
        --allow-unauthenticated
    if ($LASTEXITCODE -ne 0) { Write-Host "Deploy failed!" -ForegroundColor Red; exit $LASTEXITCODE }

    Write-Host "Client Deployed Successfully!`n" -ForegroundColor Green
}

# ─── Deploy Server ────────────────────────────────────────────────
if ($deployServer) {
    Write-Host "`n>>> Building and Deploying SERVER..." -ForegroundColor Yellow

    docker build -t $SERVER_IMAGE_TAG -f Dockerfile.server .
    if ($LASTEXITCODE -ne 0) { Write-Host "Build failed!" -ForegroundColor Red; exit $LASTEXITCODE }

    docker push $SERVER_IMAGE_TAG
    if ($LASTEXITCODE -ne 0) { Write-Host "Push failed!" -ForegroundColor Red; exit $LASTEXITCODE }

    gcloud run deploy $SERVICE_SERVER `
        --image $SERVER_IMAGE_TAG `
        --platform managed `
        --region $GCP_REGION `
        --allow-unauthenticated `
        --env-vars-file $SERVER_ENV_FILE
    if ($LASTEXITCODE -ne 0) { Write-Host "Deploy failed!" -ForegroundColor Red; exit $LASTEXITCODE }

    Write-Host "Server Deployed Successfully!`n" -ForegroundColor Green
}

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Deployment Completed Successfully! " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
