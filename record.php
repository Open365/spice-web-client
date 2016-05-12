<?php
error_reporting(E_ALL);
if(isset($_REQUEST['data']) && isset($_REQUEST['name'])) {
    $path = '/tmp/'.basename($_REQUEST['name']);
    file_put_contents($path, $_REQUEST['data']);
    print "Stored in ".$path;
} else {
    print "Error";
}

?>
