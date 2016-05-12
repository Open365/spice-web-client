#!/usr/bin/php
<?php
/*
 * 
 * Type: ./generateSpiceObject NameOfSpiceClass ObjectSize NumberOfFields
 * 
 * 
 */
$numargs = count($argv);

if ($numargs >= 3) {
	$SpiceClass = $argv[1];
	$ObjectSize = $argv[2];
	$NumberOfFields = $argv[3];
	$fields = array();
	$code = "";
	
	for($i = 0;$i < $NumberOfFields;$i++) {
		echo "\tInsert name and bytelength (or v+blocksize, example: v32) of a field (must be in order):\n\r";
		$line = trim(fgets(STDIN));
		list($name, $bytelength) = explode(' ', $line);
		array_push($fields, array($name, $bytelength));
	}
	
	$code .= "\nwdi.".$SpiceClass." = $.spcExtend(wdi.SpiceObject, {\r\n";
	$code .= "\tobjectSize:".$ObjectSize.",\r\n";

	$code .= "\r\n";

	$code .= "\tinit: function(c) {\r\n";
	$code .= "\t\tc?this.setContent(c):false;\r\n";
	$code .= "\t},\r\n";

	$code .= "\r\n\tsetContent: function(c) {\r\n";

	foreach($fields as $value) {
		$code .= "\t\tthis.".$value[0]." = c.hasOwnProperty('".$value[0]."') ? c.".$value[0].":0;\r\n";
	}

	$code .= "\t},\r\n";

	//marshaller
	$code .= "\r\n\tmarshall: function() {\r\n";
	$code .= "\t\tthis.rawData = [];\r\n";
	$code .= "\t\tthis.rawData = this.rawData.concat(\r\n";
	
	foreach($fields as $value) {
		if($value[1][0] == 'v') {
			$block = intval(substr($value[1], 1));
			$code .= "\t\t\tthis.arrayToBytes(this.".$value[0].", ".$block."),\r\n";
		} else {
			$code .= "\t\t\tthis.numberTo".($value[1]*8)."(this.".$value[0]."),\r\n";
		}
	}
	$code = substr($code, 0, -3);
	$code .= "\r\n\t\t);\r\n";
	$code .= "\t\treturn this.rawData;\r\n\t},\r\n";

	//demarshaller
	$code .= "\r\n\tdemarshall: function(queue) {\r\n";
	$code .= "\t\tthis.expectedSize = arguments[1] || this.objectSize;\r\n";
	$code .= "\t\tif (queue.getLength() < this.expectedSize) throw new wdi.Exception({message: 'Not enough queue to read', errorCode:3});\r\n";
	foreach($fields as $value) {
		if($value[1][0] == 'v') {
    	    $block = intval(substr($value[1], 1));
            $code .= "\t\tthis.".$value[0]." = this.bytesToArray(queue.shift(this.expectedSize), ".$block.");\r\n";
		} else {
            $code .= "\t\tthis.".$value[0]." = this.bytesToInt".($value[1]*8)."(queue.shift(".$value[1]."));\r\n";
        }
	}
	
	$code .= "\t\t'customDemarshall' in this?this.customDemarshall(queue):false;\r\n";
	$code .= "\r\n\t\treturn this;\r\n";

	$code .= "\t}\r\n";
	$code .= "});\r\n";
	
	echo $code;
} else {
	echo "You must especify NameOfSpiceClass ObjectSize and NumberOfFields\n\r";
}
