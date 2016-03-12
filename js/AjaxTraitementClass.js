/* Update 23/02/2016 */

function AJAX()
/*
    Class AJAX : in charge to check and to manage all AJAX using system.
    @Parameters Contructor : none.
*/
{
    this.xhr = false;   // Suppose No AJAX supported.

    // Is AJAX is present in this broswer ? This is an anywhere findable snippet
	if (window.XMLHttpRequest || window.ActiveXObject)
	{
		if (window.ActiveXObject)
		{
			try
			{
				this.xhr = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e)
			{
				this.xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		}
		else
		{
			this.xhr = new XMLHttpRequest();
		}
	}
}

// AJAX.prototype.request = function(way, commands, thisArg, callback, callbackDBG)
AJAX.prototype.request = function(way, commands, thisArg, callback)
/*
    All AJAX requests are executed by this function. It runs a callback with result.
    @Parameters : way = 'get' -> to ask something (see commands) to the PHP script.
                        'post' -> to send something (see commands) to the PHP script.
                  commands = this formated array:
                             ["command", (optionnal)"argument"]
                             command = filesList -> with 'get' ONLY, ask the list of files in Projet directory.
                                       file -> with 'get', read the file asked in argument.
                                               with 'post', send the file.
                             argument = with 'file' command, the file name.
                  thisArg = which environnement to use to answer. (It's really clear that ??)
                  callback = function to execute with the result ('get'),
                             function to get the text to send to save ('post').
                  // callbackDBG = function to execute to debug. Must be null in prod.
    @Return : 'false' if something wrong.
*/
{
    var allowedCommands = ["filesList", "file"];    // 'get' commands always at first.

    var datasToSend;

    var way = way.toUpperCase();

    var command = commands[0];
    var argu = commands[1];

    var URI = "php/main.php";

    if ((way === "GET") && (allowedCommands.indexOf(command) > -1))
    {
        this.xhr.onreadystatechange = function ()
        {
            if (this.readyState == 4)
            {
                if (this.status === 200)
                {
                    if (callback)
                    {
                        callback.call(thisArg, this.responseText);  // Should be usefull to debug something.
                    }
                    else
                    {
                        alert(languages.trans("ajaxReqAnswerGET"));
                    }
                }
                else
                {
                    alert(languages.trans("ajaxReqStatusGET") + this.status + " - " + this.statusText);
                }
            }
        };

        if (command === "filesList")
        {
            URI = URI + "?cde=" + command;
        }
        else if ((command === "file") && (typeof argu === "undefined"))
        {
            alert(languages.trans("ajaxReqNoArgGET"));
            return false;
        }
        else
        {
            URI = URI + "?cde=" + command + "&arg=" + argu;
        }
    }
    else if ((way === "POST") && (allowedCommands.indexOf(command, 1) > -1))
    {
        this.xhr.onreadystatechange = function ()
        {
            if (this.readyState == 4)
            {
                if (this.status === 200)
                {
                    if (callback)
                    {
                        callback.call(thisArg, this.responseText);  // Should be usefull to debug something.
                    }
                    alert(languages.trans("savedFiles"));
                    datas.changed = false;
                }
                else
                {
                    alert(languages.trans("ajaxReqStatusNoSavedPOST") + this.status + " - " + this.statusText);
                }
            }
/*
    	        switch(this.status)
    	        {
    	    	   case 200:  // It's ok, we return the parse of the questions.
                        if (callback)
                        {
                            callback.call(thisArg, this.responseText);
                        }
    	                break;
    	            case 404:   // main.php file not found, we return False.
                        alert("Class AJAX.request POST - Traitement impossible !");
                        //datas.errorPHPRaised = true;
    	                break;
    	            default:
    	                alert("Class AJAX.request POST - statut " + this.status + " reçu !!! " + this.statusText);
    	                //datas.errorPHPRaised = true;
    	                break;
    	        }
            }
*/
        };
        if ((command === "file") && (typeof argu === "undefined"))
        {
            alert(languages.trans("ajaxReqNoArgPOST"));
            return false;
        }
        else
        {
            datasToSend = argu;
            datasToSend.append("cde", command);     // To be sure of the right command will be send to PHP.
        }
    }
    else
    {
        alert(languages.trans("ajaxReq") + way + "\n" + command);
        return false;
    }

    this.xhr.open(way, URI);
    this.xhr.send(datasToSend);
}