#!/usr/bin/php
<?php
/*
*
* Javascript WDI Code Generator
* 15/5/12
*
*/

if(count($argv) != 2) {
	die("Usage: ".$argv[0]." filename.xml\n");
}

$myxml = simplexml_load_file($argv[1]);

//enums
$enums = array();
foreach($myxml->Enumeration as $enumerator) {
	$id = (string)$enumerator->attributes()->id;
	$name = (string)$enumerator->attributes()->name;

	//some enums have no name, so we need to make it global under some name
	//we are going to group it under the name SpiceVars
	//gcc-xml identify this nameless enums using ._X
	//where X is a incremental number
	//so with the first character of the name, we can tell if its nameless or not
	if($name{0} == '.') {	
		$name = 'SpiceVars';
	}

	$pack = array('object_type'=>'enum', 'id' => $id, 'name' => $name, 'values' => array());

	foreach($enumerator->EnumValue as $val) {
		//if enum already exists, add more content, but not erase it
		if(isset($enums[$name])) {
			$enums[$name]['values'][] = array('key'=> (string)$val->attributes()->name ,'value'=>(string)$val->attributes()->init);
		} else {
			$pack['values'][] = array('key'=> (string)$val->attributes()->name ,'value'=>(string)$val->attributes()->init);
		}
	}


	if(!isset($enums[$name])) {
		$enums[$name] = $pack;
	}
}

$code = "";
//from here, we can generate code
foreach($enums as $value) {
	$code .= "\nwdi.".$value['name']." = {\n";
	foreach($value['values'] as $current) {
		$code .= "\t'".$current['key']."':".$current['value'].",\n";
	}
	$code = substr($code,0,strlen($code)-2);
	$code .= "\n}\n";
}

echo $code."\n\n";

//fundamental types
$fundamentals = array();
foreach($myxml->FundamentalType as $fundamental) {
	$name = (string)$fundamental->attributes()->name;
	$id = (string)$fundamental->attributes()->id;
	$size = (string)$fundamental->attributes()->size;
	$fundamentals[$id] = array('object_type'=>'fundamental', 'name' => $name, 'size'=>$size);
}

//typedefs
$typedefs = array();
foreach($myxml->Typedef as $typedef) {
        $name = (string)$typedef->attributes()->name;
        $id = (string)$typedef->attributes()->id;
        $type = (string)$typedef->attributes()->type;
        $typedefs[$id] = array('object_type'=>'typedefs', 'name'=>$name, 'type'=>$type);
}

//arraytypes
$arraytypes = array();
foreach($myxml->ArrayType as $arraytype) {
        $min = (string)$arraytype->attributes()->min;
        $max = (string)$arraytype->attributes()->max;
        $size = (string)$arraytype->attributes()->size;
        $type = (string)$arraytype->attributes()->type;
        $id = (string)$arraytype->attributes()->id;

        $arraytypes[$id] = array('object_type' => 'arraytype', 'min'=>$min, 'max'=>$max, 'type'=>$type, 'size'=>$size);
}


//referencetype
$referenceTypes = array();
foreach($myxml->ReferenceType as $referencetype) {
	$id = (string)$referencetype->attributes()->id;
	$type = (string)$referencetype->attributes()->type;
	$size = (string)$referencetype->attributes()->size;
	$referenceTypes[$id] = array('object_type'=>'reference', 'type'=>$type, 'size'=>$size);
}


//cvqualifiedtype
$cvtypes = array();
foreach($myxml->CvQualifiedType as $cv) {
	$id = (string)$cv->attributes()->id;
	$type = (string)$cv->attributes()->type;
	$isconst = (string)$cv->attributes()->const;
	$cvtypes[$id] = array('object_type'=>'cvtype', 'type'=>$type, 'const'=>$isconst);
}


//fields
$fields = array();
foreach ($myxml->Field as $field) {
	$id = (string)$field->attributes()->id;
	$name = (string)$field->attributes()->name;
	$type = (string)$field->attributes()->type;
	$offset = (string)$field->attributes()->offset;
	$fields[$id] = array('object_type'=>'field','name'=>$name, 'type'=>$type, 'offset'=>$offset);
}

//structs
$structs = array();
foreach($myxml->Struct as $stru) {
	$id = (string)$stru->attributes()->id;
	$name = (string)$stru->attributes()->name;
	$size = (string)$stru->attributes()->size;
	$members = explode(' ', (string)$stru->attributes()->members);
	$sizemem = count($members);
	for($i=0;$i<$sizemem;$i++) {
		$currentId = $members[$i];
		if($currentId) {
			if(isset($fields[$currentId])) {
				$members[$i] = $fields[$currentId];
			} else {
				unset($members[$i]);
			}
		} else {
			unset($members[$i]);
		}
	}
	$structs[$id] = array('object_type'=>'struct', 'name'=>$name, 'size'=>$size, 'members' => $members);
}


//echo $code;
$code = "";
$parsedMembers = array();
foreach($structs as $struct) {
	$name = $struct['name'];
	$size = $struct['size'];
	
	foreach($struct['members'] as $member) {
		if(!empty($member['type'])) {
			$type = $member['type'];
			if(isset($fundamentals[$type])) {
				$type = $fundamentals[$type];
			} elseif(isset($typedefs[$type])) {
				//a typedef could be almost anything
				if(isset($fundamentals[$typedefs[$type]['type']])) {
					$type = $fundamentals[$typedefs[$type]['type']];
				} elseif(isset($structs[$typedefs[$type]['type']])) {
					$type = $structs[$typedefs[$type]['type']];
				} 
			} elseif(isset($refencetypes[$type])) {
				$type = $referencetypes[$type];
			} elseif(isset($arraytypes[$type])) {
				$type = $arraytypes[$type];
			}
		}

		//at this point, type should be an array, if its still an string
		//it means recursive typedefs or similar
		if(!is_array($type)) {
			if(isset($typedefs[$type]) && $typedefs[$type]['name'] == 'QXLPHYSICAL') {
				$type = array('type'=> 'QXLPHYSICAL');
			}
		}

		if(isset($type['max'])) {
			if(isset($fundamentals[$type['type']])) {
				$realType = $fundamentals[$type['type']];
			} elseif(isset($typedefs[$type['type']])) {
				$realType = $fundamentals[$typedefs[$type['type']]['type']];
			}
			//echo "\t".$member['name']." -> ".$realType['name']."[".$type['size'] / $realType['size']."]: ".$type['size']."\n";
			$parsedMembers[$name][$member['name']] = array('member' => $member, 'type' => $type, 'realType' => $realType);
		} else {
			$parsedMembers[$name][$member['name']] = array('member' => $member, 'type' => $type, 'realType' => null);
			//echo "\t".$member['name']." -> ".$type['name'].": ".$type['size']."\n";
		}
	}
}
//print_r($parsedMembers);exit;
//generate!
foreach($structs as $struct) {
    $name = $struct['name'];
    $size = intval($struct['size']) / 8; 
	
	$code .= "\nwdi.".$name." = $.spcExtend(wdi.SpiceObject, {\r\n";
	$code .= "\tobjectSize:".$size.",\r\n";

	$code .= "\r\n";

	$code .= "\tinit: function(c) {\r\n";
	$code .= "\t\tc?this.setContent(c):false;\r\n";
	$code .= "\t},\r\n";

	$code .= "\r\n\tsetContent: function(c) {\r\n";

	foreach($parsedMembers[$name] as $key => $value) {
		$code .= "\t\tthis.".$key." = c.hasOwnProperty('".$key."') ? c.".$key.":0;\r\n";
	}

	$code .= "\t},\r\n";

	//marshaller
	$code .= "\r\n\tmarshall: function() {\r\n";
	$code .= "\t\tthis.rawData = [];\r\n";
	$code .= "\t\tthis.rawData = this.rawData.concat(\r\n";
	
	foreach($parsedMembers[$name] as $key => $value) {
		if(!is_array($value['type'])) {
			echo "unimplemented method: ".$key." of struct: ".$name."\r\n";
		} else {
			if(isset($value['type']['type']) && $value['type']['type'] == 'QXLPHYSICAL') {
				$code .= "\t\t\t'UNIMPLEMENTED',\r\n";
			}else if($value['type']['object_type'] == 'arraytype') {
				$block = intval($value['realType']['size']);
				$code .= "\t\t\tthis.arrayToBytes(this.".$key.", ".$block."),\r\n";
			} else {
				$code .= "\t\t\tthis.numberTo".$value['type']['size']."(this.".$key."),\r\n";
			}
		}
	}
	$code = substr($code, 0, -3);
	$code .= "\r\n\t\t);\r\n";
	$code .= "\t\treturn this.rawData;\r\n\t},\r\n";

	//demarshaller
	$code .= "\r\n\tdemarshall: function(queue) {\r\n";
	$code .= "\t\tthis.expectedSize = arguments[1] || this.objectSize;\r\n";
	$code .= "\t\tif (queue.getLength() < this.expectedSize) throw new wdi.Exception({message: 'Not enough queue to read', errorCode:3});\r\n";
	foreach($parsedMembers[$name] as $key => $value) {
		if(!is_array($value['type'])) {
			echo "unimplemented method: ".$key." of struct ".$name."\r\n";
		} else {
            if(isset($value['type']['type']) && $value['type']['type'] == 'QXLPHYSICAL') {
				$code .= "\t\tthrow new Exception('demashaller for generic types should be implemented', 3);\r\n";
			} else if($value['type']['object_type'] == 'arraytype') {
        	                $block = intval($value['realType']['size']);
	                        $code .= "\t\tthis.".$key." = this.bytesToArray(queue.shift(this.expectedSize), ".$block.");\r\n";
            } else if ($value['type']['object_type'] == "struct") {
				$code .= "\t\tthis.".$key." = new ".$key."().demarshall(queue);\r\n";
			} else {
                        	$code .= "\t\tthis.".$key." = this.bytesToInt".intval($value['type']['size'])."(queue.shift(".intval($value['type']['size']/8)."));\r\n";
                	}
		}
	}
	
	$code .= "\t\t'customDemarshall' in this?this.customDemarshall(queue):false;\r\n";
	$code .= "\r\n\t\treturn this;\r\n";

	$code .= "\t}\r\n";
	$code .= "});\r\n";
}

echo $code;
?>
