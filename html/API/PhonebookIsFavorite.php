<?php
	$inData = getRequestInfo();
	
	$firstName = $inData["FirstName"];
	$lastName = $inData["LastName"];
	$phoneNumber = $inData["PhoneNumber"];
	$email = $inData["Email"];
	$userId = $inData["UserID"];

	$conn = new mysqli("localhost", "admin", "password", "Phonebook"); 	
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName,LastName,PhoneNumber,Email,UserID) VALUES (?,?,?,?,?)");
		$stmt->bind_param("sssss", $firstName, $lastName, $phoneNumber, $email, $userId);
		$stmt->execute();

		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
			returnWithInfo( $row["Favorite"] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithInfo( $favorite )
	{
		$retValue = '{"Favorite":' . $favorite '}';
		sendResultInfoAsJson( $retValue );
	}
	
?>