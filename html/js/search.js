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

function sortBy(newSort)
{
	let oldSort = document.getElementById("sort");
	oldSort.removeAttribute("id");
	let temp = oldSort.innerHTML.split(" ");
	
	if (temp.length == 2)
	{
		oldSort.innerHTML = temp[0];
	}
	else
	{
		oldSort.innerHTML = temp[0] + " " + temp[1];
	}

	let element;

	switch(newSort)
	{
		case "FirstName":
			element = document.querySelector(".sort-first");
			element.setAttribute("id", "sort");
			temp = element.innerHTML.split(" ");
			element.innerHTML = temp[0] + " " + temp[1] + " ▼";
			break;
		case "LastName":
			element = document.querySelector(".sort-last");
			element.setAttribute("id", "sort");
			temp = element.innerHTML.split(" ");
			element.innerHTML = temp[0] + " " + temp[1] + " ▼";
			break;
		case "PhoneNumber":
			element = document.querySelector(".sort-phone");
			element.setAttribute("id", "sort");
			temp = element.innerHTML.split(" ");
			element.innerHTML = temp[0] + " " + temp[1] + " ▼";
			break;
		default:
			element = document.querySelector(".sort-email");
			element.setAttribute("id", "sort");
			temp = element.innerHTML.split(" ");
			element.innerHTML = temp[0]  + " ▼";
	}

	searchUser();
}

function searchDatabase(search)
{
	document.getElementById("contacts").innerHTML = "";
	let sortElement = document.getElementById("sort");
	let sort = "";

	if (sortElement.classList.contains("sort-first"))
	{
		sort = "FirstName";
	}
	else if (sortElement.classList.contains("sort-last"))
	{
		sort = "LastName";
	}
	else if (sortElement.classList.contains("sort-phone"))
	{
		sort = "PhoneNumber";
	}
	else
	{
		sort = "Email";
	}

	let tmp = {UserID:userId,search:search,sort:sort};
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
					row.classList.add("row");
					row.setAttribute("onclick", "openPopup(this.innerHTML)");
					if (json.results[i].Favorite == 1)
					{
						row.classList.add("favorite");
					}

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
	document.getElementById("popup").style.animation="animatezoom 0.3s";

	var firstName = "";
	var lastName = "";
	var phoneNumber = "";
	var email = "";

	if (row != null)
	{
		parseRow();
		document.getElementById("title").innerHTML = "Edit a user";
		localStorage.setItem("operation", "update");
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
		document.getElementById("title").innerHTML = "Add a user";
		localStorage.setItem("operation", "add");
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
		document.getElementById("first-name").value = firstName;
		document.getElementById("last-name").value = lastName;
		document.getElementById("phone-number").value = phoneNumber;
		document.getElementById("email").value = email;

		localStorage.setItem("firstName", firstName);
		localStorage.setItem("lastName", lastName);
		localStorage.setItem("phoneNumber", phoneNumber);
		localStorage.setItem("email", email);
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

