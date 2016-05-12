#!/bin/bash
set -e
set -u
set -x

THISDIR="$(dirname "$(readlink -f "$0")")"

#sudo yum install -y xorg-x11-server-Xvfb
#sudo yum localinstall -y --nogpgcheck http://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm http://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
#sudo yum install -y xorg-x11-drv-nvidia-libs


# url: http://localhost/spice/?vmport=5915&performanceTest=true&host=localhost&port=8956&vmhost=192.168.1.90
# to (try to) run chrome headless: LIBGL_DEBUG=verbose xvfb-run --server-args='-screen 4, 1024x768x8' google-chrome -start-maximized --enable-logging --v=1 --incognito --user-data-dir=/tmp/chromelog 'http://localhost/spice/?vmport=5915&performanceTest=true&host=localhost&port=8956&vmhost=192.168.1.90'


USER_DATA_DIR="/tmp/chromelog"
CHROME_DEBUG="$USER_DATA_DIR/chrome_debug.log"

Xvfb :99 -screen 0 1024x768x24 &
XVFB_PID="$!"
sleep 10
rm -f "$CHROME_DEBUG"

DISPLAY=:99 google-chrome \
	--start-maximized \
	--enable-logging \
	--v=1 \
	--new-window \
	--user-data-dir="$USER_DATA_DIR" \
	'http://localhost/spice/?vmport=5915&performanceTest=true&host=localhost&port=8956&vmhost=192.168.1.90' &
CHROME_PID="$!"

while [ ! -f "$CHROME_DEBUG"  ]
do
	echo sleep
	sleep 1
done

echo "$CHROME_DEBUG created!"

tail -n 4000 -f "$CHROME_DEBUG" \
	| sed -n '/BEGIN OF PERFORMANCE STATS/,/END OF PERFORMANCE STATS/p' \
	| tail -n +2 \
	| head -n -1 \
		> "$THISDIR/performanceResults.txt" &
NOSEQUE_PID="$!"
ps ax|grep "$NOSEQUE_PID"

sleep 50
kill "$NOSEQUE_PID" "$CHROME_PID" "$XVFB_PID"
