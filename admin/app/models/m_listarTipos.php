<?php

    Class M_listarTipos{

        private $conexion;

        public function __construct() {

            require_once 'app/config/configDb.php';

            $this->conexion = new mysqli(SERVIDOR,USUARIO,PASSWORD,BBDD);
            $this->conexion->set_charset("utf8");
            
        }

        public function tipos() {
          try {
               $datos = [];
                
                $queryTipos = 'SELECT tipo, nombre FROM tipos_personaje;' ;
                $result = $this->conexion->query($queryTipos);
                $datos = $result->fetch_all(MYSQLI_ASSOC);

                return $datos;

          } catch (Throwable $th) {
            error_log($th->getMessage());
            $this->destruct();
          }
        }

        public function destruct(){

            $this->conexion->close();
          }
}
