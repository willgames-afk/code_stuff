<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	if ($_SESSION["loggedin"] == true) {
		echo "You're already logged in, no need to create an account!";
	} else {
	//Validate Username
		if (empty(trim($_POST["username"]))) {
			$username_err = "Please enter a username.<br>";
		} else {
			if (user_exists(trim($_POST["username"]))) {
				$username_err = "Username Taken :(<br>";
			} elseif (strlen(trim($_POST["username"])) > 40){ //Spam protection
				$username_err = "Max Username Length is 40 Characters for display purposes; really long usernames would just get cut off anyway.<br>";
			} else {
				$username = trim($_POST["username"]);
			}	
		}

		//Validate Password
		if (empty(trim($_POST["password"]))) {
			$password_err = "Please enter a password!<br>";
		} elseif (strlen(trim($_POST["password"])) < 6) {
			$password_err = "Your password has to have more than 6 characters. Otherwise, it's not very secure.<br>";
		} elseif (strlen(trim($_POST["password"])) > 512) {
			$password_err = "Sorry, but we don't support passwords longer than 512 characters. This is to prevent trollers from breaking the login system with insanely long passwords.<br>";
		} else {
			$password = trim($_POST["password"]);
		}

		//Validate Confirm Password
		if (empty(trim($_POST["confirm_password"]))) {
			$confirm_password_err = "Please confirm your password.<br>";
		} else {
			$confirm_password = trim($_POST["confirm_password"]);
			if (empty($password_err) && ($password != $confirm_password)) {
			$confirm_password_err = "The passwords you entered don't match!<br>";
			}
		}

		//If there are any errors, don't go messing with users.txt!!
		if (empty($username_err) && empty($password_err) && empty($confirm_password_err)) {
			$hash = password_hash($password, PASSWORD_DEFAULT); //Encrypt your password with one-way function
			append_user($username,$hash);
			session_start();
			$_SESSION["loggedin"] = true;
			$_SESSION["id"] = $userData->id;
			$_SESSION["username"] = $username;
			header("location: welcome.php");
		}
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
<!DOCTYPE HTML>
<html lang='en'>
<head>
	<link href='/login/login.css' rel='stylesheet'>
	<title>Login</title>
</head>
<body>
<h2>Create Account</h2>
<form action='<?php echo htmlspecialchars($_SERVER['PHP_SELF']); ?>' method='POST'>
Username <input type='text' name='username' value=''><br>
	<?php if (!empty($username_err)) {
		echo '<p class="err">' . $username_err . "</p>";
	}?>
Password <input type='password' name='password'><br>
<?php if (!empty($password_err)) {
		echo '<p class="err">' . $password_err . "</p>";
	}?>
Confirm Password <input type='password' name='confirm_password'><br>
	<?php if (!empty($confirm_password_err)) {
		echo '<p class="err">' . $confirm_password_err . "</p>";
	}?>
	<input type='submit'><br>
	<a href="/login/login.php">Log In</a>
</form>
</body>