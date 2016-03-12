/* Update 23/02/2016 */

function View()
/*
    Class View : in charge to display or to change elements on HTML view.
    @Parameters Contructor : none.
*/
{
    // Get the text elements id.
    this.version = document.getElementById("version");
    this.title = document.getElementById("title");
    this.fileTextView = document.getElementById("fileTextView");
    this.textView = document.getElementById("textView");
    this.fileTextEdit = document.getElementById("fileTextEdit");
    this.textEdit = document.getElementById("textEdit");
    this.newBtn = document.getElementById("new");
    this.langSelect = document.getElementById("langSelect");
    this.saveBtn = document.getElementById("save");
    this.changeBtn = document.getElementById("change");

    this.chooseFiles = document.getElementById("chooseFiles");

    this.liFiles = document.getElementsByTagName("li");
}

View.prototype.ajaxError = function()
/*
    Display an error formated message in textView element if there is AJAX init error.
    Clean up textEdit element.
    @Prameters : none.
    @Return : none.
*/
{
    this.textView.className = "onError textView";
    this.textView.innerHTML = languages.trans("ajaxErr");
    this.textEdit.innerHTML = "";
}

View.prototype.translateAll = function ()
/*
    Display an error formated message in textView element if there is AJAX init error.
    Clean up textEdit element.
    @Prameters : none.
    @Return : none.
*/
{
    this.newBtn.innerHTML = languages.trans("btnNew");
    this.saveBtn.innerHTML = languages.trans("btnSave");
    this.langSelect.value = languages.used;
}

View.prototype.toggleChooseFilesTo = function (state)
/*
    Toggle the chooseFiles DIV element according a choice.
    @Prameters : state = "hide" -> hide the chooseFiles DIV.
                         something else -> show the chooseFiles DIV
    @Return : none.
*/
{
    this.chooseFiles.className = (state === "hide") ? "chooseFiles hidden" : "chooseFiles shown";
}

View.prototype.getTextView = function ()
/*
    Pick up the text in the DIV element textView
    @Prameters : none.
    @Return : the text inside.
*/
{
    return this.textView.innerHTML;
}

View.prototype.textViewColor = function (oldNumLine, newNumLine)
/*
    Add the underline class corresponding at the line in translation in textEdit.
    @Prameters : oldNumLine = the number of the line to remove color.
                 newNumLine = the number of the line to colorize.
    @Return : none.
*/
{
    var oldSpan = this.textView.childNodes[oldNumLine << 1];
    var newSpan = this.textView.childNodes[newNumLine << 1];
    oldSpan.className = "";
    newSpan.className = "underline";
    this.textView.scrollTop = newSpan.offsetTop - this.textView.offsetTop;  // Auto-scroll to the at position.
}

View.prototype.setTextView = function (fileName, textToView)
/*
    Set the name of the file and the text in the DIV element textView.
    Prevent the Cross-site scripting (XSS) attack, so possibility to have some balises inside
    a real text.
    @Prameters : fileName = the name of the file.
                 textToView = the text to internally transform and to display.
    @Return : none.
*/
{
    var span;    // Will receive the futur <span>.

    // Replace the name of file. Only one child node, the [0].
    this.fileTextView.replaceChild(document.createTextNode(fileName),
                                   this.fileTextView.childNodes[0]);

    /*
    Split the string inside an array of lines.
    Could add a text with HTML tags inside, without XSS attack interpretaion or deletion.
    */
    this.textView.innerHTML = "";   // No datas from outside.

    datas.textToArray(textToView);

    for (var i = 0; i < datas.textViewLength; i++)
    {
        span = document.createElement("span");
        span.appendChild(document.createTextNode(datas.textViewArray[i]));
        this.textView.appendChild(span);
        this.textView.appendChild(document.createElement("br"));    // Can't use an external variable. If not, move the "br" node, not create one !!
    }
    this.textView.scrollTop = 0;    // Go at the top.
}

View.prototype.getTextEdit = function ()
/*
    Pick up the text in the tetxtarea element textEdit
    @Prameters : none.
    @Return : the text inside.
*/
{
    return this.textEdit.value;
}

View.prototype.setTextEdit = function (fileName, textToEdit)
/*
    Set the name of the file and the text in the the tetxtarea element textEdit.
    @Prameters : fileName = the name of the file.
                 textToEdit = the text to internally transform and to display.
    @Return : none.
*/
{
    // Replace the name of file. Only one child node, the [0].
    this.fileTextEdit.replaceChild(document.createTextNode(fileName),
                                   this.fileTextEdit.childNodes[0]);

    this.textEdit.value = textToEdit;
    this.textEdit.scrollTop = 0;    // Go at the top.
}

View.prototype.setJSONText = function (jsonDatas)
/*
    Just the common acces point to display after the datas have been received from PHP, via AJAX.
    @Prameters : jsonDatas = the datas under JSON format to display.
    @Return : none.
*/
{
    datas.infos = JSON.parse(jsonDatas);

    this.setTextView(datas.infos.fileNameToView, datas.infos.textToView);
    this.setTextEdit(datas.infos.fileNameToEdit, datas.infos.textToEdit);
}

View.prototype.displayFilesList = function(listOfFiles)
/*
    Change the chooseFiles DIV element to show the list of files.
    @Prameters : listOfFiles = an already building builded "ul/li" list to display.
    @Return : none.
*/
{
    var i, liFile;   // Used in loop.

    this.chooseFiles.innerHTML = listOfFiles;
    this.toggleChooseFilesTo("show");

    if (document.getElementsByTagName("ul")[0].getAttribute("firsttime") === "true")
    {
        // First time for using this list.
        document.getElementsByTagName("ul")[0].setAttribute("firsttime", "false"); // Prevent to do twice.
        this.liFiles = document.getElementsByTagName("li");

        for (i = 0; liFile = this.liFiles[i]; i++)
        {
            if (liFile.id.length > 0)
            {
                liFile.addEventListener("click",
                                                 actionsOnEvents.liClick.bind(actionsOnEvents),
                                                 /*
                                                 function (evt)
                                                 {
                                                    //sendOnClick.call(saveContext, evt)   // Instead of bind, to be ok with old versions.
                                                 },*/
                                                 false);
            }
        }
    }
}