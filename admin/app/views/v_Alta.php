<!DOCTYPE html>
<html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Alta de Personaje</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
                background-color: #f4f4f4;
                color: #333;
            }

            h2 {
                text-align: center;
                color: #007BFF;
            }

            .form-container {
                width: 50%;
                margin: 0 auto;
                padding: 20px;
                background-color: white;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }

            label {
                display: block;
                margin-bottom: 8px;
                font-weight: bold; 
            }

            input[type="text"],
            textarea,
            select {
                width: 100%;
                padding: 12px;
                margin: 12px 0;
                border-radius: 5px;
                border: 1px solid #ddd;
                box-sizing: border-box;
                resize: none;
            }

            .btn {
                display: block;
                width: 250px;
                margin: 20px auto;
                padding: 12px;
                background-color: #007BFF;
                color: white;
                text-align: center;
                cursor: pointer;
                border: none;
                border-radius: 5px;
                font-size: 16px;
            }

            .form-container select {
                font-size: 14px;
            }
        </style>
    </head>
    <body>

        <h2>Alta de Personaje</h2>

        <div class="form-container">
            <form action="../../../alta.php" method="POST">
                <label for="nombre">Nombre del Personaje:</label>
                <input type="text" id="nombre" name="nombre">

                <label for="descripcion">Descripción del Personaje:</label>
                <textarea id="descripcion" name="descripcion" rows="4" ></textarea>

                <label for="tipo">Tipo de Personaje:</label>
                <select id="tipo" name="tipo">
                    <option disabled selected>Selecciona un tipo de personaje</option>
                    <option value="J">Jugador</option>
                    <option value="E">Enemigo</option>
                    <option value="N">NPC</option>
                </select>

                <label for="imagen">URL de la Imagen:</label>
                <input type="text" id="imagen" name="imagen">

                <button type="submit" class="btn">Agregar Personaje</button>
            </form>
        </div>

    </body>
</html>
