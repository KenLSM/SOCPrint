<?php

$whichFile = $_GET["file"];
$isTrue = $_GET["sure"];
$dir = $_SERVER["DOCUMENT_ROOT"] . "/uploads";

$files = array_diff(scandir($dir, SCANDIR_SORT_DESCENDING), array('..', '.'));

set_error_handler("warning_handler", E_WARNING);

echo("Removing $whichFile <br>");

if($isTrue == "OK")
{
	unlink("$dir/$whichFile");
}

foreach($files as $key => $data)
{
	$count = $key+1;
	echo("$count $data  <br>");
}

function warning_handler($errno, $errstr) { 
// Dont print anything out!
}
?>