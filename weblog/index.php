<!DOCTYPE html><html><head></head><body><?php
class Post
{
	public $title = "";
	public $desc = "";
	public $date = "";
	public $content = "";
	public $tester = null;

	public function __construct($path) {
		$fp = fopen($path, "r");
		$this->title = fgets($fp);
		$this->desc = fgets($fp);
		$this->date = fgets($fp);
		fgets($fp); //Get empty line

		$this->content = fread($fp,filesize($path));

		$doc = new DOMDocument();
		$doc->loadXML("<all>".$this->content."</all>");

		$x = $doc->documentElement;
		$kvp = [];
		$i = 0;
		foreach($x->childNodes AS $item) {
			$kvp[$i] = new stdClass;
			$kvp[$i]->{$item->nodeName} = $item->nodeValue;
			$i ++;
			if ($item->childNodes) {
				$kvp[$i]->{$item->nodeName} = $kvp[$i]->{$item->nodeName} . "DEEP CHILDNODES!!!";
			}
		}
		
		$this->tester = $kvp;


		fclose($fp);
	}
	public function __toString() {
		return htmlspecialchars(json_encode($this));
	}
}



if ($_SERVER["REQUEST_METHOD"] == "GET" && $_GET["p"]) {
	$post = $_GET["p"];
	echo "./posts/".$post.".wp<br>";
	if (file_exists("./posts/". $post . ".wp")) {
		print new Post("./posts/" . $post . ".wp");
	}

} else {
	echo "Error...";
}
?></body></html>