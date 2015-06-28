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
		
		$message = "print job submitted";
		// Command for execution in sunfire: pdftops [input file] [output file]
		$message  = $ssh->exec("lpr -P psts SP_PS_$fileName.ps");
		
		// Throw away
		/*
		$ssh->read("PS-printer paper usage:");
		echo "Paper usage: " . $ssh->read("pages") . "<br>";
		
		$ssh->read("Available quota:");
		echo "Available quota: " . $ssh->read("pages") . "<br>";
		
		$ssh->read("Quota topup:");
		echo "Quota topup: " . $ssh->read("pages") . "<br>";
		
		$ssh->read("Allow to overdraft:");
		echo "Allow to overdraft: ". $ssh->read("pages") . "<br>";
		
		$ssh->read("~eprint/forms");
		*/
	}
	
	$array = array("status" => $message);
	echo json_encode($array);
?>
