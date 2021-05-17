<?php

include('ConvertHTML.php');

ini_set('display_errors',0);
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        try{
            $pdfGenerator = new PDFHTMLGenerator($_POST['params']);  
            $respuesta = [
                'message' => base64_encode($pdfGenerator->getPDFString($_POST)),
                'success' => 1
            ];
        }catch( Exception $e){
            $respuesta = [
                'message' => 'Algo ha salido mal',
                'success' => 0
            ];
        }
            echo json_encode($respuesta);
        break;
    case 'GET':

        break;
}
