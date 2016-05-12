<?php

global $removeDebug;
$removeDebug = true;

for ($i = 1; $i < $argc; $i++) {
    if (substr($argv[$i], 0, 1) == '-') {
        // option
        if ($argv[$i] == '-d') {
            $removeDebug = false;
        } else {
            die('Unrecognized option');
        }
    } else {
        die('This command doesn\'t accept arguments, only options.');
    }
}

$listToCompile = getListToCompile();
if(!$listToCompile) {
    die ("The file tocompile.list can't be found.");
}

$newAllInOne = generateNewAllInOne($listToCompile);
if(!$newAllInOne){
    die ("Cannot create new all_uncompiled.js");
}

if (!compileFile('all_uncompiled.js', 'all_compiled.js')) {
	die ("cannot generate all_compiled.js");
}
if (!compileFile('application/WorkerProcess.js', 'application/WorkerProcess_c.js')) {
	die ("cannot generate WorkerProcess_c.js");
}
system("sed -i 's/WorkerProcess.js/WorkerProcess_c.js/' all_compiled.js");

function getListToCompile() {
    $list = file("./tocompile.list", FILE_SKIP_EMPTY_LINES);
    return $list;
}

function generateNewAllInOne($list){
    $fp = fopen('all_uncompiled.js', 'w');
    if(!$fp){
        return false;
    }
    foreach($list as $fileRaw) {
        $file = trim($fileRaw);
        $content = file_get_contents($file);
        if(!$content){
            echo "Cannot read file: " . $file;
            continue;
        }
        global $removeDebug;
        if ($removeDebug) {
            $regex = '/wdi\.Debug\.[a-z]+\([^\)]+\)\;/';
            $content = preg_replace($regex, '', $content);
            $content = str_replace('"Not enough queue to read"', '"errq"', $content);
        }
        fwrite($fp, $content);
        fwrite($fp, "\n");
    }
    fclose($fp);
    return true;
}

function compileFile($orig, $compiled) {
	// just keep both files the same at the moment. In the future we might want
	// to minify the 'compiled' file. We need to keep generating the 'compiled'
	// file because it is what our dependencies are using.
	return copy($orig, $compiled);
}
