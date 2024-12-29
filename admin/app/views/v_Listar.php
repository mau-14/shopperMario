<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Listado de Personajes</title>

        <link rel="stylesheet" href="src\css\style.css">
    </head>
    <body id="vistaListar">
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>URL de la imagen</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <?php 
                    foreach ($personajes as $personaje) {
                        echo '<tr>';
                        echo '<td>' . $personaje['idPersonaje'] . '</td>';
                        echo '<td>' . $personaje['nombre'] . '</td>';
                        echo '<td>' . $personaje['descripcion'] . '</td>';
                        echo '<td>' . $personaje['tipo'] . '</td>';
                        echo '<td>' . $personaje['url'] . '</td>';
                        echo '<td class="action-buttons">';
                        echo '<form action="eliminar.php" method="POST" style="display:inline;">';
                        echo '<input type="hidden" name="idPersonaje" value="' . $personaje['idPersonaje'] . '">';
                        echo '<button type="submit" class="btn btn-eliminar" value="'.$personaje['idPersonaje'].'">Eliminar</button>';
                        echo '</form>';
                        echo '<form action="src/php/views/vistaModificar.php" method="POST" style="display:inline;">';
                        echo '<input type="hidden" name="idPersonaje" value="' . $personaje['idPersonaje'] . '">';
                        echo '<button type="submit" class="btn btn-modificar" value="'.$personaje['idPersonaje'].'">Modificar</button>';
                        echo '</form>';
                        echo '</td>';
                        echo '</tr>';
                    }
                ?>
            </tbody>
        </table>
    </body>
</html>
