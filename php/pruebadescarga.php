<?php
require_once realpath(__DIR__ . '/..') . '\vendor\autoload.php';

$pdf = "<div>
<h1 style='text-align: center;border-bottom:1 solid #000000'>Telegram principal CS</h1>
<table style='border-collapse: collapse;margin-left: auto; margin-right: auto;' border='1 solid #000000'>
    <thead style='vertical-align: top;'>
        <th style='border-right: 0;background-color:grey;'></th>
        <th style='padding-bottom: 20px; padding-top: 5px;'>Contenido</th>
        <th style='padding-bottom: 20px; padding-top: 5px;'>Texto del Post</th>
        <th style='padding-bottom: 20px; padding-top: 5px;'>Imagen</th>
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

$mpdf = new \Mpdf\Mpdf();
$mpdf->WriteHTML($pdf,2);
// $this->pdfString = $this->mpdf->Output('', \Mpdf\Output\Destination::STRING_RETURN);
$mpdf->Output('mipdfbonito.pdf', \Mpdf\Output\Destination::DOWNLOAD);
