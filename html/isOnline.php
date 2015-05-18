<!--
PHP Page used for checking server status
Last update 17 MAY 2015
-->
<?php
	
	//echo "Current PHP version: " . phpversion();
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	
	//echo $_SERVER['SERVER_ADDR'] . "<br>";
	//echo "Connecting to " . $serverAddr ." @ " . " port " . $serverPort ."<br>";

	if (!function_exists("ssh2_connect")) die("function ssh2_connect doesn't exist");
	
	if(!($con = ssh2_connect($serverAddr, $serverPort)))
	{
		echo "Server status: Offline";
	} else 
	{
		echo "Server status: Online";
	}
?>