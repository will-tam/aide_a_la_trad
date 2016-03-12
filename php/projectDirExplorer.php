<?php
/* Update 23/02/2016 */

define("TOPREP", "..".DIRECTORY_SEPARATOR."Projet");

function scanRFromDir($fromDir, &$dirList)
/*
    scanRFromDir() : scan a directory.
    @Parameters : $fromDir = directory from start.
                  &$dirList = the array to build with files list as val, directories as keys.
    @Return : none. The real return is in the $dirList array.
*/
{
    @$files = scandir($fromDir);    // The errors or warning are hidden.

    if(is_array($files))        // Is it really an array of file names ?
    {
        $files = array_diff($files, array(".", ".."));  // Not need these !!

        foreach($files as $file)
        {
            if(is_dir($fromDir.DIRECTORY_SEPARATOR.$file))
            {
                scanRFromDir($fromDir.DIRECTORY_SEPARATOR.$file, $dirList);
            }
            else
            {
                if (preg_match("/(\-Fr|\-Jp)\.tex$/iu", $file) && (is_writable($fromDir)))
                {
                    if (is_writable($fromDir.DIRECTORY_SEPARATOR.$file))
                    {
                        $dirList[substr($fromDir, 2)][] = $file;
                    }
                }
            }
        }
    }

    if ($dirList)
    {
        ksort($dirList);
    }
}

function makeFileList()
/*
    Build the list with the directories and files in Projet directory.
    @Parameters : none.
    @Return : the builded list.
*/
{
    // <ul firstTime='true'> will be used to know if it's a renew of the list.
    $htmlList = "<div class='title' id='title'>Choisissez le fichier à traduire (ESC pour fermer)</div>\n<ul firsttime='true'>\n";    // Begin of list.
    scanRFromDir(TOPREP, $projetList);

    if (is_array($projetList))
    {
        foreach($projetList as $dir=>$files)
        {
            $htmlList .= "<li>".$dir."</li><ul>";
            foreach($files as $file)
            {
                $htmlList .= "<li id='..".$dir.DIRECTORY_SEPARATOR.$file."'>".$file."</li>";
            }
            $htmlList .= "</ul>";
        }
        $htmlList .= "</ul>";   // End of list.
    }
    else
    {
        $htmlList = "<div class='title'>Pas de répertoire <span class='onError'>Projet</span> trouvé !</div>";    // Begin of list.
    }

    return $htmlList;
}
?>