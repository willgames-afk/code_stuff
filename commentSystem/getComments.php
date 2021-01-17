<?php
	$comment_file = 'comments.txt';
	if ($_GET['action']) {
		switch ($_GET['action']) {
			case "get_comments":
				if (file_exists($comment_file)) {
					echo '[';
					readfile($comment_file);
					echo ']';
				} else {
					echo "[]";
				}
				break;
			case "send_comment":
				echo "Started...";
				$comment = $_GET['comment'];
				$user = $_GET['user'];
				if (!$comment || !$user) {
					echo $_GET." missing comment or username.";
					break;
				}
				$cfile = fopen($comment_file,'a');
				$cfilesize = filesize($comment_file);
				$date = date_create();
				fwrite($cfile,",{\"name\":\"".$user."\",\"text\":\"".$comment."\",\"timestamp\":\"".date_timestamp_get($date)."\"}");
				fclose($cfile);
				echo "Success!";
				break;
		}
	}
?>