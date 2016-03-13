(function () {
/* Update 13/03/2016 */

languages.changeTo(); // Init the language with the navigator one.

//languages.changeTo("jp"); // Force to the Japanese.
//languages.changeTo("fr"); // Force to the French.

// As used bind() function, have to check if it's ok. To see to write the polyfill if need.
if (!Function.prototype.bind)
{
    var info = languages.trans("info");
    //info = '<img src="gfx/up_down.svg" width="24px" height="24px" alt="">';
    document.getElementsByTagName("body")[0].innerHTML = info;

    return false;
}

var ajax = new AJAX();
var view = new View();

view.translateAll();

if (ajax.xhr)    // AJAX ok ?
{
    actionsOnEvents.ajax = ajax;
    actionsOnEvents.view = view;

    view.version.innerHTML = "ver : " + VER;

    view.newBtn.addEventListener("click", actionsOnEvents.newFile.bind(actionsOnEvents), false);
    view.langSelect.addEventListener("change", actionsOnEvents.changeLang.bind(actionsOnEvents), false);
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