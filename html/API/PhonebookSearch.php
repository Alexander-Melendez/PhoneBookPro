<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;
	$sort = $inData["sort"];

	$conn = new mysqli("localhost", "admin", "password", "Phonebook");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt;

		if ($inData["search"] == "/all")
		{
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE UserID=? ORDER BY $sort");
			$stmt->bind_param("s", $inData["UserID"]);
		}
		else if ($inData["search"] == "/fav")
		{
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE Favorite=1 AND UserID=? ORDER BY $sort");
			$stmt->bind_param("s", $inData["UserID"]);
		}
		else
		{
			$stmt = $conn->prepare("SELECT * FROM Contacts WHERE (FirstName LIKE ? OR LastName LIKE ? OR PhoneNumber LIKE ? OR Email LIKE ?) AND UserID=? ORDER BY $sort");
			$search = "%" . $inData["search"] . "%";
			$stmt->bind_param("sssss", $search, $search, $search, $search, $inData["UserID"]);
		}

		$stmt->execute();
		
		$result = $stmt->get_result();
		
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{' .	
									'"FirstName":"' . $row["FirstName"] . 
									'","LastName":"' . $row["LastName"] . 
									'","PhoneNumber":"' . $row["PhoneNumber"] .
									'","Email":"' . $row["Email"] . 
									'","Favorite":' . $row["Favorite"] . '}';

		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>