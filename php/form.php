<!DOCTYPE html><html><head><title>FORM ANSWERS</title></head><body>
<h1>PHP HELLO WORLD</h1>

<?php
$username = $_POST['username'] . "\n";
$users = fopen("users.txt", "a");
fwrite($users,$username);
fclose($users);
echo nl2br($username);
?>


</body></html>