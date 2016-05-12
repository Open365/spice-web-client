@echo off

if "%1" == "" (
	echo Usage: %0 suffix
	exit /B 1
)

if not exist "keys_%1.txt" (
	echo keys_%1.txt does not exist, abort
	exit /B 1
)

for /F "tokens=*" %%x in (keys_%1.txt) do (
	reg query "%%x" /s
)
