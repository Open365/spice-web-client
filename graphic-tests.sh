#!/bin/bash
set -x
./execGraphicTests.sh &
TESTS_PID=$!
sleep 2
/opt/google/chrome/google-chrome --incognito http://localhost:9876/base &
echo "waiting tests..."
wait $TESTS_PID
echo "exiting tests..."
killall chrome
 


