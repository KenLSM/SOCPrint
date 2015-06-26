<!--
PHP Page used for uploading file
Last update 5 June 2015
-->

<?php
		
	include('Net/SFTP.php');

	// upload to sunfire from server
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	$sftp = new Net_SFTP($serverAddr);
	echo "<br>";
	if(!$sftp)
	{
		echo "NO_CONNECTION";
	}
	if (!$sftp->login($userName, $userPass))
	{
		echo "WRONG";
	}
	else
	{
		echo "Sunfire login OK";
	}

	// puts a three-byte file named filename.remote on the SFTP server
	//$sftp->put('filename.remote', 'xxx');
	// puts an x-byte file named filename.remote on the SFTP server,
	// where x is the size of filename.local
	//$sftp->put('filename.remote', 'temp.txt');//, NET_SFTP_LOCAL_FILE);
	$fullDir = "$uploads_dir/$fileName";
	$sftp->put("SOCPRINT_UPLOAD" . $fileName, $fullDir, NET_SFTP_LOCAL_FILE);
	echo "<br>If no other message appear then UPLOAD OK!";
	echo "<br> File is name is SOCPRINT_UPLOAD$fileName";
	

?>
