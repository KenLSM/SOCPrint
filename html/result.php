<html>

<header>
<title>SOCPrint - Printing made easier</title>

<link rel="stylesheet" type="css/text" href="style.css">	
</header>


<body>

Welcome  <?php echo $_POST["name"]; ?><br>
Your email address is: <?php echo $_POST["email"]; ?>
<br>
<?php
	
	echo 'Current PHP version: ' . phpversion();
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	
	echo $_SERVER['SERVER_ADDR'] . "<br>";
	echo "Connecting to " . $serverAddr ." @ " . " port " . $serverPort ."<br>";
	
	$userName =  $_POST["name"];
	$userPass = $_POST["email"];
	if (!function_exists("ssh2_connect")) die("function ssh2_connect doesn't exist");
	// log in at server1.example.com on port 22
	if(!($con = ssh2_connect($serverAddr, $serverPort)))
	{
		echo "fail: unable to establish connection\n";
	} else 
	{
		// try to authenticate with username root, password secretpassword
		if(!ssh2_auth_password($con, $userName, $userPass)) 
		{
			echo "fail: unable to authenticate<br>";
		} else 
		{
			// allright, we're in!
			echo "okay: logged in...<br>";

			// execute a command
			if (!($stream = ssh2_exec($con, "ls -al" ))) 
			{
				echo "fail: unable to execute command\n";
			} else 
			{
				// collect returning data from command
				stream_set_blocking($stream, true);
				$data = "";
				while ($buf = fread($stream,4096)) 
				{
					$data .= $buf;
					echo $data;
				}
				fclose($stream);
			}
		}
	}
?>


</body>
</html>
