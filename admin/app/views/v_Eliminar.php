<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmar Eliminación</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            text-align: center;
        }
        .btn {
            padding: 10px 20px;
            margin: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .btn-confirmar {
            background-color: #d9534f;
            color: white;
        }
        .btn-cancelar {
            background-color: #007bff;
            color: white;
        }
    </style>
</head>
<body>
    <h2>¿Estás seguro de que quieres eliminar este personaje?</h2>
    <form action="eliminar.php" method="POST">
        <input type="hidden" name="idPersonaje" value="<?php $idPersonaje ?>">
        <button type="submit" name="confirmar" class="btn btn-confirmar">Confirmar</button>
        <a href="listar.php" class="btn btn-cancelar">Cancelar</a>
    </form>
</body>
</html>
