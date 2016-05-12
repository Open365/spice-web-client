<?php
function my_die($msg) {
    if (!headers_sent()) {
        header('HTTP/1.1 500 Internal Server Error');
    }
    die($msg);
}

if(isset($_POST['name']) && isset($_POST['data'])) {
    $basepath = 'unittest/';
    $testfolder = $basepath . 'graphictestfiles/';
    $uri = $testfolder . basename($_POST['name']);

    if (file_put_contents($uri, $_POST['data']) === false) {
        my_die('File could not be written');
    }

    $uriPushString = 'uris.push("' . $uri . '");' . "\n";

    if (file_put_contents($testfolder . 'uris.js', $uriPushString, FILE_APPEND | LOCK_EX) === false) {
        my_die('File could not be written');
    }
} else if (isset($_POST['replay']) && isset($_POST['data'])) {
    $basepath = './';
    $scriptfolder = $basepath . 'replay/';

    if (file_put_contents($scriptfolder . "data.js", "replayData = " . $_POST['data'] . ";") === false) {
        my_die('File could not be written');
    }
}

?>
