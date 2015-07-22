var isLoggingIn = false;
var temp_counter = 0;

// Section for alert message box
// Provides functions to show/hide and change text of alert message box
//
// Global Variables 
var ALERT_INFO = 2;		// Colour = blue
var ALERT_SUCCESS = 1;		// Colour = green
var ALERT_DANGER = 0;		// Colour = red

// Closes alert box
function closeAlert()
{
	$("#alertBox").addClass("hidden");
}
// Shows alertbox
function openAlert()
{
	$("#alertBox").removeClass("hidden");
}
// Change the text message of alert box and its colour according to type
function changeAlertMSG(str, isInfo)
{
	// Removing classes which might interfere with the new class
	$("#alertBox").removeClass("hidden");
	$("#alertBox").removeClass("alert-danger");
	$("#alertBox").removeClass("alert-success");
	$("#alertBox").removeClass("alert-info");

	switch(isInfo)
	{
		case ALERT_DANGER:
			$("#alertBox").addClass("alert-danger");
		break;
		case ALERT_SUCCESS:
			$("#alertBox").addClass("alert-success");
		break;
		case ALERT_INFO:
			$("#alertBox").addClass("alert-info");
		default:
			// shouldnt go here..
			// box will be transparent if this occurs
		break;
	}
	
	document.getElementById("loginMSG").innerHTML = str;
}
function changeVerboseMSG(str)
{
	if(document.getElementById("isVerbose").checked === true)
	{
		$("#verboseBox").removeClass("hidden");	
		document.getElementById("verboseMSG").innerHTML = str;
	}
}
// Section for changing colour of uploadBox
// Provides colour changing functions
// Global variables
var UPLOADBOX_READY = 0;
var UPLOADBOX_SERVER = 1;
var UPLOADBOX_SERVER_ERROR = 11;
var UPLOADBOX_SUNFIRE = 2;
var UPLOADBOX_SUNFIRE_ERROR = 22;
var UPLOADBOX_PSCONVERT = 3;
var UPLOADBOX_PSCONVERT_ERROR = 33;
var UPLOADBOX_PRINTER = 4;
var UPLOADBOX_PRINTER_ERROR = 44;

// Helper function to remove all related class
function CH_UP_removeClass(selector){
	selector.removeClass("uploadDone uploadSelect uploadError");
	return selector;
}
function changeUpload(state){
	
	switch(state)
	{
		case UPLOADBOX_READY:
			// Set all box to green and server box to yellow
			CH_UP_removeClass($("#uploadBoxServer"));
			CH_UP_removeClass($("#uploadBoxSunfire"));
			CH_UP_removeClass($("#uploadBoxPS"));
			CH_UP_removeClass($("#uploadBoxPrint"));
			
			$("#uploadBoxServer").addClass("uploadSelect");
		break;
		case UPLOADBOX_SERVER:
			// Set server box to green and sunfire box to yellow
			$("#uploadBoxServer").removeClass("uploadSelect").addClass("uploadDone");
			$("#uploadBoxSunfire").addClass("uploadSelect");
		break;
		case UPLOADBOX_SERVER_ERROR:
			// Set server box to red
			$("#uploadBoxServer").removeClass("uploadSelect").addClass("uploadError");
		break;
		case UPLOADBOX_SUNFIRE:
			// Set server box to green and sunfire box to yellow
			$("#uploadBoxSunfire").removeClass("uploadSelect").addClass("uploadDone");
			$("#uploadBoxPS").addClass("uploadSelect");
		break;
		case UPLOADBOX_SUNFIRE_ERROR:
			// Set sunfire box to red 
			$("#uploadBoxSunfire").removeClass("uploadSelect").addClass("uploadError");
		break;
		case UPLOADBOX_PSCONVERT:
			// Set sunfire box to green and printer box to yellow
			$("#uploadBoxPS").removeClass("uploadSelect").addClass("uploadDone");
			$("#uploadBoxPrint").addClass("uploadSelect");
		break;
		case UPLOADBOX_PSCONVERT_ERROR:
			// Set PS box to red 
			$("#uploadBoxPS").removeClass("uploadSelect").addClass("uploadError");
		break;
		case UPLOADBOX_PRINTER:
			// Set server printer to green 
			$("#uploadBoxPrint").removeClass("uploadSelect").addClass("uploadDone");
		break;
		case UPLOADBOX_PRINTER_ERROR:
			// Set server printer to red 
			$("#uploadBoxPrint").removeClass("uploadSelect").addClass("uploadError");
		break;
		default:
			// shouldnt go here..
		break;
	}
}


// Developmental function to trace time taken
// for send command to return its ajax object
function devFunc_temp()
{
	
	document.getElementById("tempCounter").innerHTML = temp_counter + "s since last refresh. Waiting for reply";
	setTimeout(devFunc_temp, 1000);
	temp_counter++;
}

// Function to check if printer is selected or not
// Uses the url # data to check
// Return true on printer selected
// Return false if printer cannot be found
var printer = "";
function checkPrinterSelection()
{
	//printer = window.location.hash.substring(1);
	
	// Check if string value is empty
	if(typeof printer === "undefined")
	{
		return false;
	}
	
	switch (printer)
	{
		case "psts":
			return true;

		case "pstsb":
			return true;

		case "pstsc":
			return true;

		default:
			return false;
	}
}

var pageLayout ="";
function CheckPageLayoutSelection()
{
	if(typeof pageLayout === "undefined")
	{
		return false;
	}
	
	switch (pageLayout)
	{
		case "1PP":
			return true;

		case "2PP":
			return true;

		case "4PP":
			return true;
			
		case "6PP":
			return true;
			
		default:
			return false;
	}
}
// Function to check if a file is selected
// Returns true is file is selected
var GLOBAL_File;
function checkFileSelection()
{
	// Check if GLOBAL_File is set up
	if(typeof GLOBAL_File === "undefined")
		return false;
	
	// If there is a name for it, then there is a file.
	// Checking for PDF is done when setting GLOBAL_File
	if(GLOBAL_File.name == "")
		return true;
}


// Initial call to set up listeners etc
$(document).ready(function()
{

	var form = document.forms.namedItem("uploadFile");

	form.addEventListener("submit", function(ev, ef)
	{
		var isLoggedIn = document.getElementById("login").innerHTML;
		var loginMSG = document.getElementById("loginMSG");

		// If user is  not logged in dont
		if (isLoggedIn == "Login")
		{
			openAlert();
			changeAlertMSG("Please <b>login</b> first!", ALERT_DANGER);
		}
		// Check if printer is selected or not
		else if (checkPrinterSelection() === false)
		{
			openAlert();
			changeAlertMSG("Which <b>printer</b> you wanna print from?", ALERT_DANGER);
		}
		else if (checkFileSelection() === false)
		{
			openAlert();
			changeAlertMSG("You have to give me a <b>file</b> to print! >:(", ALERT_DANGER);
		}
		else if(CheckPageLayoutSelection() === false)
		{
			openAlert();
			changeAlertMSG("You have to tell me what <b>layout</b> you want!", ALERT_DANGER);
		}
		else
		{
			changeUpload(UPLOADBOX_READY);
			changeAlertMSG("Uploading <b>started!</b>", ALERT_INFO);
			
			var oOutput = document.getElementById("uploadServer");
			var formData = new FormData(document.forms.namedItem("uploadFile"));

			oOutput.innerHTML = "Calculating transfer vectors..."
			formData.append("username", document.getElementById("username").value);
			formData.append("password", document.getElementById("password").value);
			formData.append("file", GLOBAL_File, GLOBAL_File.name);
			$.ajax(
			{
				type: 'post',
				url: 'fileUpload.php',
				data: formData,
				success: function(data)
				{
					var obj = JSON.parse(data);

					switch (obj.status)
					{
						case "OK":
							oOutput.innerHTML = "Done!";
							changeVerboseMSG("You uploaded: " + obj.fileName + "<br> Size of " + obj.fileSize + " and file type of " + obj.fileType);
							changeUpload(UPLOADBOX_SERVER);
							uploadToSunfire(obj.fileName);
							break;
						default:
							oOutput.innerHTML = "Unsuccessful";
							changeAlertMSG("Failed to upload properly. Please contact the dev with this data <b>" + obj.status + "</b>", ALERT_DANGER);
							break;
					}
				},
				contentType: false,
				processData: false
			})
		}
		ev.preventDefault();
	}, false);

	
	// Login input field script. 
	// To allow pressing enter to fire login event
	$("#username").keyup(function(event)
	{
		if (event.keyCode == 13)
		{
			$("#login").click();
		}
	});
	$("#password").keyup(function(event)
	{
		if (event.keyCode == 13)
		{
			$("#login").click();
		}
	});
	// End login input field script

	
	
	// To enable tooltip
	// Required by bootstrap
	$('[data-toggle="tooltip"]').tooltip();
	// End
	
	// Event scripts for file drag/drop
	if (window.File && window.FileList && window.FileReader)
	{
		var fileselect;
		var filedrag;
		
		fileselect = document.getElementById("fileSelect"),
		filedrag = document.getElementById("filedrag"),
		submitbutton = document.getElementById("submitButton");

		
		// File select
		// to detect if the user uses click to add file
		filedrag.addEventListener("click", function(){
			fileselect.click();
			}, false);
		fileselect.addEventListener("change", FileSelectHandler, false);

		// file drop
		filedrag.addEventListener("dragover", FileDragHover, false);
		filedrag.addEventListener("dragleave", FileDragHover, false);
		filedrag.addEventListener("drop", FileSelectHandler, false);
		filedrag.style.display = "block";

	}
	
	// Event scripts for printer selection
	//var psts = ;
	document.getElementById("psts").addEventListener("click", function(){
		PrinterSelectHandler($("#psts"))	
		}, false);
	document.getElementById("pstsb").addEventListener("click", function(){
		PrinterSelectHandler($("#pstsb"))	
		}, false);
	document.getElementById("pstsc").addEventListener("click", function(){
		PrinterSelectHandler($("#pstsc"))	
		}, false);
		
	// Event scripts for layout selection
	document.getElementById("1PP").addEventListener("click", function(){
		PageLayoutSelectHandler($("#1PP"))	
		}, false);
	document.getElementById("2PP").addEventListener("click", function(){
		PageLayoutSelectHandler($("#2PP"))	
		}, false);
	document.getElementById("4PP").addEventListener("click", function(){
		PageLayoutSelectHandler($("#4PP"))	
		}, false);
	document.getElementById("6PP").addEventListener("click", function(){
		PageLayoutSelectHandler($("#6PP"))	
		}, false);
});

// File drag hover
function FileDragHover(e) 
{
	e.stopPropagation();
	e.preventDefault();
	
	// Dont change class if target isnt filedrag
	if(e.target.id == "filedrag")
	{		
		e.target.className = (e.type == "dragover" ? "hover" : "");
	}
}
//  File selection
function FileSelectHandler(e) {

	// Cancel event and hover styling	
	FileDragHover(e);

	// fetch FileList object
	var files = e.target.files || e.dataTransfer.files;

	// process all File objects
	/*
	for (var i = 0, f; f = files[i]; i++) {
		ParseFile(f);
	}*/
	
	// Single file only
	ParseFile(files[0]);
	
}
function ParseFile(file) 
{
	// Only change GLOBAL_File if type if PDF
	if(file.type === "application/pdf")
	{
		GLOBAL_File = file;
		
		// Update the text in filedrag 
		document.getElementById("filedrag").innerHTML = file.name;
	}
	// If pdf not received, display alert box reminding user
	else
	{
		openAlert();
		changeAlertMSG("I can only receive pdf files! >.<", ALERT_INFO);
	}
}

function PrinterSelectHandler(which_Printer){
	$("#psts").removeClass("select");
	$("#pstsb").removeClass("select");
	$("#pstsc").removeClass("select");
	which_Printer.addClass("select");
	printer = which_Printer.prop("id");
	//alert(printer.prop("id"));
}

// For choosing 1,2,4, 6 layout
function PageLayoutSelectHandler(which_layout){
	$("#1PP").removeClass("select");
	$("#2PP").removeClass("select");
	$("#4PP").removeClass("select");	
	$("#6PP").removeClass("select");
	which_layout.addClass("select");
	pageLayout = which_layout.prop("id");
	//alert(which_layout);
}
function uploadToSunfire(fileName)
{
	var oOutput = document.getElementById("uploadSunfire");
	oOutput.innerHTML = "Sending with pigeons...";
	var formData = new FormData();
	formData.append("username", document.getElementById("username").value);
	formData.append("password", document.getElementById("password").value);
	formData.append("fileName", fileName);
	$.ajax(
	{
		type: 'post',
		url: 'uploadToServer.php',
		data: formData,
		success: function(data)
		{
			var obj = JSON.parse(data);

			switch (obj.status)
			{
				case "OK":
					oOutput.innerHTML = "Done!";
					changeVerboseMSG(obj.verbose);
					changeUpload(UPLOADBOX_SUNFIRE);
					convertToPS(fileName);
					break;
				default:
					oOutput.innerHTML = "Unsuccessful";
					changeAlertMSG("Failed to upload to sunfire. Please contact dev with this data <b>" + obj.status + "</b>", ALERT_DANGER);
					changeUpload(UPLOADBOX_SUNFIRE_ERROR);
					break;
			}
		},
		contentType: false,
		processData: false
	})
}

function convertToPS(fileName)
{
	var oOutput = document.getElementById("uploadConvertPS");
	oOutput.innerHTML = "Casting conversion. It will take awhile";
	var formData = new FormData();
	formData.append("username", document.getElementById("username").value);
	formData.append("password", document.getElementById("password").value);
	formData.append("fileName", fileName);
	formData.append("pageLayout", pageLayout);
	$.ajax(
	{
		type: 'post',
		url: 'doPDFToPS.php',
		data: formData,
		success: function(data)
		{
			var obj = JSON.parse(data);

			switch (obj.status)
			{
				case "OK":
					oOutput.innerHTML = "Done!";
					changeVerboseMSG(obj.verbose);
					changeUpload(UPLOADBOX_PSCONVERT);
					doPrint(fileName);					
					break;
				default:
					oOutput.innerHTML = "Unsuccessful";
					changeAlertMSG("Failed to upload to sunfire. Please contact dev with this data <b>" + obj.status + obj.error + obj.verbose + "</b>", ALERT_DANGER);
					changeUpload(UPLOADBOX_PSCONVERT_ERROR);
					break;
			}
		},
		contentType: false,
		processData: false
	})
}

function doPrint(fileName)
{
	var oOutput = document.getElementById("uploadPrint");
	oOutput.innerHTML = "Bringing to SoC";
	var formData = new FormData();
	formData.append("username", document.getElementById("username").value);
	formData.append("password", document.getElementById("password").value);
	formData.append("fileName", fileName);
	formData.append("printer", printer);
	$.ajax(
	{
		type: 'post',
		url: 'doPrint.php',
		data: formData,
		success: function(data)
		{
			var obj = JSON.parse(data);

			if (obj.status == "")
			{
				oOutput.innerHTML = "Done!";
				changeVerboseMSG("Sent to printer " + printer);
				changeAlertMSG("Collect your printout at " + printer, ALERT_SUCCESS);
				changeUpload(UPLOADBOX_PRINTER);
			}
			else
			{
				oOutput.innerHTML = "Unsuccessful";
				changeAlertMSG("Failed to upload to sunfire. Please contact dev with this data <b>" + obj.status + "</b>", ALERT_DANGER);
				changeUpload(UPLOADBOX_PRINTER_ERROR);
			}
		},
		contentType: false,
		processData: false
	})
}
// End of upload script

// xmlhttp version
function checkServer()
{
	var xmlhttp = new XMLHttpRequest();
	if (xmlhttp == null)
	{
		document.getElementById("serverStatus").innerHTML = "XMLHttpRequest not supported. Status unknown.";
		return;
	}
	xmlhttp.onreadystatechange = function()
	{
		if (xmlhttp.readyState == 4)
		{
			document.getElementById("serverStatus").innerHTML = xmlhttp.responseText;
		}
	}
	xmlhttp.open("GET", "isOnline.php", true);
	xmlhttp.send();


}
// xmlhttp version
function sendCommand()
{
	var formData = new FormData();
	formData.append("username", document.getElementById("username").value);
	formData.append("password", document.getElementById("password").value);
	$.ajax(
	{
		type: 'post',
		url: 'SendCommand.php',
		data: formData,
		success: function(data)
		{
			temp_counter = 0;
			var obj = JSON.parse(data);

			switch (obj.message)
			{
				case "OK":
					document.getElementById("ppsts").innerHTML = obj.Ppsts;
					document.getElementById("ppstsb").innerHTML = obj.Ppstsb;
					document.getElementById("ppstsc").innerHTML = obj.Ppstsc;

					document.getElementById("paperUsage").innerHTML = obj.paperUsage;
					document.getElementById("availQuota").innerHTML = obj.availQuota;
					document.getElementById("overdraft").innerHTML = obj.overdraft;


					/*----------------				
					Progress bar 
					----------------*/
					var sum = Number(obj.paperUsage.replace("pages", "")) + Number(obj.availQuota.replace("pages", ""));

					document.getElementById("paperUsageBarSuc").style.width = Number((obj.availQuota - obj.overdraft) / sum) * 100 + "%";
					document.getElementById("paperUsageBarWar").style.width = Number(obj.overdraft / sum) * 100 + "%";
					document.getElementById("paperUsageBarDan").style.width = Number(obj.paperUsage / sum) * 100 + "%";
					document.getElementById("paperUsageBarInfo").style.width = "0%";

					break;

				default:
					document.getElementById("printerStatus").innerHTML = "wrong";
					break;
			}
		},
		contentType: false,
		processData: false
	})
	if (document.getElementById("login").innerHTML == "Disconnect")
	{

		setTimeout(sendCommand, 5000);
	}
}
// Ajax version
function checkLogin()
{
	var loginMSG = document.getElementById("loginMSG");
	// If is logging in, dont allow another ajax submittion, exit immediately
	if (isLoggingIn)
	{
		return;
	}
	// Checks for login and pw to be both entered before submitting ajax
	if (document.getElementById("login").innerHTML == "Login")
	{
		if (document.getElementById("username").value == "")
		{
			openAlert();
			changeAlertMSG("Please enter your <b>username</b>!", ALERT_DANGER);
			return;
		}
		if (document.getElementById("password").value == "")
		{
			openAlert();
			changeAlertMSG("Please enter your <b>password</b>!", ALERT_DANGER);
			return;
		}
		// Ajax to login php
		$.ajax(
		{
			type: 'post',
			url: "checklogin.php",
			data: JSON.stringify(
			{
				name: document.getElementById("username").value,
				password: document.getElementById("password").value
			}),
			success: function(data)
			{
				data = JSON.parse(data);
				switch (data)
				{
					case "NO_CONNECTION":
						{
							openAlert();
							changeAlertMSG("Unable to connect to sunfire!! :O", ALERT_DANGER);
							break;
						}
					case "WRONG":
						{
							openAlert();
							changeAlertMSG("Incorrect <b>username</b> or <b>password</b> :'(", ALERT_DANGER);
							break;
						}
					case "OK":
						{
							openAlert();
							changeAlertMSG("Welcome " + document.getElementById("username").value + ",  ^_^", ALERT_SUCCESS);
													
							document.getElementById("login").innerHTML = "Disconnect";
							//loginMSG.style.color = "lime";
							//loginMSG.innerHTML = "Logged in successfully";
							//document.getElementById("username").disabled = true;
							//document.getElementById("password").disabled = true;
							//To make the log in field to disappear
							document.getElementById("username").style.display = "none";
							document.getElementById("password").style.display = "none";

							setTimeout(sendCommand, 5000);
							devFunc_temp();
							break;
						}
					default:
						{
							openAlert();
							changeAlertMSG("Unknown error! Please contact the dev with this data <b>" + data + "</b> >.<" , ALERT_DANGER);
							break;
						}
				}
				// Enable login again
				isLoggingIn = false;
			}
		})
		isLoggingIn = true;
		openAlert();
		changeAlertMSG("Logging In <b>Now!</b>" , ALERT_INFO);
	}
	else
	{
		document.getElementById("login").innerHTML = "Login";
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";

		//loginMSG.style.color = "lime";
		//loginMSG.innerHTML = "Disconnected successfully";
		//document.getElementById("username").disabled = false;
		//document.getElementById("password").disabled = false;

		//To make the log in field to appear
		document.getElementById("username").style.display = "initial";
		document.getElementById("password").style.display = "initial";
		location.assign("http://" + window.location.hostname);
	}
}