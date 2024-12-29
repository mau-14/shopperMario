<?php
    require_once 'app/config/config.php';

    // Si el controlador y el metodo llegan sin valor, el programa envia los datos por defecto
    if(!empty($_GET)) {
        $rutaControlador = 'app/controllers/c_' . $_GET['c'] . '.php';
        require_once $rutaControlador;

        // Ruta del controlador, instancia la clase
        $nombreControlador = 'C_' . $_GET['c'];
        $objControlador = new $nombreControlador();

        $datos = json_decode(file_get_contents("php://input"), true);

        // Si el metodo existe llama al metodo del controlador
        if(method_exists($objControlador, $_GET['m'])) {
            $objControlador->{$_GET['m']}($datos);
        }
    }else{
      require_once 'app/views/v_InicioSesion.html';
    }

    
