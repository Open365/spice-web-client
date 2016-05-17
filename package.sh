#!/bin/sh
set -x
set -u
set -e

archive_files_from_bower_library() {
	local tgz="$1"

	# extract all files from the 'main' field in bower json and tar those
	# files (and also bower.json, that it is not in 'main')
	cat bower.json \
	| ./extractMainFromBower.js \
	| xargs tar czvf "$tgz" bower.json
}

THISDIR="$(cd "$(dirname "$0")" && pwd)"
cd "$THISDIR"

npm install

versionJson="$(./extractJsonVersion.js package.json)"
versionGit="$(git describe --all --long | cut -d "-" -f 3)"
version=${versionJson}_${versionGit}
file=pkgs/spice-web-client-$version.tar.gz

# build.properties will be archived by jenkins for future build steps, and as
# properties files don't follow the same rules as bash files, do not wrap the
# variable values in quotes, or the quotes will end up being part of the value.
cat > build.properties <<BUILD
file=$file
version=$versionJson
BUILD

grunt compile

mkdir -p pkgs
archive_files_from_bower_library "$file"
