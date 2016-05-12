#!/usr/bin/bash
set -u
set -e

workDirectory='/tmp/patch-desktop-debug-vdi';
if [ -d "$workDirectory" ]
then
	echo "Removing previously used working directory: $workDirectory"
	rm -rf $workDirectory
fi

mkdir $workDirectory
cd $workDirectory

git clone http://gitlab.eyeosbcn.com/eyeos/desktop.git
git clone http://gitlab.eyeosbcn.com/eyeos/eyeosvdiclient.git
git clone http://gitlab.eyeosbcn.com/eyeos/spice.git

cd desktop
npm install && bower install
cd ../eyeosvdiclient
npm install && bower install
cd ../spice
npm install && bower install

./deploy_into_new_desktop.sh -u ../desktop/ ../eyeosvdiclient/

cd ../desktop

sudo cp bower_components/eyeosvdiclient/build/eyeosVdiClient.js \
		/usr/share/nginx/html/desktop/bower_components/eyeosvdiclient/build
sudo cp bower_components/eyeosvdiclient/bower_components/spice-web-client/application/WorkerProcess.js \
		/usr/share/nginx/html/desktop//bower_components/eyeosvdiclient/bower_components/spice-web-client/application/WorkerProcess.js