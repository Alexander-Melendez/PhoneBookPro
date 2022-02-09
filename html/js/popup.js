// Updates database.
function update()
{
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
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}

function remove() {
	let info = document.getElementById("info");
	info.style.display = "none";

	let error = document.getElementById("error");
	error.style.display = "";
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

function add() {
	addAsync(function (json) {
		error(json);
	});
}

function addAsync(callback)
{	
	var firstName = document.getElementById("first-name").innerHTML;
	var lastName = document.getElementById("last-name").innerHTML;
  	var phoneNumber = document.getElementById("phone-number").innerHTML;
	var email = document.getElementById("email").innerHTML;

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

function favorite() {
	favoriteAsync(function () {
		checkUser(document.getElementById("send").value);
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