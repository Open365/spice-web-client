#!/bin/sh
set -e

sudo yum install -y libX11-devel cairo-devel mocha libjpeg-turbo-devel giflib-devel php-cli php
sudo npm install -g grunt-cli
sudo npm install -g istanbul
sudo npm install -g stomp mkdirp async
sudo npm install -g karma karma-mocha karma-chai karma-cli karma-junit-reporter
sudo npm install -g grunt-zip
sudo npm install -g npm-install-retry
sudo npm-install-retry --wait 500 --attempts 10
