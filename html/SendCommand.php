<?php

	include('Net/SSH2.php');

	define('NET_SSH2_LOGGING', NET_SSH2_LOG_COMPLEX);
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	
	$ssh = new Net_SSH2($serverAddr);

	$userName =  $_POST["name"];
	$userPass = $_POST["password"];
	$printer = $_POST["printer"];
	if(!$ssh)
	{
		echo "Unable to establish connection\n";
	}
	if (!$ssh->login($userName, $userPass))
	{
		echo "Login failed";
	}
	else
	{
		echo $ssh->exec('lpq -' . $printer);
	}
	echo "<br>";
?>
