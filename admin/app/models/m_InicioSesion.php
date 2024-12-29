<?php

    Class M_InicioSesion {

        private $conexion;

        public function __construct() {

            require_once 'app/config/configDb.php';

            $this->conexion = new mysqli(SERVIDOR, USUARIO, PASSWORD, BBDD);
            $this->conexion->set_charset("utf8");
        }

        public function validarInicioSesion($datosIS) {
            
            $correo = $datosIS['email'];
            $passwd = $datosIS['passwd'];

            $sql = 'SELECT * FROM administrador WHERE correo = "'.$correo.'";';

            $resultado = $this->conexion->query($sql);

            if($resultado->num_rows > 0){
            
                $fila = $resultado->fetch_assoc();

                if(password_verify($passwd, $fila['passwd']))
                    return true;

                return false;
            }
            
            return false;

        }
    }
