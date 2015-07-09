var isLoggingIn = false;
// Start of upload script
$(document).ready(function()
{	

	var form = document.forms.namedItem("uploadFile");

	form.addEventListener("submit", function(ev, ef) 
	{
		var isLoggedIn = document.getElementById("login").innerHTML;
		var loginMSG =	 document.getElementById("loginMSG");
		if ( false & isLoggedIn == "Login")
		{
			loginMSG.style.color = "red";
			loginMSG.innerHTML = "Please login first";	
		}
		else
		{
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
					
					switch(obj.status)
					{
						case "OK":
						oOutput.innerHTML = "Upload: You uploaded: " + obj.fileName + "<br> Size of " + obj.fileSize + " and file type of " + obj.fileType;
						uploadToSunfire(obj.fileName);
						break;
						default:
							oOutput.innerHTML = "Upload: Unsuccessful: "+ obj.status;
						break;
					}
				},
				contentType: false,
				processData: false
			})
		}
		ev.preventDefault();
	}, false);
	
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
			
			switch(obj.status)
			{
				case "OK":
				oOutput.innerHTML = "Upload Sunfire: Sucessful" + obj.verbose;
				convertToPS(fileName);
				break;
				default:
					oOutput.innerHTML = "Upload Sunfire: Unsuccessful: "+ obj.status;
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
			
			switch(obj.status)
			{
				case "OK":
				oOutput.innerHTML = "PDFToPS: Successful " + obj.verbose;
				doPrint(fileName);
				break;
				default:
					oOutput.innerHTML = "PDFToPS: Unsuccessful: "+ obj.status + obj.error + obj.verbose;
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
	$.ajax(
	{
		type: 'post',
		url: 'doPrint.php',
		data: formData,
		success: function(data)
		{
			var obj = JSON.parse(data);
			
			if(obj.status == "")
			{
				oOutput.innerHTML = "Print: Successful. Collect it at psts~";
			}
			else			
			{	
			oOutput.innerHTML = "Print: Unsuccessful: "+ obj.status;
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
	if (xmlhttp==null)
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
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "SendCommand.php", true);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send("name=" + document.getElementById("username").value + "&password=" + document.getElementById("password").value);
	
	xmlhttp.onreadystatechange = function() 
	{
		if (xmlhttp.readyState == 4) 
		{
			document.getElementById("printerStatus").innerHTML = xmlhttp.responseText;
		}
	}
}
// Ajax version
function checkLogin()
{
	var loginMSG =	 document.getElementById("loginMSG");	
	// If is logging in, dont allow another ajax submittion, exit immediately
	if(isLoggingIn)
	{	
		return;		
	}	
	// Checks for login and pw to be both entered before submitting ajax
	if(document.getElementById("login").innerHTML == "Login")
	{
		if(document.getElementById("username").value == "")
		{
			loginMSG.style.color = "red";
			loginMSG.innerHTML = "Please enter your username";	
			return;
		}
		if(document.getElementById("password").value == "")
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
			data: JSON.stringify({name : document.getElementById("username").value, password : document.getElementById("password").value}),
			success: function(data)
			{				
				data = JSON.parse(data);
				switch(data)
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
						document.getElementById("username").disabled = true;
						document.getElementById("password").disabled = true;
						sendCommand();
						break;
					}
					default :
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
		document.getElementById("username").disabled = false;
		document.getElementById("password").disabled = false;
	}
}