<?php
/*
PHP Page used for uploading file
Last update 26 June 2015
*/
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
	
	$uploads_dir = $_SERVER["DOCUMENT_ROOT"] . "/preview";
	
	// Getting received file details
	$fileName = $_FILES["file"]["name"];
	$fileSize = $_FILES["file"]["size"];
	$fileType = $_FILES["file"]["type"];
	
	$fileSize = formatBytes($fileSize);
	$message = "";
	if ($_FILES["file"]["error"] == UPLOAD_ERR_OK) 
	{
		$tmp_name = $_FILES["file"]["tmp_name"];
		move_uploaded_file($tmp_name, "$uploads_dir/$fileName");
		//copy("$uploads_dir/$finalFileName", "preview/$finalFileName");
		$message = "OK";
		//uploadToSunfire($userName, $userPass, $uploads_dir, $fileName);
	}
	else
	{
		$message = codeToMessage($_FILES["file"]["error"]);
	}
	$array = array("fileName" => $fileName, "fileSize" => $fileSize, "fileType" => $fileType, "status" => $message);
	echo json_encode($array);
?>
