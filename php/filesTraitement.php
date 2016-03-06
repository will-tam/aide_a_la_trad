<?php
/* Update 23/02/2016 */

function checkNameFormat($fileName)
/*
    Check if the name of a file is in the good format.
    According the listing choice, it has to finish with -Fr.tex or -Jp.tex.
    @Parameters : $fileName = the name of the file to check.
    @Return : true if it's ok, otherwise false.
*/
{
    return (preg_match("/(\-Fr|\-Jp)\.tex$/iu", $fileName)) ? true : false;
}

function findFileBrother($fileName)
/*
    Change the name of the file with '-Fr' for '-Jp' and reciprocally.
    @Parameters : $fileName = the name to change.
    @Return : the new name.
*/
{
    return strtr($fileName, array("-Fr"=>"-Jp", "-Jp"=>"-Fr"));
}

function extractText($fileName)
/*
    Check if the file (always) exists.
    Read the text inside the file.
    @Parameters : $fileName = the name of the file to read if exists (again).
    @Return : The raw text. Or empty if nothing to read.
*/
{
    $theText = "";

    if (file_exists($fileName) && is_file($fileName))
    {
        $theText = file_get_contents($fileName);
        $theText = ($theText === false) ? "" : $theText;

        // Remove the Latex \jp{ } command, and the LF.
        // Don't forget to replace befor saving !!
        if (($theText != "") && preg_match("/(\-Jp)\.tex$/iu", $fileName))
        {
            $theText = ltrim($theText, "\jp{\n");
            $theText = rtrim($theText, "}\n\n\n\n\n\n");    // Don't remove the last \n before }.
        }
    }

    return $theText;
}

function backup($file)
/*
    Rename the name of a file with timestamp.
    @Parameters : $file = the file to backup.
    @Return : true if it's ok, otherwise false.
*/
{
    $r = true;
	if (file_exists($file))
	{
		$r = @copy($file, $file.".".date('YmdHis'));		// The copied file will be with the site rights.
	}

	return $r;
}

function saveTo($file, $wichtText)
/*
    To save the text into the file.
    Check if all has been ok.
    @Parameters : $wichtText = the text to save.
                  $file = the name of the file to save in.
    @Return : true if it's ok, otherwise false.
*/
{
    // the mb_strlen doesn't return the good result !?
    $ok = (strlen($wichtText) === @file_put_contents($file, $wichtText)) ? true : false;

    return $ok;
}
?>