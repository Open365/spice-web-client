#!/bin/sh

test_awkExpression_wssToWs()
{
    expected=$(cat resources/expectedIndex.html)
    actual=$(cat resources/startIndex.html | sed -e 's/wss/ws/g')
    assertEquals "$expected" "$actual"
}
test_awkExpression_compiledWithIntegrationEnabledToNotEnabled()
{
    expected=$(cat resources/expectedJs.js)
    actual=$(cat resources/inputJs.js | sed -e 's/wdi.Mc=!0;/wdi.Mc=!1;/g')
    assertEquals "$expected" "$actual"
}
# load shunit2
. ../shunit2-2.1.6/src/shunit2