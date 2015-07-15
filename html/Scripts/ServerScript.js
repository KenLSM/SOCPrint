var isLoggingIn = false;
// Start of upload script
var temp_counter = 0;

function temp()
{
	temp_counter++;
	document.getElementById("tempCounter").innerHTML = temp_counter + "s since last refresh";
	setTimeout(temp, 1000);
}

// Function to check if printer is selected or not
// Uses the url # data to check
// Return true on printer selected
// Return false if printer cannot be found
var printer = "";

function checkPrinterSelection()
{
	printer = window.location.hash.substring(1);

	switch (text)
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
			loginMSG.style.color = "red";
			loginMSG.innerHTML = "Please login first";
		}
		// Check if printer is selected or not
		else if (checkPrinterSelection() == false)
		{
			loginMSG.style.color = "red";
			loginMSG.innerHTML = "Please select a printer";
		}
		else
		{
			loginMSG.style.color = "green";
			loginMSG.innerHTML = "Uploading started";

			var oOutput = document.getElementById("uploadServer");
			var formData = new FormData(document.forms.namedItem("uploadFile"));

			formData.append("username", document.getElementById("username").value);
			formData.append("password", document.getElementById("password").value);
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

	// Login input field script. To allow pressing enter to fire login event
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
	// end login input field script

	// to enable tooltip
	$('[data-toggle="tooltip"]').tooltip();
	// end

});

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
			loginMSG.style.color = "red";
			loginMSG.innerHTML = "Please enter your username";
			return;
		}
		if (document.getElementById("password").value == "")
		{
			loginMSG.style.color = "red";
			loginMSG.innerHTML = "Please enter your password";
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
							loginMSG.style.color = "red";
							loginMSG.innerHTML = "Unable to connect to sunfire";
							break;
						}
					case "WRONG":
						{
							loginMSG.style.color = "red";
							loginMSG.innerHTML = "Incorrect username or password";
							break;
						}
					case "OK":
						{
							document.getElementById("login").innerHTML = "Disconnect";
							loginMSG.style.color = "lime";
							loginMSG.innerHTML = "Logged in successfully";
							//document.getElementById("username").disabled = true;
							//document.getElementById("password").disabled = true;
							//To make the log in field to disappear
							document.getElementById("username").style.display = "none";
							document.getElementById("password").style.display = "none";

							setTimeout(sendCommand, 5000);
							temp();
							break;
						}
					default:
						{
							loginMSG.style.color = "red";
							loginMSG.innerHTML = "Unknown: " + data;
							break;
						}
				}
				// Enable login again
				isLoggingIn = false;
			}
		})
		isLoggingIn = true;
		loginMSG.style.color = "orange";
		loginMSG.innerHTML = "Logging In Now";
	}
	else
	{
		document.getElementById("login").innerHTML = "Login";
		document.getElementById("username").value = "";
		document.getElementById("password").value = "";

		loginMSG.style.color = "lime";
		loginMSG.innerHTML = "Disconnected successfully";
		//document.getElementById("username").disabled = false;
		//document.getElementById("password").disabled = false;

		//To make the log in field to appear
		document.getElementById("username").style.display = "initial";
		document.getElementById("password").style.display = "initial";
		location.reload();
	}
}
