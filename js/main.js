(function () {
/* Update 23/02/2016 */

// As used bind() function, have to check if it's ok. To see to write the polyfill if need.
if (!Function.prototype.bind)
{
    var info = "Pas de fonction <cite>bind()</cite> présente. Navigateur ";
    info += "<b><cite>" + navigator.userAgent +"</cite></b>";
    info += " trop vieux ?<br>Regardez la compatibilité ici : ";
    info += "<a href='https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function/bind#Compatibilit%C3%A9_des_navigateurs' target='_blanck'>";
    info += "https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function/bind#Compatibilit%C3%A9_des_navigateurs</a>";
    document.getElementsByTagName("body")[0].innerHTML = info;

    return false;
}

var ajax = new AJAX();
var view = new View();

if (ajax.xhr)    // AJAX ok ?
{
    actionsOnEvents.ajax = ajax;
    actionsOnEvents.view = view;

/*
    actionsOnEvents.liClick.bind(actionsOnEvents),
*/
    view.newBtn.addEventListener("click", actionsOnEvents.newFile.bind(actionsOnEvents), false);
    //view.langSelect.addEventListener("change", actionsOnEvents.changeLang.bind(actionsOnEvents), false);
    view.saveBtn.addEventListener("click", actionsOnEvents.saveFile.bind(actionsOnEvents), false);
    view.changeBtn.addEventListener("click", actionsOnEvents.switchText.bind(actionsOnEvents), false);
    view.textEdit.addEventListener("click", actionsOnEvents.synchronize.bind(actionsOnEvents), false);
    view.textEdit.addEventListener("keyup", actionsOnEvents.synchronize.bind(actionsOnEvents), false);
    view.textEdit.addEventListener("change", function () {datas.changed = true}, false);    // Only that.

    document.body.addEventListener("keydown", actionsOnEvents.hideFilesList.bind(actionsOnEvents), false);

    ajax.request("get", ["filesList"], view, view.displayFilesList);  // First run, asking of the files list.

    //ajax.request("get", ["file", "prout.txt"], view.displayFilesList);
    //ajax.request("get", ["file"], view.displayFilesList);
    //ajax.request("get", ["nimp"], view.displayFilesList);

    //ajax.request("post", ["file", "f0.tex"], view.getTextView, view.displayFilesList);
    //ajax.request("post", ["file", "f1.tex"], view.getTextEdit, view.displayFilesList);

    textEdit.focus();
}
else    // AJAX nok.
{
    view.ajaxError();
}
})();