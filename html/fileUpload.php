<!--
PHP Page used for uploading file
Last update 5 June 2015
-->

<?php

	// Snippet obtained from http://php.net/manual/de/function.filesize.php
	function formatBytes($bytes, $precision = 2) 
	{ 
	    $units = array('B', 'KB', 'MB', 'GB', 'TB'); 

	    $bytes = max($bytes, 0); 
	    $pow = floor(($bytes ? log($bytes) : 0) / log(1024)); 
	    $pow = min($pow, count($units) - 1); 

	     $bytes /= pow(1024, $pow);

	    return round($bytes, $precision) . ' ' . $units[$pow]; 
	} 
	// End snippet
	
	// Snippet obtained from 
	function codeToMessage($code) 
	{ 
		switch ($code) { 
		    case UPLOAD_ERR_INI_SIZE: 
			$message = "The uploaded file exceeds the upload_max_filesize directive in php.ini"; 
			break; 
		    case UPLOAD_ERR_FORM_SIZE: 
			$message = "The uploaded file exceeds the MAX_FILE_SIZE directive that was specified in the HTML form"; 
			break; 
		    case UPLOAD_ERR_PARTIAL: 
			$message = "The uploaded file was only partially uploaded"; 
			break; 
		    case UPLOAD_ERR_NO_FILE: 
			$message = "No file was uploaded"; 
			break; 
		    case UPLOAD_ERR_NO_TMP_DIR: 
			$message = "Missing a temporary folder"; 
			break; 
		    case UPLOAD_ERR_CANT_WRITE: 
			$message = "Failed to write file to disk"; 
			break; 
		    case UPLOAD_ERR_EXTENSION: 
			$message = "File upload stopped by extension"; 
			break; 

		    default: 
			$message = "Unknown upload error"; 
			break; 
		} 
		return $message; 
	} 
	// End snippet
	
	// Setting up params
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;
	$userName =  $_POST["username"];
	$userPass = $_POST["password"];
	$uploads_dir = $_SERVER["DOCUMENT_ROOT"] . "/uploads";
	
	// Getting received file details
	$fileName = $_FILES["file"]["name"];
	$fileSize = $_FILES["file"]["size"];
	
	// Printing out debug message
	echo "You uploaded: " . $fileName . "<br> Size of " . formatBytes($fileSize) ;

	
	// Might need to do some security checking here
		// Check for 
		// filename limit < 255 char
		// extension type if is valid type. Dont process if invalid file type. Can detect in client side
		// size is < than 50mb?
	
	
	
	// If no problems with uploading 
	if ($_FILES["file"]["error"] == UPLOAD_ERR_OK) 
	{
		$tmp_name = $_FILES["file"]["tmp_name"];
		$name = $_FILES["file"]["name"];
		move_uploaded_file($tmp_name, "$uploads_dir/$name");
		echo "<br> Upload OK!"
	}
	else
	{
		echo "<br>Upload error: " . codeToMessage($_FILES["file"]["error"]);
	}
	// upload to sunfire from server
	/*
	include('Net/SFTP.php');

	$sftp = new Net_SFTP($serverAddr);
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
		echo "OK";
	}

	// puts a three-byte file named filename.remote on the SFTP server
	$sftp->put('filename.remote', 'xxx');
	// puts an x-byte file named filename.remote on the SFTP server,
	// where x is the size of filename.local
	$sftp->put('filename.remote', 'filename.local', NET_SFTP_LOCAL_FILE);
	*/
?>