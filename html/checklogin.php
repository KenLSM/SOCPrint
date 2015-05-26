<?php

	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	$userName =  $_POST["name"];
	$userPass = $_POST["password"];
	
	// NET_SS2 Implementation
	
	include('Net/SSH2.php');
	$ssh = new Net_SSH2($serverAddr);
	if(!$ssh)
	{
		echo "NO_CONNECTION";
	}
	if (!$ssh->login($userName, $userPass))
	{
		echo "WRONG";
	}
	else
	{
		echo "OK";
	}
	
	/*
	// SSH2 Implementation
	if(!($con = ssh2_connect($serverAddr, $serverPort)))
	{
		echo "NO_CONNECTION";
	} else 
	{
		// try to authenticate with username root, password secretpassword
		if(!ssh2_auth_password($con, $userName, $userPass)) 
		{
			echo "WRONG";
		} else 
		{
			// allright, we're in!
			echo "OK";
		}
	}
	*/
?>
