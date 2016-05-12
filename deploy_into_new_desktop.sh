#!/bin/bash
set -e
set -u

THISDIR="$(cd "$(dirname "$0")" && pwd)"

usage() {
	cat <<USAGE
Usage: $0 [OPTIONS] path/to/desktop

Compiles the spice artifact and puts it into Desktop

OPTIONS are:
  -h, --help           Show this help and exit
  -u, --uncompiled     Deploy the uncompiled version
USAGE
}

status() {
	echo -e "\033[00;01;33m[+] $*\033[00m"
}

USE_COMPILED=1

# process commandline options
OUTOPT=$(getopt --options uh --longoptions uncompiled,help -n "$0" -- "$@")
eval set -- "$OUTOPT"
while true
do
	case "$1" in
		-h|--help)
			usage
			exit 0
			;;
		-u|--uncompiled)
			USE_COMPILED=
			shift 1
			;;
		--)
			# end of processed getopt options, break the loop
			shift
			break
			;;
		*)
			echo "Unexpected error while processing commandline options" >&2
			exit 1
			;;
	esac
done

if [ "$#" -ne 1 ]
then
	usage >&2
	exit 1
fi

SPICE_REPO="$THISDIR"
DESKTOP_REPO="$1"
PUBLIC_SPICEPATH="/bower_components/spice-web-client"

if [ "$USE_COMPILED" ]
then
	WORKER_TO_USE=application/WorkerProcess_c.js
	COMPILED_TO_USE=all_compiled.js
else
	WORKER_TO_USE=application/WorkerProcess.js
	COMPILED_TO_USE=all_uncompiled.js
fi

status "Using $COMPILED_TO_USE and $WORKER_TO_USE"

cd "$SPICE_REPO"
status "Generating $COMPILED_TO_USE and $WORKER_TO_USE"
if [ "$USE_COMPILED" ]
then
	grunt compile
else
	php compile.php -d --uncompiled build/compiler.jar
fi

status "Copying files into correct places"
cp -v "$COMPILED_TO_USE" "$DESKTOP_REPO/$PUBLIC_SPICEPATH"/all_compiled.js
cp --parents -v "$WORKER_TO_USE" "$DESKTOP_REPO/$PUBLIC_SPICEPATH"


status "
******
******  DEPLOY DONE
******
******  Now go to $DESKTOP_REPO and do whatever you need.
******
******    (grunt serve, grunt build, ./package.sh, ...)
******
"
