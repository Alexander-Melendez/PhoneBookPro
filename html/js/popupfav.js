const form = document.getElementById("form");
form.addEventListener("submit", checkNull);

function checkNull(event)
{
	if (	document.getElementById("first-name").value == "" ||
				document.getElementById("last-name").value == "" ||
				document.getElementById("phone-number").value == "" ||
				document.getElementById("email").value == "")
	{
		let error = document.getElementById("error");
		error.innerHTML = "Please fill in all fields";
		error.style.display = "";
	}
	else
	{
		submit();
	}

	event.preventDefault();
}

function submit()
{
	let operation = localStorage.getItem("operation");

	if (operation == "add")
	{
		add();
	}
	else if (operation == "update")
	{
		update();
	}
}

function update()
{
	updateAsync(function (json) {
		let error = document.getElementById("error");
		error.innerHTML = json.error;
		error.style.display = "";

		if (json.error == "Contact updated")
		{
			error.style.color = "#63a66e";
			checkUser("/fav");
		}
	});
}

// Updates database.
function updateAsync(callback)
{
	var firstName = document.getElementById("first-name").value;
	var lastName = document.getElementById("last-name").value;
  	var phoneNumber = document.getElementById("phone-number").value;
	var email = document.getElementById("email").value;

	var firstNameOld = localStorage.getItem("firstName");
	var lastNameOld = localStorage.getItem("lastName");
  	var phoneNumberOld = localStorage.getItem("phoneNumber");
	var emailOld = localStorage.getItem("email");

	var userId = localStorage.getItem("userId");

	let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,FirstNameOld:firstNameOld,LastNameOld:lastNameOld,PhoneNumberOld:phoneNumberOld,EmailOld:emailOld,UserID:userId,};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/PhonebookEdit.' + extension;
	
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

				localStorage.setItem("firstName", firstName);
				localStorage.setItem("lastName", lastName);
				localStorage.setItem("phoneNumber", phoneNumber);
				localStorage.setItem("email", email);

				callback(json);
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("error").innerHTML = err.message;
	}
}

function remove() {
	let info = document.getElementById("info");
	info.style.display = "none";

	let title = document.getElementById("title");
	title.style.display = "none";

	let popup = document.getElementById("center");
	popup.style.height = "20vh";

	let error = document.getElementById("error");
	error.style.display = "";
	error.style.color = "#ff0000";
	error.innerHTML = "Are you sure you want to delete?"

	document.getElementById("close-button").style.display = "none";
	document.getElementById("edit-button").style.display = "none";
	document.getElementById("remove-button").style.display = "none";
	document.getElementById("favorite-button").style.display = "none";
	document.getElementById("unfavorite-button").style.display = "none";

	let features = document.getElementById("features");

	let okay = document.createElement("button");
	okay.innerHTML = "👍";
	okay.setAttribute("onclick", "removeOkay()");
	okay.setAttribute("id", "okay");
	okay.setAttribute("type", "button");
	
	let cancel = document.createElement("button");
	cancel.innerHTML = "👎";
	cancel.setAttribute("onclick", "removeCancel()");
	cancel.setAttribute("id", "cancel");
	cancel.setAttribute("type", "button");

	features.appendChild(okay);
	features.appendChild(cancel);
}

function removeCancel()
{
	var firstName = localStorage.getItem("firstName");
	var lastName = localStorage.getItem("lastName");
  	var phoneNumber = localStorage.getItem("phoneNumber");
	var email = localStorage.getItem("email");

	let features = document.getElementById("features");
	features.removeChild(document.getElementById("okay"));
	features.removeChild(document.getElementById("cancel"));

	let info = document.getElementById("info");
	info.style.display = "";

	let popup = document.getElementById("center");
	popup.style.height = "60vh";
	
	let title = document.getElementById("title");
	title.style.display = "";

	let error = document.getElementById("error");
	error.style.display = "none";
	error.innerHTML = "";

	document.getElementById("close-button").style.display = "";
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
			document.getElementById("favorite-button").style.display = "";
			document.getElementById("unfavorite-button").style.display = "none";
		}	
	});

}

function removeOkay()
{
	let features = document.getElementById("features");
	features.removeChild(document.getElementById("okay"));
	features.removeChild(document.getElementById("cancel"));
	
	let info = document.getElementById("info");
	info.style.display = "";

	let errorEl = document.getElementById("error");
	errorEl.style.display = "none";
	errorEl.innerHTML = "";

	document.getElementById("title").style.display = "";
	document.getElementById("center").style.height = "60vh";

	document.getElementById("close-button").style.display = "";
	document.getElementById("edit-button").style.display = "";
	document.getElementById("remove-button").style.display = "";

	removeAsync(function(json) {
		error(json);
	});
}

function removeAsync(callback)
{
	var firstName = localStorage.getItem("firstName");
	var lastName = localStorage.getItem("lastName");
  var phoneNumber = localStorage.getItem("phoneNumber");
	var email = localStorage.getItem("email");

	let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/PhonebookRemove.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200)
			{
				let json = JSON.parse( xhr.responseText );
				callback(json);
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function favorite() {
	favoriteAsync(function() {
		closePopup();
		checkUser("/fav");
	});
}

function favoriteAsync(callback)
{
	var firstName = localStorage.getItem("firstName");
	var lastName = localStorage.getItem("lastName");
  var phoneNumber = localStorage.getItem("phoneNumber");
	var email = localStorage.getItem("email");

	let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId,Favorite:0};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/PhonebookFavorite.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200)
			{
				callback();
			}
		}
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}
}

function closePopup()
{
	let error = document.getElementById("error");
	error.innerHTML = "";
	error.style.display = "none";
	error.style.color = "#ff0000";
	let popup = document.getElementById("popup");
	popup.style.display = "none";
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

function error(json)
{
	if (json.error != "")
	{
		let error = document.getElementById("error");
		error.innerHTML = json.error;
		error.style.display = "";
	}
	else
	{
		closePopup();
		searchDatabase("/fav");
	}
}

