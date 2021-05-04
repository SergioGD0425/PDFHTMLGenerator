import {
    darkThemes,
    brightThemes
} from './ace/themes.js';

document.getElementById("generarButton").addEventListener("click", enviarHTML);
document.getElementById("limpiarButton").addEventListener("click", limpiarEditor);
document.getElementById("formatButton").addEventListener("click", beautifyCode);
document.getElementById("themeSelect").addEventListener("change", setNewTheme);
document.getElementById("fontSizeNum").addEventListener("change", setNewFontSize);

document.getElementById("headerButton").addEventListener("click", () => cambiarContenidoEditor("header"));
document.getElementById("bodyButton").addEventListener("click", () => cambiarContenidoEditor("body"));
document.getElementById("footerButton").addEventListener("click", () => cambiarContenidoEditor("footer"));

document.getElementById("showParams").addEventListener("click", showParams);


let themeSelect = document.getElementById("themeSelect");
let sizeSelect = document.getElementById("fontSizeNum");
let myPDF = document.getElementById("myPDF");

//MARGENES PDF
let divPDF = document.getElementById("divPDF");

let marginTopInput = document.getElementById("marginTopInput");
let marginBottomInput = document.getElementById("marginBottomInput");
let marginLeftInput = document.getElementById("marginLeftInput");
let marginRightInput = document.getElementById("marginRightInput");
let fontSizeInput = document.getElementById("fontSizeInput");
let pdfMode = document.getElementById("pdfMode");
let showPDFMobile = document.getElementById("showPDFMobile");


let headerHTML = "";
let bodyHTML = "";
let footerHTML = "";
let editorActivo = "header";

ace.require("ace/ext/language_tools");
let codeEditor = ace.edit("editor");
let editorLib = {
    init() {
        loadTheme();
        codeEditor.session.setMode("ace/mode/html");
        codeEditor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
    }
}
document.getElementById('editor').style.fontSize = '12px';


editorLib.init();
codeEditor.resize();
generarThemesSelect();
//cargarCookies();
loadTheme();

function showParams() {
    if (divPDF.classList.contains("hidden")) {
        divPDF.classList.remove("hidden");
    } else {
        divPDF.classList.add("hidden");
    }
}

function limpiarEditor() {
    codeEditor.setValue("");
    codeEditor.focus();
}

function salvarCambios() {
    if (editorActivo == "header") {
        headerHTML = codeEditor.getValue();
    } else if (editorActivo == "body") {
        bodyHTML = codeEditor.getValue();
    } else if (editorActivo == "footer") {
        footerHTML = codeEditor.getValue();
    }
}

function addActiveClass(cambioEditor) {
    document.getElementById(cambioEditor + "Button").classList.add("button-active");
    document.getElementById(cambioEditor + "Button").classList.add("bg-red-600");
    document.getElementById(cambioEditor + "Button").classList.add("text-white");

}

function removeActiveClass() {
    if (document.getElementsByClassName("button-active")[0] != undefined) {
        document.getElementsByClassName("button-active")[0].classList.remove("bg-red-600");
        document.getElementsByClassName("button-active")[0].classList.remove("text-white"); 
        document.getElementsByClassName("button-active")[0].classList.remove("button-active");
    }
}


function cambiarContenidoEditor(cambioEditor) {
    salvarCambios();
    removeActiveClass();
    editorActivo = cambioEditor;
    if (cambioEditor == "header") {
        codeEditor.setValue(headerHTML, 1);
    } else if (cambioEditor == "body") {
        codeEditor.setValue(bodyHTML, 1);
    } else if (cambioEditor == "footer") {
        codeEditor.setValue(footerHTML, 1);
    }
    codeEditor.focus();
    addActiveClass(cambioEditor);
}

function cargarCookies() {
    if (getCookie("header") != null) {
        //headerHTML = getCookie("header");
        codeEditor.setValue(headerHTML);
    }
    if (getCookie("body") != null) {
        bodyHTML = getCookie("body");
    }
    if (getCookie("footer") != null) {
        footerHTML = getCookie("footer");
    }
    codeEditor.focus();
}

function enviarHTML() {
    salvarCambios();
    //setCookie("header", headerHTML, 1);
    //setCookie("body", bodyHTML, 1);
    //setCookie("footer", footerHTML, 1);
    $.ajax({
        type: "POST", // la variable type guarda el tipo de la peticion GET,POST,..
        url: "../php/PDFService.php", //url guarda la ruta hacia donde se hace la peticion
        data: {
            header: headerHTML,
            body: bodyHTML,
            footer: footerHTML,
            params: {
                marginTop: marginTopInput.value,
                marginBottom: marginBottomInput.value,
                marginLeft: marginLeftInput.value,
                marginRight: marginRightInput.value,
                fontSize: fontSizeInput.value,
                mode: pdfMode.value
            }
        }, // data recive un objeto con la informacion que se enviara al servidor
        success: function (datos) { //success es una funcion que se utiliza si el servidor retorna informacion
            datos = JSON.parse(datos);

            myPDF.src = "data:application/pdf;base64," + datos.message;
            showPDFMobile.href = "data:application/pdf;base64," + datos.message;
            

        },
        error: function (jqXHR, status, error) { //función error 
            createError();
        }
    });
}

function createError() {
    document.getElementById("consoleErrors").appendChild(crearNodo("label", "Ha habido un error en el formato, consulte la documentación del convertidor", "error"));
}

function loadTheme() {
    if (localStorage.getItem("theme") != null) {
        codeEditor.setTheme("ace/theme/" + localStorage.getItem("theme"));
        themeSelect.value = localStorage.getItem("theme");

    } else {
        codeEditor.setTheme("ace/theme/eclipse");
    }
}

function setNewTheme() {
    localStorage.setItem("theme", themeSelect.value);
    codeEditor.setTheme("ace/theme/" + themeSelect.value);
}

function setNewFontSize() {
    document.getElementById('editor').style.fontSize = sizeSelect.value + 'px';
}

function generarThemesSelect() {
    themeSelect.appendChild(crearNodoOptionGroup("Bright"));
    let opgroup = themeSelect.lastElementChild;
    brightThemes.forEach(element => {
        opgroup.appendChild(crearNodoOption(element, capitalize(limpiarSeparadores(element))));
    });
    themeSelect.appendChild(crearNodoOptionGroup("Dark"));
    opgroup = themeSelect.lastElementChild;
    darkThemes.forEach(element => {
        opgroup.appendChild(crearNodoOption(element, capitalize(limpiarSeparadores(element))));
    });
}

function capitalize(s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
}

function crearNodoOptionGroup(texto) {
    let nodo = document.createElement("optgroup");
    nodo.setAttribute("label", texto);
    return nodo;
}


function crearNodoOption(value, texto) {
    let nodo = document.createElement("option");
    let text = document.createTextNode(texto);

    nodo.appendChild(text);
    nodo.setAttribute("value", value);
    return nodo;
}

function limpiarSeparadores(text) {
    return text.replace("_", " ");
}

function beautifyCode() {
    var beautify = ace.require("ace/ext/beautify"); // get reference to extension
    beautify.beautify(codeEditor.session);
}


function setCookie(nombre, value, dias) {
    var expdate = new Date();
    expdate.setTime(expdate.getTime() + 10000000);
    document.cookie = nombre + "=" + encodeURIComponent(value) + "; expires=" + expdate.toUTCString();
}

function getCookie(nombre) {
    var index = document.cookie.indexOf(nombre + "=");
    if (index == -1)
        return null;
    index = document.cookie.indexOf("=", index) + 1;
    var endstr = document.cookie.indexOf(";", index);
    if (endstr == -1)
        endstr = document.cookie.length;
    return decodeURIComponent(document.cookie.substring(index, endstr));
}

function crearNodo(tipoElemento, texto, clase) {
    let nodo = document.createElement(tipoElemento);
    if (texto != undefined) {
        let text = document.createTextNode(texto);
        nodo.appendChild(text);
    }
    if (clase != undefined)
        nodo.className = clase;
    return nodo;
}