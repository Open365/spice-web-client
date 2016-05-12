#!/bin/sh

set -e

origFile=index.html
tmpfile=$origFile.tmp
cat index.html | sed -e 's/wss/ws/g' > $tmpfile
mv $tmpfile $origFile
rm -fr /var/www/html/spice/*;cp -r * /var/www/html/spice
#wget -O spice_client.zip --auth-no-challenge --http-user=git-server --http-password=git-server --no-check-certificate https://jenkinsfedora.eyeosbcn.com:8080/job/spice/lastSuccessfulBuild/artifact/*zip*/archive.zip?token=be483a1abf87efceda9afc7e23a24c6a
