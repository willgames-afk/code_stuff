<?php

session_start();

//Check if already logged in
if (isset($_SESSION["loggedin"]) && $_SESSION["loggedin"] === true) {
	header("location: welcome.php");
	exit;
}
$username = $password = "";
$username_err = $password_err = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	//If username is empty
	if (empty(trim($_POST["username"]))) {
		$username_err = "Please enter a username.";
	} else {
		$username = trim($_POST["username"]);
	}

	//If password is empty
	if (empty(trim($_POST["password"]))) {
		$password_err = "Please enter a password.";
	} else {
		$password = trim($_POST["password"]);
	}

	//If no errors, find and validate our user.
	if (empty($username_err) && empty($password_err)) {
		if (user_exists($username)) {
			$userData = get_user($username);
			if (password_verify($password,$userData->hash)) {
				session_start();
				$_SESSION["loggedin"] = true;
				$_SESSION["id"] = $userData->id;
				$_SESSION["username"] = $username;
			} else {
				//Bad password
				$password_err = "Invalid Password. Either that or we messed up, big time.";

			}

		} else {
			//Username not found
			$username_err = "No account found with that username.";
		}
	} else {
		echo "Something went wrong. Maybe try again later?";
	}
}

//Finds user info
function get_user($u) {
	$file = fopen("users.txt","r");
	while (!feof($file)) {
		$obj = json_decode(fgets($file));
		if ($obj->un == $u) {
			fclose($file);
			return $obj;
		}
	};
	fclose($file);
	return false;
}

//Checks if user exists
function user_exists($u) {
	$file = fopen("users.txt","r");
	while (!feof($file)) {
		$obj = json_decode(fgets($file));
		if ($obj->un == $u) {
			fclose($file);
			return true;
		}
	}
	fclose($file);
	return false;
}
?>