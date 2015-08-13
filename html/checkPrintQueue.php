<?php
	$data = fopen("http://www.comp.nus.edu.sg/~kenlsm/psts.txt", "rb");
	$Ppsts = stream_get_contents($data);
	
	$data = fopen("http://www.comp.nus.edu.sg/~kenlsm/pstsb.txt", "rb");
	$Ppstsb = stream_get_contents($data);
	
	$data = fopen("http://www.comp.nus.edu.sg/~kenlsm/pstsc.txt", "rb");
	$Ppstsc = stream_get_contents($data);
	
	$array = array(
	"Ppsts" => $Ppsts, 
	"Ppstsb" => $Ppstsb, 
	"Ppstsc" => $Ppstsc);
	
	echo json_encode($array);
?>
