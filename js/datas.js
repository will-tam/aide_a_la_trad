/* Update 23/02/2016 */

var datas = {
    infos : {},    /*datas.infos = {
                        fileNameToView : fileNameToView,
                        textToView : textToView,
                        fileNameToEdit : fileNameToEdit,
                        textToEdit : textToEdit
                        };*/
    lfPos : new Array(),            // Position of the '\n' chars.
    textViewArray : new Array(),    // The lines'array where to split the text.
    langUsed : "lfr",           // Used languag at the T time.
    textViewLength : 0,         // The lenght of this array.
    lineIndex : 0,              // Index of line in the lines' array to color.
    oldLineIndex : 0,          // Old index of line in the lines' array. Used to remove color.
    changed : false,            // Text changed in textEdit ?
    //errorPHPRaised : false,        // true = if PHP send an error, otherwise false.

    textToArray : function (which)
    /*
        Split a text inside an array, and save the lenght of this array.
        @Prameters : which = what text to split.
        @Return : none.
    */
    {
        //var i;

        datas.textViewArray = which.split("\n");

        //datas.lfPos.length = 0;     // Quickly empty array.
        datas.textViewLength = datas.textViewArray.length;

        //datas.lfPos[0] = 0;     // Need a start point to compute the '\n' positions. Will be remove at the end.

/*
        var l = datas.textViewArray.length;
        for (i = 0; i < l; i++)
        {
            datas.lfPos.push(datas.textViewArray[i].length + datas.lfPos[i]);
        }
        datas.lfPos.shift();
*/
    }
};
