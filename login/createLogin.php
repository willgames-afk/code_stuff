<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	//Validate Username
	if (empty(trim($_POST["username"]))) {
		$username_err = "Please enter a username.";
	} else {
		if (user_exists(trim($_POST["username"]))) {
			$username_err = "Username Taken :(";
		} elseif (strlen(trim($_POST["username"])) > 40){ //Spam protection
			$username_err = "Max Username Length is 40 Characters for display purposes; really long usernames would just get cut off anyway.";
		} else {
			$username = trim($_POST["username"]);
		}
	}

	//Validate Password
	if (empty(trim($_POST["password"]))) {
		$password_err = "Please enter a password!";
	} elseif (strlen(trim($_POST["password"])) < 6) {
		$password_err = "Your password has to have more than 6 characters. Otherwise, it's not very secure.";
	} elseif (strlen(trim($_POST["password"])) > 512) {
		$password_err = "Sorry, but we don't support passwords longer than 512 characters. This is to prevent trollers from breaking the login system with insanely long passwords.";
	} else {
		$password = trim($_POST["password"]);
	}

	//Validate Confirm Password
	if (empty(trim($_POST["confirm_password"]))) {
		$confirm_password_err = "Please confirm your password.";
	} else {
		$confirm_password = trim($_POST["confirm_password"]);
		if (empty($password_err) && ($password != $confirm_password)) {
			$confirm_password_err = "The passwords you entered don't match!";
		}
	}

	//If there are any errors, don't go messing with users.txt!!
	if (empty($username_err) && empty($password_err) && empty($confirm_password_err)) {
		$hash = password_hash($password, PASSWORD_DEFAULT); //Encrypt your password with one-way function
		append_user($username,$hash);
	}
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

//Add User
function append_user($u,$h) {
	$file = fopen("users.txt","a");
	$obj = (object) ['un' => $u,'hash' => $h];
	fwrite($file, "\n".json_encode($obj) );
	fclose($file);
}
?>