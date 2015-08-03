<?php

	include('Net/SSH2.php');

	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;	

	$deleteCommand = "find ~/socPrint/ -type f -name 'SP_*' -exec rm {} \;";
	
	$data = json_decode(file_get_contents('php://input'), true);
	$userName =  $_POST["username"];
	$userPass = $_POST["password"];
	$fileName = $_POST["fileName"];
	$printer = $_POST["printer"];
	$message = "";
	$verbose = "";
	$errorMSG = "";
	$fileName = substr($fileName, 0, -4);
	$ssh = new Net_SSH2($serverAddr);
	if(!$ssh)
	{
		$message = "NO_CONNECTION";
	}
	if (!$ssh->login($userName, $userPass))
	{
		$message = "WRONG";
	}
	else
	{
		if($printer === "psts" || $printer === "pstsb" || $printer === "pstsc")
		{	
			$message  = $ssh->exec("lpr -P $printer socPrint/$fileName.ps");
		}
		else
		{
			$message = "invalid printer provided: $printer";
		}
		// Command for execution in sunfire: pdftops [input file] [output file]
		//$message  = $ssh->exec("lpr -P psts socPrint/$fileName.ps");
		$ssh->exec($deleteCommand);
		$ssh->exec("command rm socPrint/$fileName.ps");
	}
	
	$array = array("status" => $message);
	echo json_encode($array);
?>
