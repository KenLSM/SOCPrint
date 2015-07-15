<?php

	include('Net/SSH2.php');

	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;	

	$data = json_decode(file_get_contents('php://input'), true);
	$userName =  $_POST["username"];
	$userPass = $_POST["password"];
	$fileName = $_POST["fileName"];
	$message = "";
	$verbose = "";
	$errorMSG = "";
	$ssh = new Net_SSH2($serverAddr);
	if(!$ssh)
	{
		$message = "NO_CONNECTION";
	}
	if (!$ssh->login($userName, $userPass))
	{
		$message = "WRONG";
	}
	else
	{
		// Command for execution in sunfire: pdftops [input file] [output file]
		$message  = $ssh->exec("lpr -P psts SP_PS_$fileName.ps");
	}
	
	$array = array("status" => $message);
	echo json_encode($array);
?>
