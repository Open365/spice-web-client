#!/bin/bash
set -e
set -u 
set -o pipefail

THISDIR="$(cd "$(dirname "$0")" && pwd)"
cd "$THISDIR"

mocha -u tdd -R nyan unittest/tests.js
