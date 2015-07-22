<?php

$FILE_DIR = "/user/k/kenlsm/public_html/files/nup_pdf.jar";
// To locate if the required file exist. If it doesnt, tries to fetch the file
function locateFile()
{
	$msg = $ssh->exec("if [ -f socPrint/nup_pdf.jar ]; then echo 1; else echo 2; fi");
	if($msg == "2")
	{
		// File is not found in user's directory, so we copy over from my public folder
		$ssh->exec("cp $FILE_DIR socPrint/nup_pdf.jar");
	}
}
	include('Net/SSH2.php');

	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;	

	$data = json_decode(file_get_contents('php://input'), true);
	$userName =  $_POST["username"];
	$userPass = $_POST["password"];
	$fileName = $_POST["fileName"];
	$pageLayout = $_POST["pageLayout"];
	$message = "";
	$verbose = "";
	$errorMSG = "";
	$finalFileName = "";
	
	// Remove .pdf file ext
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
		
		switch($pageLayout)
		{
			case "1PP":
				// Dont have to convert. 
				// So we do nothing.
				$finalFileName = "SP_UP_$fileName";
				break;
			case "2PP":
				// run script (java -jar nup_pdf <input> <output> <page #> <options>)
				// -b option is for page borders
				 $ssh->exec("java -jar socPrint/nup_pdf.jar socPrint/SP_UP_$fileName.pdf socPrint/SP_FO_$fileName.pdf 2 -b");
				 $finalFileName = "SP_FO_$fileName";
				 //echo $pageLayout;
				 break;
			 case "4PP":
				 $ssh->exec("java -jar socPrint/nup_pdf.jar socPrint/SP_UP_$fileName.pdf socPrint/SP_FO_$fileName.pdf 4 -b");
				 $finalFileName = "SP_FO_$fileName";
				 break;
			 case "6PP":
				 $ssh->exec("java -jar socPrint/nup_pdf.jar socPrint/SP_UP_$fileName.pdf socPrint/SP_FO_$fileName.pdf 6 -b");
				 $finalFileName = "SP_FO_$fileName";
				 break;
			default:
				$finalFileName = "SP_UP_$fileName";
				break;
		}
		
		// Command for execution in sunfire: pdftops [input file] [output file]
		$errorMSG = $ssh->exec("pdftops socPrint/$finalFileName.pdf socPrint/$fileName.ps -level3");
		
		
		// Clearing off the stream of login message
		$ssh->read("~ \$");
		$reply = $ssh->exec("if [ -f socPrint/$fileName.ps ]; then echo 1; fi");
		switch($reply)
		{
			case 1:
				$message = "OK";
				$verbose = "File name is socPrint/$fileName.ps";
				break;
			default:
				$message = "NO $reply:";
				$verbose = "$fileName.ps not found";
				break;
		}
	}
	
	$array = array("verbose" => $verbose, "status" => $message, "error" =>$errorMSG);
	echo json_encode($array);
?>
