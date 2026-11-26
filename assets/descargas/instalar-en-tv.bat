@echo off
rem Instala el lanzador de HerzSA TV en un televisor Samsung con un clic (se hace una sola vez por televisor).
rem Antes: Tizen Studio con TV Extensions y Samsung Certificate Extension, el perfil de certificado de Samsung
rem creado (con el DUID de este televisor) y el televisor en modo desarrollador con la IP de esta PC.
rem Poner este archivo junto a HerzSA-TV-Samsung-Lanzador-*.wgt y hacer doble clic.
setlocal
set TIZEN=C:\tizen-studio\tools\ide\bin\tizen.bat
set SDB=C:\tizen-studio\tools\sdb.exe
if not exist "%TIZEN%" set /p TIZEN=No encuentro Tizen Studio. Ruta de tizen.bat:
if not exist "%SDB%" for %%d in ("%TIZEN%\..\..\..") do set SDB=%%~fd\sdb.exe

set WGT=
for %%f in ("%~dp0HerzSA-TV-Samsung-Lanzador-*.wgt") do set WGT=%%~ff
if "%WGT%"=="" ( echo No encuentro HerzSA-TV-Samsung-Lanzador-*.wgt junto a este archivo. & pause & exit /b 1 )

set /p IP=IP del televisor (Configuracion - General - Red - Estado de la red):
set /p PERFIL=Nombre del perfil de certificado de Samsung (Certificate Manager):

echo.
echo Conectando con %IP% ...
"%SDB%" connect %IP%
if errorlevel 1 ( echo No se pudo conectar. Revise el modo desarrollador y la IP de la PC en el televisor. & pause & exit /b 1 )

echo Firmando %WGT% ...
copy /y "%WGT%" "%TEMP%\HerzSA-TV.wgt" >nul
call "%TIZEN%" package -t wgt -s %PERFIL% -- "%TEMP%\HerzSA-TV.wgt"
if errorlevel 1 ( echo No se pudo firmar. Revise el nombre del perfil. & pause & exit /b 1 )

echo Instalando ...
call "%TIZEN%" install -n "%TEMP%\HerzSA-TV.wgt" -s %IP%:26101
if errorlevel 1 ( echo No se pudo instalar. & echo Si dice "certificate": en Tizen Studio vaya a Tools - Device Manager, haga clic derecho en el televisor, elija "Permit to install applications" y vuelva a ejecutar este archivo. & echo Si sigue igual, agregue el DUID del televisor al certificado de distribuidor en Certificate Manager. & pause & exit /b 1 )

echo.
echo Listo: HerzSA TV quedo instalada. Desde ahora se actualiza sola al abrirla.
pause
