

<?php
	/*
	PHP Page used for uploading file to sunfire
	Last update 27 June 2015
	*/
	include('Net/SFTP.php');

	$userName =  $_POST["username"];
	$userPass = $_POST["password"];
	$uploads_dir = $_SERVER["DOCUMENT_ROOT"] . "/uploads";
	$fileName = $_POST["fileName"];
	
	// upload to sunfire from server
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	$sftp = new Net_SFTP($serverAddr);
	
	$message = "";
	if(!$sftp)
	{
		$message = "NO_CONNECTION";
	}
	if (!$sftp->login($userName, $userPass))
	{
		$message = "WRONG";
	}
	else
	{
		$message = "OK";
		$fullDir = "$uploads_dir/$fileName";
		$sftp->put("SP_UP_$fileName", $fullDir, NET_SFTP_LOCAL_FILE);
	}

	// puts a three-byte file named filename.remote on the SFTP server
	//$sftp->put('filename.remote', 'xxx');
	// puts an x-byte file named filename.remote on the SFTP server,
	// where x is the size of filename.local
	//$sftp->put('filename.remote', 'temp.txt');//, NET_SFTP_LOCAL_FILE);
	
	$array = array("verbose" => "File is name is SP_UP_$fileName", "status" => $message);
	echo json_encode($array);
?>
