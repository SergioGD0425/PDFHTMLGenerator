<?php

require('../vendor/autoload.php');


class Library
{

    private $mode;
    private $conversor;

    function __construct($params)
    {
        $this->mode = $params['mode'];

        switch($this->mode){
            case 'mpdf':
                $this->conversor = new \Mpdf\Mpdf([
                    'autoPageBreak' => false,
                    'margin_top' => $params['marginTop'],
                    'margin_bottom' => $params['marginBottom'],
                    'margin_left' => $params['marginLeft'],
                    'margin_right' => $params['marginRight'],
                    'default_font_size' => $params['fontSize'],
                    'default_font' => 'Arial',
                    'watermark_font' => 'Arial',
                    'watermarkAngle' => 90
                ]);
                break;
            case 'yetiforce': 
                $this->conversor = (new YetiForcePDF\Document())->init();
                $this->conversor->setDefaultBottomMargin($params['marginBottom']);
                $this->conversor->setDefaultTopMargin($params['marginTop']);
                $this->conversor->setDefaultLeftMargin($params['marginLeft']);
                $this->conversor->setDefaultRightMargin($params['marginRight']);
                break;
        }
    }

    function generarPdfString($html)
    {     
        switch($this->mode){
            case 'mpdf':
                $this->conversor->SetHTMLHeader($html['header'], true);
                $this->conversor->SetHTMLFooter($html['footer']);
                $this->conversor->WriteHTML($html['body']);

                return $this->conversor->Output('', \Mpdf\Output\Destination::STRING_RETURN);
                break;
            case 'yetiforce': 

                $header = "<div data-header>". $html['header']."</div>";
                $footer = "<div data-footer>". $html['footer']."</div>";

                $this->conversor->loadHtml($header.$html['body'].$footer);
                return $this->conversor->render();

                break;
        }          
    }

}