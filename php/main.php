<?php
/* Update 23/02/2016 */

/*
    Main part.
    Call the right includes and the right functions according to command in
    the global $_GET or $_POST.
    Otherwise, send an error message.
*/

require_once "tools.php";

if (!empty($_GET))
{
    $cde = (!empty($_GET["cde"])) ? $_GET["cde"] : "";
    switch($cde)
    {
        case "filesList":
            require_once "projectDirExplorer.php";
            echo makeFileList();    // Return the list to the client.
            break;
        case "file":
            require_once "filesTraitement.php";
            // (Paranoia Xtreme mode) because something always could happen during the transfer on a network.
            $fileNameToEdit = (!empty($_GET["arg"])) ? $_GET["arg"] : "";

            // The name of a file has to finish with -Fr.tex or -Jp.tex according the listing choice.
            // And usefull for the next !!!
            if (!checkNameFormat($fileNameToEdit))
            {
                sendError("Le nom du fichier n'est pas au bon format !");
            }

            $fileNameToEdit = findFileBrother($fileNameToEdit);
            $fileNameToView = findFileBrother($fileNameToEdit);

            $textToEdit = extractText($fileNameToEdit);
            $textToView = extractText($fileNameToView);

            $return = array("fileNameToView"=>ltrim($fileNameToView, "."),
                            "textToView"=>$textToView,
                            "fileNameToEdit"=>ltrim($fileNameToEdit, "."),
                            "textToEdit"=>$textToEdit
                            );

            // Cause my grand-pa PHP didn't have the JSON_UNESCAPED_UNICODE constante defined.
            if (!defined("JSON_UNESCAPED_UNICODE"))
            {
                echo (jsonEncodeUTF8($return));
            }
            else
            {
                echo (json_encode($return, JSON_UNESCAPED_UNICODE));
            }
            break;
        default:
            sendError("La commande a disparue !!");
            break;
    }
}
else if(!empty($_POST))
{
    require_once "filesTraitement.php";

    $cde = (!empty($_POST["cde"])) ? $_POST["cde"] : "";
    $file1 = (!empty($_POST["file1"])) ? "..".$_POST["file1"] : "";
    $file2 = (!empty($_POST["file2"])) ? "..".$_POST["file2"] : "";
    $textToFile1 = (!empty($_POST["toFile1"])) ? $_POST["toFile1"] : "";
    $textToFile2 = (!empty($_POST["toFile2"])) ? $_POST["toFile2"] : "";

    if (($cde === "file") &&
        ($file1) &&
        ($file2))
    {
        // $files1 is the Japanese text?
        if ((strpos($file1, "-Jp") !== false))
        {
            $fileJp = $file1;
            $textToFileJp = $textToFile1;
            $fileFr = $file2;
            $textToFileFr = $textToFile2;
        }
        else // No, so it's $file2.
        {
            $fileFr = $file1;
            $textToFileFr = $textToFile1;
            $fileJp = $file2;
            $textToFileJp = $textToFile2;
        }

        // No need anymore of the generics variables.
        unset($file1, $file2, $textToFile1, $textToFile2);

        if ((!backup($fileFr)) ||
            (!backup($fileJp)))
        {
            sendError("Backup des fichiers impossible !!");
        }

        if ((!saveTo($fileFr, removeWinCR($textToFileFr))) ||
            (!saveTo($fileJp, japanese($textToFileJp))))
        {
            sendError("Pourquoi la sauvegarde est devenue impossible ici ?");
        }
    }
    else
    {
        // The generic variables are existed yet. TODO - See to change that !!! Cacaberkberk !!
        if (!in_array($cde, array("filesList", "file")))
        {
            sendError("La commande disparue ou incorrecte !!");
        }
        if (!$file1)
        {
            sendError("Le nom du 1er fichier a disparu !!");
        }
        if (!$file2)
        {
            sendError("Le nom du 2nd fichier a disparu !!");
        }
    }
}
else
{
    sendError("Je n'ai pas compris ce que je devais faire !!");
}
?>