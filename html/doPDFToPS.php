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
		$errorMSG = $ssh->exec("pdftops SP_UP_$fileName SP_PS_$fileName.ps");
		
		
		// Clearing off the stream of login message
		$ssh->read("~ \$");
		$reply = $ssh->exec("if [ -f SP_PS_$fileName.ps ]; then echo 1; fi");
		switch($reply)
		{
			case 1:
				$message = "OK";
				$verbose = "File name is SP_PS_$fileName.ps";
				break;
			default:
				$message = "NO $reply:";
				$verbose = "SP_PS_$fileName.ps not found";
				break;
		}
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
	
	$array = array("verbose" => $verbose, "status" => $message, "error" =>$errorMSG);
	echo json_encode($array);
?>
