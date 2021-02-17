<?php
//Credit to frank@huddler.com and the helpful commenters at https://www.php.net/manual/en/function.imagecreatefromgif.php
//For most of this solution (slight modification has been made)

function frame_count($filename) {
    if(!($fh = @fopen($filename, 'rb')))
        return false;
    $count = 0;
    //an animated gif contains multiple "frames", with each frame having a
    //header made up of:
    // * a static 4-byte sequence (\x00\x21\xF9\x04)
    // * 4 variable bytes
    // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)
   
    // We read through the file til we reach the end of the file, checking for headers as we go
    while(!feof($fh) {

        $chunk = fread($fh, 1024 * 100 ) ; //read 100kb at a time
        $count += preg_match_all('#\x00\x21\xF9\x04.{4}\x00(\x2C|\x21)#s', $chunk, $matches);
   }
   
    fclose($fh);
    return $count;
}
function is_ani($filename) {
    framecount_less_than($filename, 1)
}
function framecount_less_than($filename, $max) {
  function is_ani($filename) {
    if(!($fh = @fopen($filename, 'rb')))
        return false;
    $count = 0;
    //an animated gif contains multiple "frames", with each frame having a
    //header made up of:
    // * a static 4-byte sequence (\x00\x21\xF9\x04)
    // * 4 variable bytes
    // * a static 2-byte sequence (\x00\x2C) (some variants may use \x00\x21 ?)
   
    // We read through the file til we reach the end of the file, or we've found
    // at least 2 frame headers
    while(!feof($fh) && $count < $max+1) {
        $chunk = fread($fh, 1024 * 100); //read 100kb at a time
        $count += preg_match_all('#\x00\x21\xF9\x04.{4}\x00(\x2C|\x21)#s', $chunk, $matches);
   }
   
    fclose($fh);
    return $count > $max;
}
}
?>
