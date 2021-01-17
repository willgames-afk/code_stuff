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
				echo "Started...\n";
				$comment = $_GET['comment'];
				$user = $_GET['user'];
				if (!$comment || !$user) {
					echo "comment ".json_encode($_GET)." missing comment or username.";
					break;
				}
				$cfile = fopen($comment_file,'a');
				$cfilesize = filesize($comment_file);
				fwrite($cfile,",{\"name\":\"".$user."\",\"text\":\"".$comment."\",\"timestamp\":\"".time()."\"}");
				fclose($cfile);
				echo "Success!\n";
				break;
		}
	}
?>