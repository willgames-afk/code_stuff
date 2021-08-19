<?php
		session_start();
		unset($_SESSION["loggedin"]);
		unset($_SESSION["username"]);
   		unset($_SESSION["password"]);

		header('Refresh: 2; URL = login.php');
	?>
<!DOCTYPE HTML>
<html>
	<head>
		<link href='/login/login.css' rel='stylesheet'>
		<title>Welcome!</title>
	</head>
	<body class="greet">
		<p>You have been logged out sucessfully!<br><br>
			Redirecting to log-in page...</p>
	</body>
</html>
