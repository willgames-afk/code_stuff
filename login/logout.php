<?php
	session_start();
	unset($_SESSION["loggedin"]);
	unset($_SESSION["username"]);
   	unset($_SESSION["password"]);

	header('Refresh: 2; URL = login.php');
	echo 'You have been logged out!';
?>