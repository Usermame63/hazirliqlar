@echo off
chcp 65001 >nul
echo ----------------------------------------------------
echo Linkleri Avtomatik Deyisdiren Script (Localhost - Render)
echo ----------------------------------------------------
echo Axtarilir: http://localhost:5000
echo Evez olunur: https://hazirliqlar-backend.onrender.com
echo ----------------------------------------------------
echo.

powershell -NoProfile -Command "$search='http://localhost:5000'; $replace='https://hazirliqlar-backend.onrender.com'; $files=Get-ChildItem -Path . -Recurse -File | Where-Object { $_.Extension -match '\.(tsx|ts|js|jsx)$' -and $_.FullName -notmatch '\\node_modules\\' -and $_.FullName -notmatch '\\.next\\' -and $_.FullName -notmatch '\\.git\\' }; $count=0; foreach ($file in $files) { $content=[System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8); if ($content.Contains($search)) { Write-Host ('[+] Deyisdirildi: ' + $file.FullName) -ForegroundColor Green; $newContent=$content.Replace($search, $replace); [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8); $count++ } }; echo ''; Write-Host ('Cemi ' + $count + ' faylda deyisiklik edildi!') -ForegroundColor Yellow"

echo.
echo ----------------------------------------------------
echo Emeliyyat tamamlandi! Pencereni baglaya bilersiniz.
pause