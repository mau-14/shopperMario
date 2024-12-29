<?php
    Class Cregistro {

        private $objMregistro;
        public $vista;

        public function __construct() {
            require_once 'src/php/models/Mregistro.php';
            $this->objMregistro = new Mregistro();
        }

        public function cDefecto() {
            $this->vista = 'views/paginaPrincipal'; // Esto que lo cambie el que tenga servidor
        }
    }
?>