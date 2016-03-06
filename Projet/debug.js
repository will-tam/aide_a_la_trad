/* Utilitaires de debug */

/*
!!!!!
Ne pas oublier en début de page : 
<div style="float: right;">
<textarea id="debug" rows="32" cols="50" readonly="true" onclick="efface_dbg()"></textarea>
</div>
!!!!! 
*/

function dbg(koi, val)
{
    var a_aff = koi + " = " + val;
    var prec = document.getElementById("debug").value;
    if (isNaN(prec.charCodeAt(0)))
        a_aff = a_aff;
    else
        a_aff = prec + '\n' + a_aff;
    document.getElementById("debug").value = a_aff
}

function efface_dbg()
{
    document.getElementById("debug").value = "";
}