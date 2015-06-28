<?php

	include('Net/SSH2.php');

	define('NET_SSH2_LOGGING', NET_SSH2_LOG_COMPLEX);
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	
	$ssh = new Net_SSH2($serverAddr);

	$userName =  $_POST["name"];
	$userPass = $_POST["password"];
	$printer = ""; 	//$_POST["printer"];
	if(!$ssh)
	{
		//echo "Unable to establish connection\n";
	}
	if (!$ssh->login($userName, $userPass))
	{
		//echo "Error login";
	}
	else
	{
		echo "Ppsts ". $ssh->exec('lpq -Ppsts' . $printer) . "<br>";
		echo "Ppstsb ".$ssh->exec('lpq -Ppstsb' . $printer) . "<br>";
		echo "Ppstsc ".$ssh->exec('lpq -Ppstsc' . $printer) . "<br>";
		// Clearing off the stream of login message
		$ssh->read("~ \$");
		$ssh->write("pusage \n");
		// Throw away
		$ssh->read("PS-printer paper usage:");
		echo "Paper usage: " . $ssh->read("pages") . "<br>";
		
		$ssh->read("Available quota:");
		echo "Available quota: " . $ssh->read("pages") . "<br>";
		
		$ssh->read("Quota topup:");
		echo "Quota topup: " . $ssh->read("pages") . "<br>";
		
		$ssh->read("Allow to overdraft:");
		echo "Allow to overdraft: ". $ssh->read("pages") . "<br>";
		
		$ssh->read("~eprint/forms");
	}
	//echo "<br>";
?>
