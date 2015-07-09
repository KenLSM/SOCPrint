<!--
PHP Page used for checking server status
Last update 17 MAY 2015
-->
<?php
	
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	
	/// NET_SS2 Implementation
	include('Net/SSH2.php');
	define('NET_SSH2_LOGGING', NET_SSH2_LOG_COMPLEX);
	$ssh = new Net_SSH2($serverAddr);	
	if(!$ssh)
	{
		echo "Server status: <a class=\"red\">Offline</a>";
	} else 
	{
		echo "Server status: <a class=\"green\">Online</a>";
	}
	
	/// SSH2 Implementation
	/*
	if (!function_exists("ssh2_connect")) die("function ssh2_connect doesn't exist");
	
	if(!($con = ssh2_connect($serverAddr, $serverPort)))
	{
		echo "Server status: Offline";
	} else 
	{
		echo "Server status: Online" . phpversion();
	}
	*/
?>
