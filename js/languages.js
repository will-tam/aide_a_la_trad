/* Update 13/03/2016 */

var languages = {
    available : {"fr" : msgFR,  //@ of msgFR
                 "jp" : msgJP //@ of msgJP
                },

    used : null,
    trans : null,

    changeTo : function (lang)
    /*
        Change the language of the site.
        @Parameters : lang = the language for translation.
        @Return : none.
    */
    {
        if (lang)
        {
            this.used = lang;
        }
        else
        {
            this.used = navigator.language;
        }
        this.trans = i18n.create(this.available[this.used]);
    },
};