/* Update 23/02/2016 */

var actionsOnEvents = {     // The space name of events actions.
    // Need to know the instances name to interact with.
    view : null,
    ajax : null,

    newFile : function(evt)
    /*
        Called by clicking the "new" button.
        Show the list of files names.
        Check if something changed alert popup an alert about it.
        @Parameters : evt = the event called it-self.
        @Return : none.
    */
    {
        if (datas.changed)      // datas.changed => true if any changes in textarea (see main.js).
        {
            alert("Données changées !\nVeuillez sauver d'abord.");
        }
        else
        {
            this.view.toggleChooseFilesTo("show");
        }
        evt.preventDefault();
    },

    hideFilesList : function(evt)
    /*
        Called by typing a key in the body document.
        Hide the list of the files.
        @Parameters : evt = the event called it-self.
        @Return : none.
    */
    {
        if (evt.keyCode === 0x1b)
        {
            this.view.toggleChooseFilesTo("hide");
        }
    },

    //changeLang : function(evt)
    /*
        Called if "lang" button is clicked.
        Change the language of the interface and messages.
        @Parameters : evt = the event called it-self.
        @Return : none.
    */
/*
    {
    	alert("TODO - Changement de langue");
        evt.preventDefault();
    },
*/
    saveFile : function(evt)
    /*
        Called by clicking the "save" button.
        Send the datas to PHP trhough AJAX to save the files.
        @Parameters : evt = the event called it-self.
        @Return : none.
    */
    {
        var datasToSend = new FormData();       // Prepare a form like to send at PHP

        datasToSend.append("file1", this.view.fileTextView.innerHTML);
        datasToSend.append("file2", this.view.fileTextEdit.innerHTML);

        // Remove the unecessary tags. TODO - To see in one line.
        var textFromTextView = this.view.textView.innerHTML;
        textFromTextView = textFromTextView.replace(/<\/?br>/gi, "\n");
        textFromTextView = textFromTextView.replace(/<\/?span>/gi, "");
        textFromTextView = textFromTextView.replace(/<span\s.*>/gi, "");

        datasToSend.append("toFile1", textFromTextView);
        datasToSend.append("toFile2", this.view.textEdit.value);

        // Send to PHP.
        this.ajax.request("post", ["file", datasToSend], null, null);
        evt.preventDefault();
    },

    switchText : function(evt)
    /*
        Called by clicking "change" button.
        Switch the both texts.
        @Parameters : evt = the event called it-self.
        @Return : none.
    */
    {
        var swap = datas.infos.fileNameToView;
        datas.infos.fileNameToView = datas.infos.fileNameToEdit;
        datas.infos.fileNameToEdit = swap;

        datas.infos.textToEdit = datas.infos.textToView;
        datas.infos.textToView = this.view.getTextEdit();

        this.view.setTextView(datas.infos.fileNameToView, datas.infos.textToView);
        this.view.setTextEdit(datas.infos.fileNameToEdit, datas.infos.textToEdit);
        evt.preventDefault();
    },

    synchronize : function(evt)
    /*
        Called at click or moving carret by arrows keys.
        Find the current line where is carret in textEdit
        and ask to underline the same line in textView.
        @Parameters : evt = the event called it-self.
        @Return : none.
    */
    {
        if ((evt.type === "click") ||
           (evt.keyCode === 0x25) ||    // Left.
           (evt.keyCode === 0x26) ||    // Top.
           (evt.keyCode === 0x27) ||    // Right.
           (evt.keyCode === 0x28) ||    // Down.
           (evt.keyCode === 0x0d))      // Both enters.
        {
            var l;
            var cPos = textEdit.selectionStart;   // This is enough to find carret position.

            datas.lfPos.length = 0;     // Quickly empty array.

            var regEx = /\n/gm;
            var result;

            while ((result = regEx.exec(this.view.textEdit.value)) !== null)
            {
                datas.lfPos.push(result.index);
            }

            l = datas.lfPos.length;
            //datas.lineIndex = l >> 1;     // Will use for dichotomy on BIG text. For small one ...

            datas.lineIndex = 0;

            while (cPos > datas.lfPos[datas.lineIndex])
            {
                datas.lineIndex++;
            }
            this.view.textViewColor(datas.oldLineIndex, datas.lineIndex);
            datas.oldLineIndex = datas.lineIndex;
        }
    },

    liClick : function(evt)
    /*
        Called if the li of a file is clicked.
        Hide the files names list.
        Call PHP through AJAX to read the choosed file and its "brother".
        They will be display by view.
        Goes to the top of the main windows
        @Parameters : evt = the event called it-self.
        @Return : none.
    */
    {
        this.view.toggleChooseFilesTo("hide");
        evt.preventDefault();
        // We just give the name of the file to edit. The second will be deducted by the name of the first (see php/filesTraitement.php);
        this.ajax.request("get", ["file", evt.target.id], this.view, this.view.setJSONText, this.view.phpErrorDisplay);
        window.scrollTo(0, 0);  // Return at (0, 0).
    }
};