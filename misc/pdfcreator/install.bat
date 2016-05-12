@echo off
if "%1" == "" (
	echo Usage: %0 path\to\pdfcreator_setup.exe path\to\pdfcreator.inf file.reg
	exit /B 1
)

if "%2" == "" (
	echo Usage: %0 path\to\pdfcreator_setup.exe path\to\pdfcreator.inf file.reg
	exit /B 1
)

if "%3" == "" (
	echo Usage: %0 path\to\pdfcreator_setup.exe path\to\pdfcreator.inf file.reg
	exit /B 1
)

if not exist "%1" (
	echo %1 does not exist, abort
	exit /B 1
)

if not exist "%2" (
	echo %2 does not exist, abort
	exit /B 1
)

if not exist "%3" (
	echo %3 does not exist, abort
	exit /B 1
)

"%1" /LOADINF="%2" /REGFILE="%3" /SILENT
