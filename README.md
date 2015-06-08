# SOCPrint
Orbital Programme

BACKUP 11:10 PM 30/05/2015
////////////////////////////////////////////////////////////
                  README
////////////////////////////////////////////////////////////

Ideation:

 

Prototype website: http://52.74.219.251/

 

Planned Features: Core features that has to be implemented by next iteration, and completed features, are on the trello card board below.




References Used:

For learning:

Wikipedia (https://en.wikipedia.org) first-stop knowledge centre
Code Academy (http://www.codecademy.com/) for PHP, HTML, JavaScript
W3Schools (http://www.w3schools.com/) for HTML, CSS, PHP, JavaScript, AJAX
Yeo Meng Keng’s Blog (http://yeokhengmeng.com/2014/12/nus-soc-print-androidios-background-technical-aspects-and-learning-points/) for process on printing from Sunfire
For creating documentation of the project:

Google drive (https://drive.google.com/) for record keeping, discussions and project logging
Trello (https://trello.com/) for creating user stories and progress monitoring
For development of SOCPrint:

PHPSecLib (http://phpseclib.sourceforge.net/) the SSH library for PHP
Ubuntu forums (http://ubuntuforums.org/) for troubleshooting on our main development platform
GitHub (https://github.com/) for version control
SOC Docs Repository (https://docs.comp.nus.edu.sg/) for sunfire and printing related issues
Amazon EC2 (http://aws.amazon.com/ec2/) for virtual server hosting
Notepad++ (https://notepad-plus-plus.org/) for the editor of choice
Google Chrome (http://www.google.com/chrome/) for the broswer utilized to preview the website


////////////////////////////////////////////////////////////
                  LOG
////////////////////////////////////////////////////////////

Ken total hours 70 from spreadsheet.

Github contributions: https://github.com/KenLSM

 

 	Date	Ken	Juho	 	 	 	 
Total	 	70.5	18.5	 	 	 	 
Attended Workshop Day 1	May 11	8	8	 	 	 	 
Learn CSS on CodeAcademy	May 11	2	 	 	 	 	 
Attended Workshop Day 2	May 12	8	8	 	 	 	 
Learn Ruby on CodeAcademy	May 12	1	 	 	 	 	 
Learn JavaScript on CodeAcademy	May 13	2	 	 	 	 	 
Learn HTML on CodeAcademy	May 13	2	 	 	 	 	 
Figuring out ubuntu and apache server	May 13	1	 	 	 	 	 
Learn HTML on W3School	May 14	2	 	 	 	 	 
Learn JavaScript on W3School	May 14	2	 	 	 	 	 
Learn PHP on W3School	May 14	1	 	 	 	 	 
Discussion with Gerald Yeo (Print queue maker)	May 14	1	 	 	 	 	 
Researching SSH2 connection using PHP + setup on server	May 14	4	 	 	requires installation of php ssh2 protocol into server	using ubuntu & lamp	 
Wrote check login page with UNIX account in HTML and PHP	May 14	1	 	 	 	 	 
Researching SSH2 connection using secphplib	May 15	4	 	 	does not require any installation, buthave to add in codes and folders into the server	Update: Currently using this library for future use	 
Fixing: unable to connect to sunfire with ssh2 from server	May 15 - 21	8	 	 	works from localhost but doesnt work from server. Server resides in SG. Checked with yanhao on possible points of failure
Might be due to server being outside of SOC (but my local host is also outside). 
Possible fix, setup VPN for server (VPN for server possible?)	Update: Switching to localhost for now. Configured my router to forward all html requests to IP of host	Update2: Doesnt work again for localhost. Worked for a day before router not responded
Learn GitHub	May 17	1	 	 	Using command line	 	 
Read on Responsive Web Design	May 17	1	 	 	Read about SASS as well	Use media query to create responsive websites...	 
Switch to local host	May 17	1	 	 	 	 	 
Added issues and repo to github	May 18	1	 	 	We switched to trello for further user stories	 	 
Read on NUSSOCPrint blog on printing	May 18	2	 	 	Following his steps	 	 
Learnt and added JS scripts to index.html for input	May 19	1	 	 	Prevents incomplete forms	 	 
Added xmlhttprequest with JS script for username/pw check	May 19	2	 	 	Added disable to prevent user from editing once logged in	 	 
Trying out AWS EC2 for server hosting	May 20	3	 	 	Obtained a server which runs ubuntu. Installed LAMP on it. Can host server, have not checked if able to connect to sunfire	Changed a few network setting for web hosting.
Unable to do FTP to transfer files, using filezilla.	See server progress for details
Added temp logo and redesigning webpage with margins	May 25	4	 	 	Just playing and exploring on what css can do	 	 
Readup on sftp for uploading	May 25	2	 	 	Might be uploading to either EC2 or sunfire to process into pdf then postscript	 	 
Checked out bootstrap	May 26	1	 	 	Might have to redo webpage if we are using this... However, we might not be catering for mobile users (use the app)	Works by gridding..	 
Meeting (27 May)	May 27	2.5	2.5	 	Progress update / Github issuees / Server / Design / Possible additional features to be worked on / Datelines	 	 
Writing report for milestone 1	May 30	2	 	 	 	 	 
