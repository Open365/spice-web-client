#!/usr/bin/php
<?php
$numargs = count($argv);

if ($numargs == 2) {
	$symbolsPath = $argv[1];
	$jsonPath = '../keyboard/symbols.js';
	
	if (is_dir($symbolsPath)) {
		if ($dh = opendir($symbolsPath)) {
			$data = array();
			//Reading directory
			while (false !== $file = readdir($dh)) {
				if (!is_dir($symbolsPath.$file) && $file !== 'Makefile.in' && $file !== 'Makefile.am' 
				 && $file !== '.' && $file !== '..' && $file !== 'symbols.dir') {
					echo "Processing file: ".$file."\n";
					$handle = fopen($symbolsPath.'/'.$file, 'r');
					if ($handle) {
						$data[$file] = array();
						$currentLayout = '';
						//Reading each line of each file
						while (!feof($handle)) {
							$line = fgets($handle);
							
							if ($pos = strpos($line, 'xkb_symbols "') !== false) {
								$currentLayout = substr($line, $pos+12, -4);
							} else if ($pos = strpos($line, 'include "') !== false) {
								if (strpos($line, 'level') === false) 
									$data[$file][$currentLayout]['include'] = substr($line, $pos+12, -2);
							} else if ($pos = strpos($line, 'key <') !== false) {
								$scancode = substr($line, $pos+8, $pos+3);
								$line = trim($line);
								$string = explode('[', $line);
								$string = explode(']', $string[1]);
								$pieces = explode(',', trim($string[0]));
								foreach ($pieces as $key => $keycode) {
									$keycode = trim($keycode);
									$data[$file][$currentLayout][$keycode] = array($scancode, $key);
								}
							}
						}
						fclose($handle);
					}
				}
			}
			closedir($dh);
		}
		
		//Generate json's : It is all in the same file because of dependencies with other layouts (include sentence)
		$string = 'wdi.keyboards = ';
		$string .= json_encode($data);
		
		$fp = fopen($jsonPath, 'w');
		fwrite($fp, $string);
		fclose($fp);
	} else {
		echo "Not valid directory\n";
	}
} else {
	echo "./generateKeyboardLayout.php /path/to/symbols\n";
}


