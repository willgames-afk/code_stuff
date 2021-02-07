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
				$comment = $_GET['comment'];
				session_start();
				if ($_SESSION["loggedin"] == true) {
					$user = $_SESSION["username"];
					if (!$comment) {
						echo "{\"success\":false,\"errorCode\":\"400\",\"desc\":\"You forgot to write your comment.\"}";
						break;
					}
					if (!$user) {
						echo "{\"success\":false,\"errorCode\":\"401\",\"desc\":\"Error: You are not logged in.\"}";
						break;
					}
					$cfile = fopen($comment_file,'a');
					$cfilesize = filesize($comment_file);
					fwrite($cfile,",\n{\"name\":\"".$user."\",\"text\":\"".$comment."\",\"timestamp\":\"".time()."\"}");
					fclose($cfile);
					echo "{\"success\":true}";
				} else {
					echo "{\"success\":false,\"errorCode\":\"401\",\"desc\":\"Not logged in.\"}";
				}
				break;
		}
	}
?>