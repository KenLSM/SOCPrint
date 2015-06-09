<?php
	/*
	PHP Page used for checking login credentials
	Last update 8 June 2015

	String texts are fixed. Has to be similar to index.html's js implementation.
	*/
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	
	$data = json_decode(file_get_contents('php://input'), true);
	$userName =  $data["name"];
	$userPass = $data["password"];
	
	// NET_SS2 Implementation
	$message = "No message";
	include('Net/SSH2.php');
	$ssh = new Net_SSH2($serverAddr);
	if(!$ssh)
	{
		$message = "NO_CONNECTION";
	}
	if (!$ssh->login($userName , $userPass))
	{
		$message = "WRONG";
	}
	else
	{
		$message = "OK";
	}
	echo json_encode($message);

?>
