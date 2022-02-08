const urlBase = 'http://phonebookpro.me/API';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let search = "";

function checkUser()
{
	if (localStorage.getItem("userId") == null)
	{
		alert("Please sign back in.");
		window.location.href = "index.html";
	}
	else
	{
		userId = localStorage.getItem("userId");
	}
}

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	let tmp = {color:newColor,userId,userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

var input = document.getElementById("send");
input.addEventListener("keydown", function (e) {
	if (e.code === "Enter") {
		searchDatabase(input.value)
	}
});

function searchUser()
{
	searchDatabase(document.getElementById("send").value);
}

function searchDatabase(search)
{
	document.getElementById("result").innerHTML = "";
	
	let list = "";

	let tmp = {search:search,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/PhonebookSearch.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				let json = JSON.parse( xhr.responseText );
				
				for( let i=0; i<json.results.length; i++ )
				{
					list += json.results[i];
					if( i < json.results.length - 1 )
					{
						list += "<br />\r\n";
					}
				}
				
				document.getElementById("result").innerHTML = list;
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function test()
{
	alert("poop");
}

function openPopup(row)
{
	let popup = document.getElementById("popup");
	popup.style.display = "flex";
	updateData();

	function updateData()
	{
		console.log(typeof row);

		var firstName = row.querySelector(".first-name").innerHTML;
		var lastName = row.querySelector("last-name").innerHTML;
		var phoneNumber = row.querySelector("phone-number").innerHTML;
		var email = row.querySelector("email").innerHTML;

		alert(firstName);

		document.getElementById("first-name").innerHTML = firstName.innerHTML;
	}
}



