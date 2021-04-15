<?php
include('ConvertHTML.php');
//$pdfGenerator = new PDFHTMLGenerator();

switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        //$pdfGenerator->generarPdfString($_POST);
        //echo $pdfGenerator->getPDFBase64();
        echo "hola post";
        break;
    case 'GET':

        break;
}

?>