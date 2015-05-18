<html>

<body>
 
Welcome <?php echo $_POST["name"]; ?><br>
Your email address is: <?php echo $_POST["email"]; ?>
<br>

<?php
	echo 'Current PHP version: ' . phpversion();
	include('Net/SSH2.php');

		define('NET_SSH2_LOGGING', NET_SSH2_LOG_COMPLEX);
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	
	$ssh = new Net_SSH2($serverAddr);

	$userName =  $_POST["name"];
	$userPass = $_POST["email"];
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
		echo "okay: logged in...<br>";
		echo $ssh->exec('pwd');
		echo $ssh->exec('ls -la');
		
	}
	echo "<br>";
	echo $ssh->getLog();
?>
</body>
</html>
