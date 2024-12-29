<?php

    Class M_listarTablas{

        private $conexion;

        public function __construct() {

            require_once 'app/config/configDb.php';

            $this->conexion = new mysqli(SERVIDOR,USUARIO,PASSWORD,BBDD);
            
            if ($this->conexion->connect_error) {
                error_log('Error de conexión: ' . $this->conexion->connect_error);
                throw new Exception('No se pudo conectar a la base de datos.');
            }

            $this->conexion->set_charset("utf8");
            
        }

        public function obtenerTablas($dato) {

          try {
             $sql = 'SELECT 
                    personaje.idPersonaje, 
                    personaje.nombre, 
                    personaje.descripcion, 
                    personaje.tipo, 
                    GROUP_CONCAT(imagen.nombreArchivo) AS urls
                FROM personaje 
                LEFT JOIN imagen ON personaje.idPersonaje = imagen.idPersonaje 
                WHERE personaje.tipo = ?
                GROUP BY personaje.idPersonaje'; 
        
          $stmt = $this->conexion->prepare($sql);
          $stmt->bind_param('s',$dato['valor']);

          $stmt->execute();
        $resultado = $stmt->get_result();

          if ($resultado->num_rows > 0) {

              $personajes = $resultado->fetch_all(MYSQLI_ASSOC);

              return $personajes;

            } else {
                return false;
            }
          } catch (Throwable $th) {
            
            error_log($th->getMessage());
            return false;
          }
        }
}
