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
            if (isset($dato['nombre'], $dato['descripcion'], $dato['tipo'], $dato['idPersonaje'])) {
                $sqlUpdate = "UPDATE personaje SET nombre = ?, descripcion = ?, tipo = ? WHERE idPersonaje = ?";
                $stmt = $this->prepareStatement($sqlUpdate, "sssi", $dato['nombre'], $dato['descripcion'], $dato['tipo'], $dato['idPersonaje']);
                if ($stmt) {
                    $modificado = true;
                }
            }

            if (!empty($dato['deletedImages'])) {
                foreach ($dato['deletedImages'] as $image) {
                    $sqlDelete = "DELETE FROM imagen WHERE idPersonaje = ? AND nombreArchivo = ?";
                    $stmt = $this->prepareStatement($sqlDelete, "is", $dato['idPersonaje'], $image);
                    if (!$stmt) return false;
                }
                $modificado = true;
            }

            if (!empty($dato['newImages'])) {
                foreach ($dato['newImages'] as $imageName) {
                    $sqlInsert = "INSERT INTO imagen (idPersonaje, nombreArchivo) VALUES (?, ?)";
                    $stmt = $this->prepareStatement($sqlInsert, "is", $dato['idPersonaje'], $imageName);
                    if (!$stmt) return false;
                }
                $modificado = true;
            }

            return $modificado;

        } catch (Throwable $th) {
            error_log('Excepción: ' . $th->getMessage());
            return false;
        }
    }

    public function consultaEliminar($id) {
        if (!empty($id['idPersonaje'])) {
            $sqlDelete = "DELETE FROM personaje WHERE idPersonaje = ?";
            $stmt = $this->prepareStatement($sqlDelete, "i", $id['idPersonaje']);
            return $stmt ? true : false;
        }
        error_log('El idPersonaje no está definido o es vacío.');
        return false;
    }

    public function consultaInsertar($dato) {
        if (!empty($dato['nombre']) && !empty($dato['descripcion'])) {
            try {
                $sqlInsert = "INSERT INTO personaje (nombre, descripcion, tipo) VALUES (?, ?, ?)";
                $stmt = $this->prepareStatement($sqlInsert, "sss", $dato['nombre'], $dato['descripcion'], $dato['tipo']);

                if ($stmt) {
                    $idPersonaje = $this->conexion->insert_id;
                    if ($idPersonaje > 0 && !empty($dato['newImages'])) {
                        foreach ($dato['newImages'] as $imageUrl) {
                            $sqlInsertImages = "INSERT INTO imagen (idPersonaje, nombreArchivo) VALUES (?, ?)";
                            $stmtImage = $this->prepareStatement($sqlInsertImages, "is", $idPersonaje, $imageUrl);
                            if (!$stmtImage) return false;
                        }
                    }
                    return true;
                }
            } catch (Exception $e) {
                error_log($e->getMessage());
                return false;
            }
        }
        error_log('Los datos necesarios no están completos.');
        return false;
    }

  private function prepareStatement($query, $types, ...$params) {
    $stmt = $this->conexion->prepare($query);
    if ($stmt === false) {
        error_log('Error en la preparación de la consulta SQL: ' . $this->conexion->error);
        return false;
    }

    $stmt->bind_param($types, ...$params);

    try {
        $executeResult = $stmt->execute();
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 2014) { // Código de error de MySQL para "Prepared statement needs to be re-prepared"
            $stmt = $this->conexion->prepare($query);
            if ($stmt === false) {
                error_log('Error al volver a preparar la consulta SQL: ' . $this->conexion->error);
                return false;
            }
            $stmt->bind_param($types, ...$params);
            $executeResult = $stmt->execute();
        } else {
            throw $e;
        }
    }

    if (!$executeResult) {
        error_log('Error al ejecutar la consulta SQL: ' . $stmt->error);
        $stmt->close();
        return false;
    }

    $stmt->close();
    return true;
} 
}
