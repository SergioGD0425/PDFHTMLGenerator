<?php

require_once realpath(__DIR__ . '/..') . '\vendor\autoload.php';

class PDFHTMLGenerator
{

    private $mpdf;
    private $pdfString;

    function __construct()
    {
        $this->mpdf = new \Mpdf\Mpdf([
            'autoPageBreak' => false,
            'margin_top' => 30,
            'margin_bottom' => 20,
            'margin_left' => 16,
            'margin_right' => 14,
            'default_font_size' => 9,
            'default_font' => 'Arial',
            'watermark_font' => 'Arial',
            'watermarkAngle' => 90
        ]);
    }

    function generarPdfString($html)
    {
        $pdf = "<div>
                <h1 style='text-align: center;'>Telegram principal CS</h1>
                <table style='border-collapse: collapse;margin-left: auto; margin-right: auto;' border='1'>
                    <thead style='vertical-align: top;'>
                    <tr>
                        <th style='border-right: 0;background-color:grey;'></th>
                        <th style='padding-bottom: 20px; padding-top: 5px;'>Contenido</th>
                        <th style='padding-bottom: 20px; padding-top: 5px;'>Texto del Post</th>
                        <th style='padding-bottom: 20px; padding-top: 5px;'>Imagen</th>
                        </tr>
                    </thead>
                    <tbody style='padding: 0px; text-align: center;'>
                        <tr style='vertical-align: top;'>
                            <td style='background-color: royalblue;color: white;padding:10px;word-break:break-all;'>2021-04-06
                            </td>
                            <td style='padding:10px;word-break:break-all;'>Presentación Móvil - Día Mundial de la Salud</td>
                            <td style='padding:10px;word-break:break-all;'>#DíaMundialdelaSalud #CírculosVidaSaludable
                                ¿Quieres tener una mejor vida? ¡Adopta los hábitos saludables!
                                ???? Sin #tabaco
                                ???? #Alimentación saludable
                                ???? #ActividadFísica diaria
                                ???? #Alcohol, cuanto menos mejor
                                ???? Control de #estrés/descanso
                                ➡️http://bit.ly/Círculos_Vida_Saludable</td>
                            <td style='padding:10px;word-break:break-all;'><img style='height: auto; width: 250px;' src='nada'>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
        
        </html>";
        $this->mpdf->SetHTMLHeader($html['header'],true);
        $this->mpdf->SetHTMLFooter($html['footer']);
        $this->mpdf->WriteHTML($html['body']);
        //$this->mpdf->AddPage('','','','b','off');
        
        $this->pdfString = $this->mpdf->Output('', \Mpdf\Output\Destination::STRING_RETURN);
        //$this->mpdf->Output('factura.pdf', \Mpdf\Output\Destination::FILE);
    }
    function getPDFString()
    {
        return $this->pdfString;
    }
    function getPDFBase64(){
        return base64_encode($this->pdfString);
    }
}
