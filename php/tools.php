<?php
/* Update 23/02/2016 */

function sendError($which)
/*
    Send in the simplest way a formated error from PHP scripts to client.
    @Parameters : $which = what to write as error.
    @Return : none.
*/
{
    header($_SERVER["SERVER_PROTOCOL"]." 600 ".$which);
    exit(1);
}

function jsonEncodeUTF8($toEncode)
/*
    Cause my grand-pa PHP didn't have the JSON_UNESCAPED_UNICODE.
    This was found in "http://php.net/manual/fr/function.json-encode.php"
    at " devilan (at) o2 (dot) pl" comment. Thanks to him. Great.
    @Parameters : $toEncode = the array with the elements to encode in UTF-8.
    @Return : the array with the elements in UTF-8 encoding.
*/
{
    array_walk($toEncode,
               function (&$item, $key) {
                   if (is_string($item))
                   {
                       $item = mb_encode_numericentity($item, array (0x80, 0xffff, 0, 0xffff), 'UTF-8');
                   }
               });
    return mb_decode_numericentity(json_encode($toEncode), array (0x80, 0xffff, 0, 0xffff), 'UTF-8');
}

function removeWinCR($text)
/*
    Remove the Window$ CR (0x0d) which is added in JS FormData().
    @Parameters : $text = the text to reform.
    @Return : the new text.
*/
{
    return preg_replace("/\r\n/", "\n", rtrim($text));
}

function japanese($text)
/*
    Add the \jp{} LaTex tag to the text.
    @Parameters : $text = the text in which add the tag.
    @Return : the new text.
*/
{
    return "\jp{\n".removeWinCR($text)."\n}";
}
?>