const urlBase = 'http://phonebookpro.me/API';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("username").value;
	let password = document.getElementById("password").value;
	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//let tmp = {login:login,password:password};
	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/PhonebookLogin.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
        localStorage.setItem("userId", userId);
   
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
				window.location.href = "search.html";
	
				
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
function doRegister()
{
	userId = 0;
	let firstname = document.getElementById("firstname").value;
	let lastname = document.getElementById("lastname").value;
	let login = document.getElementById("regusername").value;
	let password = document.getElementById("regpassword").value;
	var hash = md5( password );
	if(login.length < 5) {
		document.getElementById("regResult").innerHTML = "Username must be at least 5 characters";
		return;
	}
	if(password.length < 5) {
		document.getElementById("regResult").innerHTML = "Password must be at least 5 characters";
		return;
	}
	
	document.getElementById("regResult").innerHTML = "";

	//let tmp = {firstName:firstname,lastName:lastname,login:login,password:password};
	let tmp = {firstName:firstname,lastName:lastname,login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	let url = urlBase + '/PhonebookRegister.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
			{
				if (this.readyState == 4 && this.status == 200) {
					let jsonObject = JSON.parse( xhr.responseText );
					error = jsonObject.error;
					if(error != "") {
						document.getElementById("regResult").innerHTML = "Username already exists";
						return;
					}
					saveCookie();
					openLogin();
				}
			};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}
function openLogin() {
	document.getElementById('positiom-middle-wrapper').style.display="none";
	document.getElementById('position-middle').style.display="none";
	document.getElementById('Welcome').style.display="none";
	document.getElementById('LoginPage').style.display="block";
	document.getElementById('RegisterPage').style.display="none";
}
function closeLogin() {
	document.getElementById('positiom-middle-wrapper').style.display="block";
	document.getElementById('position-middle').style.display="block";
	document.getElementById('Welcome').style.display="block";
	document.getElementById('LoginPage').style.display="none";
	document.getElementById('RegisterPage').style.display="none";
	
}
function openRegister() {
	document.getElementById('positiom-middle-wrapper').style.display="none";
	document.getElementById('position-middle').style.display="none";
	document.getElementById('Welcome').style.display="none";
	document.getElementById('LoginPage').style.display="none";
	document.getElementById('RegisterPage').style.display="block";
	
}
function closeRegister() {
	document.getElementById('positiom-middle-wrapper').style.display="block";
	document.getElementById('position-middle').style.display="block";
	document.getElementById('Welcome').style.display="block";
	document.getElementById('LoginPage').style.display="none";
	document.getElementById('RegisterPage').style.display="none";
	
}