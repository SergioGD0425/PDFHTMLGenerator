<?php

require('../vendor/autoload.php');
include('Library.php');

class PDFHTMLGenerator
{

    private $library;

    function __construct($params)
    {
        $this->library = new Library($params);
    }

    function getPDFString($html)
    {
        return $this->library->generarPdfString($html);
    }
}
