<!DOCTYPE html>
<html>

<head>
    <title>FORM TEST</title>
    <link href="https://fonts.googleapis.com/css2?family=Ubuntu&display=swap" rel="stylesheet">
    <link href='/default.css' rel="stylesheet">
</head>

<body>
    <div class='mainbox'>
        <h1>LOGIN</h1>
        <div class='menu'>
            <p id='localhost?'>Not locally hosted</p>
            <script src='/localhostdetector.js'></script>
            <a href='/'>Homepage</a>
        </div>

        <form method="get" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">
            Username: <input type=text name='username'><br>
            <?php
                // define variables and set to empty values
                $username = "";

                if ($_SERVER["REQUEST_METHOD"] == "GET") {
                    $username = test_input($_GET["username"]) . "\n";
                    $users = fopen("users.txt", "a");
                    fwrite($users,$username);
                    fclose($users);
                    echo nl2br($username);
                }

                function test_input($data) {
                    $data = trim($data);
                    $data = stripslashes($data);
                    $data = htmlspecialchars($data);
                    return $data;
                }
            ?><br>
            <input type='submit'>
        </form>

    </div>
    <canvas id="dotcanvas">
        <script src="/noms/nom.js"></script>
        <script>
            things.resize();
            for (i = 0; i < 30; i++) {
                things.make(Math.random() * canvas.width, Math.random() * canvas.height, things.rgbify(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)));
            };
            requestAnimationFrame(things.main)
        </script>
    </canvas>
</body>

</html>