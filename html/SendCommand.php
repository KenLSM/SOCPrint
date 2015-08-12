<?php
	
	$serverAddr = "sunfire-r.comp.nus.edu.sg";
	$serverPort = 22;


	$userName =  $_POST["username"];
	$userPass = $_POST["password"];
	
	include('Net/SSH2.php');
	$ssh = new Net_SSH2($serverAddr);

	$message = "";
	$Ppsts = $userName;
	$Ppstsb = $userPass;
	$Ppstsc = "";
	$paperUsage ="";
	$availQuota ="";
	$quotaTopup ="";
	$overdraft ="";
	
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
		$message = "OK";
		
		/* Moved to checkPrintQueue.php
		$data = fopen("http://www.comp.nus.edu.sg/~kenlsm/psts.txt", "rb");
		$Ppsts = stream_get_contents($data);
		
		$data = fopen("http://www.comp.nus.edu.sg/~kenlsm/pstsb.txt", "rb");
		$Ppstsb = stream_get_contents($data);
		
		$data = fopen("http://www.comp.nus.edu.sg/~kenlsm/pstsc.txt", "rb");
		$Ppstsc = stream_get_contents($data);
		
		/* Old pqueue 
		$Ppsts = $ssh->exec('lpq -Ppsts');
		$Ppstsb = $ssh->exec('lpq -Ppstsb');
		$Ppstsc = $ssh->exec('lpq -Ppstsc');
		*/
		
		// Clearing off the stream of login message
		$ssh->read("~ \$");
		$ssh->write("pusage \n");
		// Throw away
		$ssh->read("PS-printer paper usage:");
		$paperUsage = $ssh->read("pages");
		$paperUsage = str_replace("pages", "", $paperUsage);
		
		$ssh->read("Available quota:");
		$availQuota = $ssh->read("pages");
		$availQuota = str_replace("pages", "", $availQuota);
		
		$ssh->read("Quota topup:");
		$quotaTopup = $ssh->read("pages");
		$quotaTopup = str_replace("pages", "", $quotaTopup);
		
		$ssh->read("Allow to overdraft:");
		$overdraft = $ssh->read("pages");
		$overdraft = str_replace("pages", "", $overdraft);
		
		$ssh->read("~eprint/forms");
	}
	$array = array(
	"Ppsts" => $Ppsts, 
	"Ppstsb" => $Ppstsb, 
	"Ppstsc" => $Ppstsc,
	"paperUsage" => $paperUsage, 
	"availQuota" => $availQuota, 
	"quotaTopup" => $quotaTopup, 
	"overdraft" => $overdraft, 
	"message" =>$message);
	echo json_encode($array);
?>
