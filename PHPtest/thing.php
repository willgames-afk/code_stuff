<!DOCTYPE html><html><head><title>PHP TEST</title></head><body>
<h1>PHP HELLO WORLD</h1>

<?php
$txt = 'Will Kam';
echo "Coded by $txt!!<br>";
echo "Coded by " . $txt . "!!<br>";
echo 1+1;

echo "<h2>PHP is Fun!</h2>";
echo "Hello world!<br>";
echo "I'm about to learn PHP!<br>";
echo "This ", "string ", "was ", "made ", "with multiple parameters.";

echo "<br><br>";

echo $_SERVER['PHP_SELF'];
echo "<br>";
echo $_SERVER['SERVER_NAME'];
echo "<br>";
echo $_SERVER['HTTP_HOST'];
echo "<br>";
echo $_SERVER['HTTP_REFERER'];
echo "<br>";
echo $_SERVER['HTTP_USER_AGENT'];
echo "<br>";
echo $_SERVER['SCRIPT_NAME'];

echo "<br><br>";

echo readfile('testtext.txt'), '<br>';

$myfile = fopen("testtext.txt",'r') or die("Unable to do the thing.");

echo fread($myfile, filesize('testtext.txt'));
echo fgets($myfile);

fclose($myfile);

echo "<br><br>";

$myfile = fopen("testtext.txt", "r") or die("Unable to open file!");
// Output one line until end-of-file
while(!feof($myfile)) {
  echo fgets($myfile) . "<br>";
}
fclose($myfile);

$myfile = fopen("testtext.txt", "r") or die("Unable to open file!");
// Output one character until end-of-file
while(!feof($myfile)) {
  echo fgetc($myfile);
}
fclose($myfile);

?>


</body></html>