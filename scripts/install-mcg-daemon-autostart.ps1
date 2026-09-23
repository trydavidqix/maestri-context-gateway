[CmdletBinding(SupportsShouldProcess = $true)]
param([switch]$Uninstall)

$ErrorActionPreference = 'Stop'
$taskName = 'Maestri Context Gateway Daemon'
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$node = (Get-Command node.exe -ErrorAction Stop).Source
$entrypoint = (Resolve-Path (Join-Path $repoRoot 'bin\mcg.mjs')).Path
$currentUser = [System.Security.Principal.WindowsIdentity]::GetCurrent().Name
$expectedArguments = '"{0}" daemon' -f $entrypoint
$existing = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue

function Test-OwnedTask($task) {
    if (-not $task -or $task.Actions.Count -ne 1) { return $false }
    $action = $task.Actions[0]
    $sameNode = [string]::Equals([IO.Path]::GetFullPath($action.Execute), [IO.Path]::GetFullPath($node), [StringComparison]::OrdinalIgnoreCase)
    $sameDirectory = [string]::Equals([IO.Path]::GetFullPath($action.WorkingDirectory), $repoRoot, [StringComparison]::OrdinalIgnoreCase)
    return $sameNode -and $sameDirectory -and $action.Arguments -ceq $expectedArguments
}

if ($Uninstall) {
    if (-not $existing) { Write-Output "Autostart task not installed: $taskName"; exit 0 }
    if (-not (Test-OwnedTask $existing)) { throw "Refusing to remove '$taskName': its action does not match this MCG checkout." }
    if ($PSCmdlet.ShouldProcess($taskName, 'Unregister current-user MCG daemon autostart')) {
        Unregister-ScheduledTask -TaskName $taskName -Confirm:$false
        Write-Output "Removed autostart task: $taskName"
    }
    exit 0
}

if ($existing -and -not (Test-OwnedTask $existing)) {
    throw "A different task named '$taskName' already exists. It was left unchanged."
}

$action = New-ScheduledTaskAction -Execute $node -Argument $expectedArguments -WorkingDirectory $repoRoot
$trigger = New-ScheduledTaskTrigger -AtLogOn -User $currentUser
$principal = New-ScheduledTaskPrincipal -UserId $currentUser -LogonType Interactive -RunLevel Limited
$settings = New-ScheduledTaskSettingsSet -MultipleInstances IgnoreNew -RestartCount 3 `
    -RestartInterval (New-TimeSpan -Minutes 1) -ExecutionTimeLimit ([TimeSpan]::Zero) `
    -StartWhenAvailable -DontStopIfGoingOnBatteries -Hidden

if ($PSCmdlet.ShouldProcess("$taskName ($currentUser)", 'Register MCG daemon to start at user logon')) {
    Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $trigger -Principal $principal `
        -Settings $settings -Description 'Starts the local Maestri Context Gateway daemon at this user logon.' -Force | Out-Null
    $registered = Get-ScheduledTask -TaskName $taskName
    if (-not (Test-OwnedTask $registered) -or $registered.State -eq 'Disabled') {
        throw 'Scheduled task registration verification failed.'
    }
    Write-Output "Autostart ready for $currentUser; trigger: logon; run level: Limited; task state: $($registered.State)."
    Write-Output 'The daemon will start at the next logon. The dashboard remains manually launched.'
}
