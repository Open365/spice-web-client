@echo off

if "%1" == "" (
	echo Usage: %0 suffix
	exit /B 1
)

for %%x in ( hkcr hkcu hklm hku hkcc ) do (
	echo adding %%x to keys_%1.txt
	reg query %%x /f pdfcreator /k /s >> keys_%1.txt
)
