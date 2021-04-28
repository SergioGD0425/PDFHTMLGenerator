<?php

use Illuminate\Support\Facades\Cache;

include('ConvertHTML.php');

ini_set('display_errors',0);
switch ($_SERVER['REQUEST_METHOD']) {
    case 'POST':
        try{

        
            $pdfGenerator = new PDFHTMLGenerator($_POST['params']);

            $pdfGenerator->generarPdfString($_POST);
            $respuesta = [
                'message' => $pdfGenerator->getPDFBase64(),
                'success' => 1
            ];
        }catch( Exception $e){
            $respuesta = [
                'message' => 'Algo ha salido mal',
                'success' => 0
            ];
        }
            echo json_encode($respuesta);

           /* $respuesta = [
                'message' => "Se ha producido un error, revise la documentación del conversor",
                'success' => 0
            ];
            echo json_encode($respuesta);
            */
        break;
    case 'GET':

        break;
}
