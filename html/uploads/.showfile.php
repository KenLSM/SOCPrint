<?php
$dir    = $_SERVER["DOCUMENT_ROOT"] . "/uploads";

$files = array_diff(scandir($dir, SCANDIR_SORT_DESCENDING), array('..', '.'));

//print_r($files);
foreach($files as $key => $data)
{
	$count = $key+1;
	echo("$count $data  <br>");
}
?>