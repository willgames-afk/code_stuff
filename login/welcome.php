<?php session_start()?>
<!DOCTYPE HTML>
<html>
	<head>
		<link href='/login/login.css' rel='stylesheet'>
		<title>Welcome!</title>
	</head>
	<body class="greet">
		<p>Hello, <?php echo $_SESSION["username"]?>!</p>
		<a href="/login/logout.php">Log Out</a>
	</body>
</html>