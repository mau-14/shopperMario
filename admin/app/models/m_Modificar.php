<?php 

class M_Modificar {

    private $conexion;

    public function __construct() {
        require_once 'app/config/configDb.php';
        $this->conexion = new mysqli(SERVIDOR, USUARIO, PASSWORD, BBDD);
        
        if ($this->conexion->connect_error) {
            error_log('Error de conexión: ' . $this->conexion->connect_error);
            throw new Exception('No se pudo conectar a la base de datos.');
        }

        $this->conexion->set_charset("utf8");
    }

    public function consultaModificacion($dato) {
        $modificado = false;

        try {
            // Paso 1: Actualizar los datos del personaje
            if (isset($dato['nombre']) || isset($dato['descripcion']) || isset($dato['tipo'])) {
                $sqlUpdate = "UPDATE personaje SET nombre = ?, descripcion = ?, tipo = ? WHERE idPersonaje = ?";
                $stmt = $this->conexion->prepare($sqlUpdate);
                
                if ($stmt === false) {
                    error_log('Error en la preparación de la consulta SQL: ' . $this->conexion->error);
                    return false;
                }

                $stmt->bind_param("sssi", $dato['nombre'], $dato['descripcion'], $dato['tipo'], $dato['idPersonaje']);
                $executeResult = $stmt->execute();
                if (!$executeResult) {
                    error_log('Error al ejecutar la consulta SQL para actualizar: ' . $stmt->error);
                    return false;
                }
                $stmt->close();
            }

            // Paso 2: Eliminar las imágenes marcadas para eliminación
            if (isset($dato['deletedImages'])) {
                $deletedImages = $dato['deletedImages'];
                foreach ($deletedImages as $image) {
                    $sqlDelete = "DELETE FROM imagen WHERE idPersonaje = ? AND nombreArchivo= ?";
                    $stmt = $this->conexion->prepare($sqlDelete);
                    if ($stmt === false) {
                        error_log('Error en la preparación de la consulta SQL para eliminar imagen: ' . $this->conexion->error);
                        return false;
                    }

                    $stmt->bind_param("is", $dato['idPersonaje'], $image);
                    $executeResult = $stmt->execute();
                    if (!$executeResult) {
                        error_log('Error al ejecutar la consulta SQL para eliminar imagen: ' . $stmt->error);
                        return false;
                    }
                    $stmt->close();
                }
                $modificado = true;
            }

            // Paso 3: Subir las nuevas imágenes
           if (isset($dato['newImages']) && count($dato['newImages']) > 0) {
    foreach ($dato['newImages'] as $imageName) {
        if (!empty($imageName)) {
            // Aquí puedes insertar las nuevas imágenes en la base de datos
            $sqlInsert = "INSERT INTO imagen (idPersonaje, nombreArchivo) VALUES (?, ?)";
            $stmt = $this->conexion->prepare($sqlInsert);
            if ($stmt === false) {
                error_log('Error en la preparación de la consulta SQL para insertar imagen: ' . $this->conexion->error);
                return false;
            }
            
            $stmt->bind_param("is", $dato['idPersonaje'], $imageName);
            $executeResult = $stmt->execute();
            if (!$executeResult) {
                error_log('Error al ejecutar la consulta SQL para insertar imagen: ' . $stmt->error);
                return false;
            }
            $stmt->close();
        } else {
            // Si el nombre de la imagen es vacío, loguear un error
            error_log('Nombre de imagen vacio, no se puede insertar');
            return false;
        }
    }
    $modificado = true;
} 
            return $modificado;

        } catch (Throwable $th) {
            error_log('Excepcion: ' . $th->getMessage());
            return false;
        }
    }


    public function consultaEliminar($id){
      if (isset($id) && !empty($id)) {
        $sqlDelete = "DELETE FROM personaje WHERE idPersonaje = ?";
        
        $stmt = $this->conexion->prepare($sqlDelete);
        
        if ($stmt === false) {
            error_log('Error al preparar la consulta SQL: ' . $this->conexion->error);
            return false;
        }
        
        $stmt->bind_param("i", $id['idPersonaje']); // 'i' es para entero
        
        $executeResult = $stmt->execute();
        
        if (!$executeResult) {
            error_log('Error al ejecutar la consulta SQL: ' . $stmt->error);
            return false;
        }
        
        $stmt->close();
        
        return true;
    } else {
        error_log('El idPersonaje no está definido o es vacío.');
        return false;
    }
    }


public function consultaInsertar($dato) {
    // Verificar que los datos necesarios están presentes
    if (isset($dato['nombre']) && !empty($dato['nombre']) && isset($dato['descripcion']) && !empty($dato['descripcion'])) {
        
        // Iniciar una transacción para garantizar que ambas inserciones se realicen correctamente

        try {
            // Insertar en la tabla personaje
            $sqlInsert = "INSERT INTO personaje (nombre, descripcion, tipo) VALUES (?, ?, ?)";
            $stmt = $this->conexion->prepare($sqlInsert);

            if ($stmt === false) {
                throw new Exception('Error al preparar la consulta SQL: ' . $this->conexion->error);
            }

            // 's' para string en los parámetros de la consulta
            $stmt->bind_param("sss", $dato['nombre'], $dato['descripcion'], $dato['tipo']);

            $executeResult = $stmt->execute();

            if (!$executeResult) {
                $this->conexion->rollback();
                throw new Exception('Error al ejecutar la consulta SQL de personaje: ' . $stmt->error);
            }

            // Obtener el ID del personaje recién insertado
            $idPersonaje = $this->conexion->insert_id;
            if ($idPersonaje <= 0) {
                $this->conexion->rollback();
                throw new Exception('No se pudo obtener el ID del personaje insertado. ID: ' . $idPersonaje);
            }

            // Ahora insertar las imágenes asociadas (si las hay)
            if (isset($dato['newImages']) && !empty($dato['newImages'])) {
                $sqlInsertImages = "INSERT INTO imagen (idPersonaje, nombreArchivo) VALUES (?, ?)";
                $stmtImage = $this->conexion->prepare($sqlInsertImages);

                if ($stmtImage === false) {
                    $this->conexion->rollback();
                    throw new Exception('Error al preparar la consulta SQL para imágenes: ' . $this->conexion->error);
                }

                // Iterar sobre las imágenes y guardarlas en la base de datos
                foreach ($dato['newImages'] as $imageUrl) {
                    $stmtImage->bind_param("is", $idPersonaje, $imageUrl); // 'i' para el ID del personaje, 's' para la URL
                    $executeImageResult = $stmtImage->execute();

                    if (!$executeImageResult) {
                        $this->conexion->rollback();
                        throw new Exception('Error al insertar la imagen: ' . $stmtImage->error);
                    }
                }
                
                $stmtImage->close();
            }

            // Confirmar la transacción solo si todo ha ido bien

            // Cerrar el stmt de personaje
            $stmt->close();

            return true;

        } catch (Exception $e) {
            // En caso de error, revertir la transacción
            error_log($e->getMessage());
            return false;
        }
    } else {
        error_log('Los datos necesarios no están completos.');
        return false;
    }
} 
}
