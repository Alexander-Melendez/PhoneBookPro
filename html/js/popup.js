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

function remove()
{
	var firstName = document.getElementById("first-name").innerHTML;
	var lastName = document.getElementById("last-name").innerHTML;
  var phoneNumber = document.getElementById("phone-number").innerHTML;
	var email = document.getElementById("email").innerHTML;

	let tmp = {FirstName:firstName,LastName:lastName,PhoneNumber:phoneNumber,Email:email,UserID:userId};

	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/PhonebookRemove.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

  closePopup();

  searchUser();
}

function add()
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
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

  closePopup();
}

function favorite()
{
  var firstName = document.getElementById("first-name").innerHTML;
	var lastName = document.getElementById("last-name").innerHTML;
  var phoneNumber = document.getElementById("phone-number").innerHTML;
	var email = document.getElementById("email").innerHTML;
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

