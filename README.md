Spice Web Client
================

## Overview

## How to use it

### Developing the spice client and testing the integration with in the desktop

When trying to solve bugs or develop new functionalities in the spice web client
we frequently need to put our changes in the desktop to see if everything works
correctly or not. For this purpose there is the `deploy_into_new_desktop.sh`
script present in the spice repo that does this. By default it compiles the
spice client and deploys it to the desktop as part of the eyeosvdiclient bower
component, but you can put it uncompiled too, if you pass the -u or --uncompiled
flag.

As the spice client goes inserted into the eyeosvdiclient component which in
turn is a bower component of the desktop, we need to pass the path to this repos
when we execute the script.

    // deploy all_compiled.js and WorkerProcess_c.js
    ~/repos/spice$ ./deploy_into_new_desktop.sh ~/repos/desktop ~/repos/eyeosvdiclient
    
    // deploy all_uncompiled.js and WorkerProcess.js
    ~/repos/spice$ ./deploy_into_new_desktop.sh -u ~/repos/desktop ~/repos/eyeosvdiclient

## Quick help

* Install modules

```bash
	$ npm install
	$ bower install
```

* Check tests

```bash
    $ ./tests.sh
```