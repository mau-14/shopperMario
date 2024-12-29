<?php
    Class Mregistro {
        private $conexion;

        public function __construct() {
            require_once '../config/configDb.php';

            $this->conexion = new mysqli(SERVIDOR, USUARIO, PASSWORD, BBDD);
            $this->conexion->set_charset("utf8");
            // $controlador = new mysqli_driver();
            // $controlador->report_mode = MYSQLI_REPORT_OFF;
            $texto_error=$this->conexion->errno;
        }

        
    }
?>