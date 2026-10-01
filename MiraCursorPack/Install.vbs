Option Explicit
Dim fso, shell, source, target, roles, role, files, scheme, busy, keepBusy, backup, value, schemes, checkOnly, previous(16), index
Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")
source = fso.GetParentFolderName(WScript.ScriptFullName)
roles = Array("Arrow", "Help", "AppStarting", "Wait", "Crosshair", "IBeam", "NWPen", "No", "SizeNS", "SizeWE", "SizeNWSE", "SizeNESW", "SizeAll", "UpArrow", "Hand", "Pin", "Person")
checkOnly = False
If WScript.Arguments.Count > 0 Then checkOnly = (WScript.Arguments(0) = "/check")
For Each role In roles
 If role = "Wait" Then value = "Wait.ani" Else value = role & ".cur"
 If Not fso.FileExists(source & "\" & value) Then
  WScript.Echo "Missing cursor: " & value & ". Extract the whole ZIP first."
  WScript.Quit 1
 End If
Next
If checkOnly Then
 WScript.Echo "All 17 cursor assets present. Installer validation passed."
 WScript.Quit 0
End If
target = shell.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\MiraCursorPack"
If Not fso.FolderExists(target) Then fso.CreateFolder target
schemes = "HKCU\Control Panel\Cursors\Schemes\"
backup = ""
index = 0
For Each role In roles
 value = ""
 On Error Resume Next
 value = shell.RegRead("HKCU\Control Panel\Cursors\" & role)
 On Error GoTo 0
 If role = "Wait" Then busy = value
 previous(index) = value
 index = index + 1
Next
backup = Join(previous, ",")
On Error Resume Next
value = shell.RegRead(schemes & "Before Mira Cursor Pack")
If Err.Number <> 0 Then
 Err.Clear
 shell.RegWrite schemes & "Before Mira Cursor Pack", backup, "REG_SZ"
End If
On Error GoTo 0
keepBusy = MsgBox("Keep your current Busy cursor?" & vbCrLf & vbCrLf & "Yes keeps it. No uses the pack's animated pearl ring.", vbYesNo + vbQuestion + vbDefaultButton1, "Mira Cursor Pack")
scheme = ""
For Each role In roles
 If role = "Wait" Then value = "Wait.ani" Else value = role & ".cur"
 fso.CopyFile source & "\" & value, target & "\" & value, True
 value = target & "\" & value
 If role = "Wait" And keepBusy = vbYes Then value = busy
 If scheme <> "" Then scheme = scheme & ","
 scheme = scheme & value
Next
shell.RegWrite schemes & "Mira Cursor Pack", scheme, "REG_SZ"
shell.Run "control.exe main.cpl,,1", 1, False
MsgBox "Installed! In Pointers, select Mira Cursor Pack, then click Apply." & vbCrLf & vbCrLf & "To switch back, select Before Mira Cursor Pack." & vbCrLf & "No background app, no admin access, no internet.", vbInformation, "Mira Cursor Pack"