param(
    [string]$Server = "."
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$schemaPath = Join-Path $PSScriptRoot "schema.sql"
$seedPath = Join-Path $PSScriptRoot "seed.sql"
$sqlcmd = (Get-Command sqlcmd -ErrorAction Stop).Source

Write-Host "Using sqlcmd from: $sqlcmd"
Write-Host "Creating schema on server: $Server"
& $sqlcmd -S $Server -E -f 65001 -i $schemaPath

Write-Host "Seeding demo data and roles"
& $sqlcmd -S $Server -E -f 65001 -i $seedPath

Write-Host "Database setup completed."
Write-Host "Database: OnlineLibrary"
Write-Host "Admin login: admin@demo.local / Admin123"
Write-Host "Member login: student@demo.local / Member123"
