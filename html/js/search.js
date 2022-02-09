const urlBase = 'http://phonebookpro.me/API';
const extension = 'php';

let userId = 0;
let search = "/all";

function checkUser(command)
{
	if (localStorage.getItem("userId") == null)
	{
		alert("Please sign back in.");
		window.location.href = "index.html";
	}
	else
	{
		userId = localStorage.getItem("userId");
		searchDatabase(search = command);
	}
}

var input = document.getElementById("send");
input.addEventListener("keydown", function (e) {
	if (e.code === "Enter") {
		searchUser();
	}
});
input.addEventListener("keyup", function (e) {
	if ((e.keyCode > 31 && e.keyCode < 127) || e.keyCode == 8 ) {
		searchUser();
	}
});



function searchUser()
{
	searchDatabase(search = document.getElementById("send").value);
}

function searchDatabase(search)
{
	document.getElementById("contacts").innerHTML = "";
	
	let list = "";

	let tmp = {UserID:userId,search:search};
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
					let row = document.createElement('div');
					row.className = "row";
					row.setAttribute("onclick", "openPopup(this.innerHTML)");

					let colFirstName = document.createElement('div');
					colFirstName.classList.add("col");
					colFirstName.classList.add("first-name");
					colFirstName.innerHTML = json.results[i].FirstName;

					let colLastName = document.createElement('div');
					colLastName.classList.add("col");
					colLastName.classList.add("last-name");
					colLastName.innerHTML = json.results[i].LastName;

					let colPhoneNumber = document.createElement('div');
					colPhoneNumber.classList.add("col");
					colPhoneNumber.classList.add("phone-number");
					colPhoneNumber.innerHTML = json.results[i].PhoneNumber;

					let colEmail = document.createElement('div');
					colEmail.classList.add("col");
					colEmail.classList.add("email");
					colEmail.innerHTML = json.results[i].Email;

					row.appendChild(colFirstName);
					row.appendChild(colLastName);
					row.appendChild(colPhoneNumber);
					row.appendChild(colEmail);

					document.getElementById("contacts").appendChild(row);
				}
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
		parseRow();
		document.getElementById("add-button").style.display = "none";
		document.getElementById("edit-button").style.display = "";
		document.getElementById("remove-button").style.display = "";
		getFavorite(firstName, lastName, phoneNumber, email, function(favorite){
			if(favorite == 1)
			{
				document.getElementById("favorite-button").style.display = "none";
				document.getElementById("unfavorite-button").style.display = "";
			}
			else
			{
				document.getElementById("unfavorite-button").style.display = "none";
				document.getElementById("favorite-button").style.display = "";
			}
		});
	}
	else
	{
		document.getElementById("add-button").style.display = "";
		document.getElementById("edit-button").style.display = "none";
		document.getElementById("remove-button").style.display = "none";
		document.getElementById("favorite-button").style.display = "none";
		document.getElementById("unfavorite-button").style.display = "none";
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

function getFavorite(firstName, lastName, phoneNumber, email, callback)
{
	var fav = 0;
	let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/PhonebookIsFavorite.' + extension;

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
				callback(fav = json.Favorite);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}


