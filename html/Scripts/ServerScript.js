var isLoggingIn = false;
// Start of upload script
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

// Developmental function to trace time taken
// for send command to return its ajax object
function devFunc_temp()
{
	temp_counter++;
	document.getElementById("tempCounter").innerHTML = temp_counter + "s since last refresh. Waiting for reply";
	setTimeout(devFunc_temp, 1000);
}

// Function to check if printer is selected or not
// Uses the url # data to check
// Return true on printer selected
// Return false if printer cannot be found
var printer = "";
function checkPrinterSelection()
{
	printer = window.location.hash.substring(1);
	
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
			changeAlertMSG("Please login first!", ALERT_DANGER);
		}
		// Check if printer is selected or not
		else if (checkPrinterSelection() === false)
		{
			openAlert();
			changeAlertMSG("Which printer you wanna print from?", ALERT_DANGER);
		}
		else if (checkFileSelection() === false)
		{
			openAlert();
			changeAlertMSG("You have to give me a file to print! >:(", ALERT_DANGER);
		}
		else
		{
			loginMSG.style.color = "green";
			loginMSG.innerHTML = "Uploading started";

			var oOutput = document.getElementById("uploadServer");
			var formData = new FormData(document.forms.namedItem("uploadFile"));

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
							oOutput.innerHTML = "Upload: You uploaded: " + obj.fileName + "<br> Size of " + obj.fileSize + " and file type of " + obj.fileType;
							uploadToSunfire(obj.fileName);
							break;
						default:
							oOutput.innerHTML = "Upload: Unsuccessful: " + obj.status;
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

function uploadToSunfire(fileName)
{
	var oOutput = document.getElementById("uploadSunfire");
	oOutput.innerHTML = "Uploading to sunfire now...";
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
					oOutput.innerHTML = "Upload Sunfire: Sucessful" + obj.verbose;
					convertToPS(fileName);
					break;
				default:
					oOutput.innerHTML = "Upload Sunfire: Unsuccessful: " + obj.status;
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
	oOutput.innerHTML = "Converting to PS...";
	var formData = new FormData();
	formData.append("username", document.getElementById("username").value);
	formData.append("password", document.getElementById("password").value);
	formData.append("fileName", fileName);
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
					oOutput.innerHTML = "PDFToPS: Successful " + obj.verbose;
					doPrint(fileName);
					break;
				default:
					oOutput.innerHTML = "PDFToPS: Unsuccessful: " + obj.status + obj.error + obj.verbose;
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
	oOutput.innerHTML = "Sending print job";
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
				oOutput.innerHTML = "Print: Successful. Collect it at " + printer;
			}
			else
			{
				oOutput.innerHTML = "Print: Unsuccessful: " + obj.status;
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
							changeAlertMSG("Logged in successfully! ^_^", ALERT_SUCCESS);
													
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