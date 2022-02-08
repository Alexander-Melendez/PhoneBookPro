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

function test(e)
{
	alert(e);
}

function openPopup(row)
{
	let popup = document.getElementById("popup");
	popup.style.display = "flex";

	var firstName = "";
	var lastName = "";
	var phoneNumber = "";
	var email = "";

	if (row != null)
	{
		document.getElementById("add-button").style.display = "none";
		document.getElementById("edit-button").style.display = "";
		document.getElementById("remove-button").style.display = "";
		document.getElementById("favorite-button").style.display = "";
		parseRow();
	}
	else
	{
		document.getElementById("add-button").style.display = "";
		document.getElementById("edit-button").style.display = "none";
		document.getElementById("remove-button").style.display = "none";
		document.getElementById("favorite-button").style.display = "none";
	}

	updateData();


	function parseRow()
	{
		const parser = new DOMParser();
		const doc = parser.parseFromString(row, 'text/html');

		firstName = doc.querySelector(".first-name").innerHTML;
		lastName = doc.querySelector(".last-name").innerHTML;
		phoneNumber = doc.querySelector(".phone-number").innerHTML;
		email = doc.querySelector(".email").innerHTML;
	}

	function updateData()
	{
		document.getElementById("first-name").innerHTML = firstName;
		document.getElementById("last-name").innerHTML = lastName;
		document.getElementById("phone-number").innerHTML = phoneNumber;
		document.getElementById("email").innerHTML = email;
	}
}



