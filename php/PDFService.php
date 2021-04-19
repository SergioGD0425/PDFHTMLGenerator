<?php
include('ConvertHTML.php');

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        $pdfGenerator = new PDFHTMLGenerator($_POST['params']);

        $pdfGenerator->generarPdfString($_POST);
        echo $pdfGenerator->getPDFBase64();
        break;
    case 'GET':

        break;
}
