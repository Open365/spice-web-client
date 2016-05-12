#!/bin/bash

set -e
set -u
set -x

THISDIR="$(cd "$(dirname "$0")" && pwd)"
cd "$THISDIR"

npm install
grunt commit-stage
