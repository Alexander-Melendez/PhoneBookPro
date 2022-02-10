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
	let operation = document.getElementById("title");

	if (operation.innerHTML == "Add a user")
	{
		add();
	}
	else
	{
		update();
	}
}

// Updates database.
function update()
{
	alert("Mayday");
	var firstName = document.getElementById("first-name").innerHTML;
	var lastName = document.getElementById("last-name").innerHTML;
  	var phoneNumber = document.getElementById("phone-number").innerHTML;
	var email = document.getElementById("email").innerHTML;

  let search = e;
	document.getElementById("result").innerHTML = "";

	let tmp = {search:search,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/PhonebookSearch.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
    xhr.send(jsonPayload);
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

	let error = document.getElementById("error");
	error.style.display = "";
	error.style.height = "100%";

	let div = document.createElement("div");
	div.innerHTML = "Are you sure you want to delete?";

	error.appendChild(div);

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
	
	let cancel = document.createElement("button");
	cancel.innerHTML = "👎";
	cancel.setAttribute("onclick", "removeCancel()");
	cancel.setAttribute("id", "cancel");

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

	let title = document.getElementById("title");
	title.style.display = "";

	let error = document.getElementById("error");
	document.getElementById("error").style.height = "auto";
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
	removeAsync(function(json) {
		document.getElementById("error").style.height = "auto";
		document.getElementById("title").style.display = "";
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
		document.getElementById("error").innerHTML = err.message;
	}
}

function add() {
	addAsync(function (json) {
		error(json);
	});
}

function addAsync(callback)
{	
	var firstName = document.getElementById("first-name").value;
	var lastName = document.getElementById("last-name").value;
  var phoneNumber = document.getElementById("phone-number").value;
	var email = document.getElementById("email").value;

	let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/PhonebookAdd.' + extension;

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

function favorite(favorite) {
	favoriteAsync(function () {
		if (favorite == "favorite")
		{
			closePopup();
			checkUser("/fav");
		}
		else
		{
			checkUser(document.getElementById("send").value);
		}
	});
}

function favoriteAsync(callback)
{
	var firstName = localStorage.getItem("firstName");
	var lastName = localStorage.getItem("lastName");
  var phoneNumber = localStorage.getItem("phoneNumber");
	var email = localStorage.getItem("email");

	getFavorite(firstName, lastName, phoneNumber, email, function(favorite){
		if(favorite == 1)
		{
			favorite = 0;
			document.getElementById("favorite-button").style.display = "";
			document.getElementById("unfavorite-button").style.display = "none";
		}
		else
		{
			favorite = 1;
			document.getElementById("favorite-button").style.display = "none";
			document.getElementById("unfavorite-button").style.display = "";
		}

		let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId,Favorite:favorite};

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
	});
}

function closePopup()
{
	let error = document.getElementById("error");
	error.innerHTML = "";
	error.style.display = "none";
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
		checkUser(document.getElementById("send").value);
	}
}