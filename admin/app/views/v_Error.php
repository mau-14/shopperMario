<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SHOPPER MARIO</title>

        <!-- ESTILOS E ICONOS -->
        <link rel="shortcut icon" href="img/iconoRedondo.png" type="image/x-icon">
        <link rel="stylesheet" href="css/style.css">
    </head>
    <body>
        <main>
            <button id="volver" onclick='window.location.href="index.php"'>Volver</button>
            <div class="tabla">
                <div class="container">
                        <?php 
                            $mensaje = $datos;
                            echo '<p>$mensaje</p>'; 
                        ?>
                </div>
            </div>
        </main>
    </body>
</html>