<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && $_GET["from"] == 'js') {
	session_start();
	if ($_SESSION["loggedin"]) {
		echo "{";
		echo "\"loggedin\":", $_SESSION["loggedin"], ",";
		echo "\"username\":", $_SESSION["username"];
		echo "}";
	} else {
		echo "{\"loggedin\":false}"; //Error; No session (and therefore no login info) to return
	}
}?>