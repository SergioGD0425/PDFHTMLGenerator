import {
    darkThemes,
    brightThemes
} from './ace/themes.js';

var PDF = {
    Init: function () {
        document.getElementById("generarButton").addEventListener("click", PageFunctions.enviarHTML);
        document.getElementById("limpiarButton").addEventListener("click", PageFunctions.limpiarEditor);
        document.getElementById("formatButton").addEventListener("click", PageFunctions.beautifyCode);
        document.getElementById("themeSelect").addEventListener("change", PageFunctions.setNewTheme);
        document.getElementById("fontSizeNum").addEventListener("change", PageFunctions.setNewFontSize);

        document.getElementById("headerButton").addEventListener("click", () => PageFunctions.cambiarContenidoEditor("header"));
        document.getElementById("bodyButton").addEventListener("click", () => PageFunctions.cambiarContenidoEditor("body"));
        document.getElementById("footerButton").addEventListener("click", () => PageFunctions.cambiarContenidoEditor("footer"));
        document.getElementById("deployParams").addEventListener("click", () => PageFunctions.animar("animarParams", this.divParams));
        document.getElementById("deployActions").addEventListener("click", () => PageFunctions.animar("animarActions", this.divActions));
    },
    TextEditor: {
        themeSelect: document.getElementById("themeSelect"),
        sizeSelect: document.getElementById("fontSizeNum"),
    },
    myPDF: document.getElementById("myPDF"),
    divParams: document.getElementById("divParams"),
    divActions: document.getElementById("divActions"),
    divPDF: document.getElementById("divPDF"),
    params: {
        marginTopInput: document.getElementById("marginTopInput"),
        marginBottomInput: document.getElementById("marginBottomInput"),
        marginLeftInput: document.getElementById("marginLeftInput"),
        marginRightInput: document.getElementById("marginRightInput"),
        fontSizeInput: document.getElementById("fontSizeInput"),
        pdfMode: document.getElementById("pdfMode"),
    },
    base64: '',
    pdfParts: {
        headerHTML: "",
        bodyHTML: "",
        footerHTML: "",
        editorActivo: "header",
    }
}


var PageFunctions = {
    animar: function (nombreClase, div) {
        let cross = div.previousElementSibling.firstElementChild.lastElementChild;
        if (div.classList.contains(nombreClase)) {
            div.classList.remove(nombreClase);
            cross.classList.remove("animatedCross");
        } else {
            div.classList.add(nombreClase);
            cross.classList.add("animatedCross");
        }
    },
    limpiarEditor: function () {
        codeEditor.setValue("");
        codeEditor.focus();
    },
    salvarCambios: function () {
        if (PDF.pdfParts.editorActivo == "header") {
            PDF.pdfParts.headerHTML = codeEditor.getValue();
        } else if (PDF.pdfParts.editorActivo == "body") {
            PDF.pdfParts.bodyHTML = codeEditor.getValue();
        } else if (PDF.pdfParts.editorActivo == "footer") {
            PDF.pdfParts.footerHTML = codeEditor.getValue();
        }
    },
    addActiveClass: function (cambioEditor) {
        document.getElementById(cambioEditor + "Button").classList.add("button-active");
        document.getElementById(cambioEditor + "Button").classList.add("bg-red-600");
        document.getElementById(cambioEditor + "Button").classList.add("text-white");
    },
    removeActiveClass: function () {
        if (document.getElementsByClassName("button-active")[0] != undefined) {
            document.getElementsByClassName("button-active")[0].classList.remove("bg-red-600");
            document.getElementsByClassName("button-active")[0].classList.remove("text-white");
            document.getElementsByClassName("button-active")[0].classList.remove("button-active");
        }
    },
    cambiarContenidoEditor: function (cambioEditor) {
        PageFunctions.salvarCambios();
        PageFunctions.removeActiveClass();
        PDF.pdfParts.editorActivo = cambioEditor;
        if (cambioEditor == "header") {
            codeEditor.setValue(PDF.pdfParts.headerHTML, 1);
        } else if (cambioEditor == "body") {
            codeEditor.setValue(PDF.pdfParts.bodyHTML, 1);
        } else if (cambioEditor == "footer") {
            codeEditor.setValue(PDF.pdfParts.footerHTML, 1);
        }
        codeEditor.focus();
        PageFunctions.addActiveClass(cambioEditor);
    },
    loadPDFMobile: function () {
        let pdfWindow = window.open("")
        pdfWindow.document.write(
            "<iframe width='100%' height='100%' src='data:application/pdf;base64, " + PDF.base64 + "'></iframe>"
        )
    },
    enviarHTML: function () {
        PageFunctions.salvarCambios();
        $.ajax({
            type: "POST", // la variable type guarda el tipo de la peticion GET,POST,..
            url: "../php/PDFService.php", //url guarda la ruta hacia donde se hace la peticion
            data: {
                header: PDF.pdfParts.headerHTML,
                body: PDF.pdfParts.bodyHTML,
                footer: PDF.pdfParts.footerHTML,
                params: {
                    marginTop: PDF.params.marginTopInput.value,
                    marginBottom: PDF.params.marginBottomInput.value,
                    marginLeft: PDF.params.marginLeftInput.value,
                    marginRight: PDF.params.marginRightInput.value,
                    fontSize: PDF.params.fontSizeInput.value,
                    mode: PDF.params.pdfMode.value
                }
            }, // data recive un objeto con la informacion que se enviara al servidor
            success: function (datos) { //success es una funcion que se utiliza si el servidor retorna informacion
                datos = JSON.parse(datos);

                PDF.myPDF.src = "data:application/pdf;base64," + datos.message;
                PDF.base64 = datos.message;
                console.log(window.innerWidth);
                if (window.innerWidth<=768) {
                    PageFunctions.loadPDFMobile();
                }
            },
            error: function (jqXHR, status, error) { //función error 
                PageFunctions.createError();
            }
        });
    },
    createError: function () {
        let parentError = document.getElementById("consoleErrors").parentElement;
        if (parentError.classList.contains('hidden')) {
            parentError.classList.remove("hidden");
            PDF.myPDF.classList.remove('border-b-2');
            PDF.myPDF.classList.remove('rounded-b-lg');
        }
        document.getElementById("consoleErrors").appendChild(PageFunctions.crearNodo("label", "Ha habido un error en el formato, consulte la documentación del convertidor", "error"));
    },
    loadTheme: function () {
        if (localStorage.getItem("theme") != null) {
            codeEditor.setTheme("ace/theme/" + localStorage.getItem("theme"));
            PDF.TextEditor.themeSelect.value = localStorage.getItem("theme");

        } else {
            codeEditor.setTheme("ace/theme/eclipse");
        }
    },
    setNewTheme: function () {
        localStorage.setItem("theme", PDF.TextEditor.themeSelect.value);
        codeEditor.setTheme("ace/theme/" + PDF.TextEditor.themeSelect.value);
    },
    setNewFontSize: function () {
        document.getElementById('editor').style.fontSize = PDF.TextEditor.sizeSelect.value + 'px';
    },
    generarThemesSelect: function () {
        PDF.TextEditor.themeSelect.appendChild(PageFunctions.crearNodoOptionGroup("Bright"));
        let opgroup = PDF.TextEditor.themeSelect.lastElementChild;
        brightThemes.forEach(element => {
            opgroup.appendChild(PageFunctions.crearNodoOption(element, PageFunctions.capitalize(PageFunctions.limpiarSeparadores(element))));
        });
        PDF.TextEditor.themeSelect.appendChild(PageFunctions.crearNodoOptionGroup("Dark"));
        opgroup = PDF.TextEditor.themeSelect.lastElementChild;
        darkThemes.forEach(element => {
            opgroup.appendChild(PageFunctions.crearNodoOption(element, PageFunctions.capitalize(PageFunctions.limpiarSeparadores(element))));
        });
    },
    capitalize: function (s) {
        if (typeof s !== 'string') return ''
        return s.charAt(0).toUpperCase() + s.slice(1)
    },
    crearNodoOptionGroup: function (texto) {
        let nodo = document.createElement("optgroup");
        nodo.setAttribute("label", texto);
        return nodo;
    },
    crearNodoOption: function (value, texto) {
        let nodo = document.createElement("option");
        let text = document.createTextNode(texto);

        nodo.appendChild(text);
        nodo.setAttribute("value", value);
        return nodo;
    },
    limpiarSeparadores: function (text) {
        return text.replace("_", " ");
    },
    beautifyCode: function () {
        var beautify = ace.require("ace/ext/beautify"); // get reference to extension
        beautify.beautify(codeEditor.session);
    },
    crearNodo: function (tipoElemento, texto, clase) {
        let nodo = document.createElement(tipoElemento);
        if (texto != undefined) {
            let text = document.createTextNode(texto);
            nodo.appendChild(text);
        }
        if (clase != undefined)
            nodo.className = clase;
        return nodo;
    }
}

PDF.Init();

//document.getElementById("showParams").addEventListener("click", showParams);
//document.getElementById("showPDFMobile").addEventListener("click", loadPDFMobile);

//MARGENES PDF

ace.require("ace/ext/language_tools");
let codeEditor = ace.edit("editor");
let editorLib = {
    init() {
        PageFunctions.loadTheme();
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
PageFunctions.generarThemesSelect();
