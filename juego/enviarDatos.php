<?php
$host = 'esvirgua.com';  
$dbname = 'user2daw_BD1-23';  
$username = 'user2daw_23';  
$password = 'm!?4+N1N&qU2';  

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Error de conexión: " . $e->getMessage();
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

$nickname = isset($data['name']) ? strtoupper($data['name']) : 'AN'; 
$gameTime = isset($data['gameTime']) ? $data['gameTime'] : 0;
$score = isset($data['score']) ? $data['score'] : 0;
$idJugador = 1; 

$hours = floor($gameTime / 3600);
$minutes = floor(($gameTime % 3600) / 60);
$seconds = $gameTime % 60;
$duration = sprintf("%02d:%02d:%02d", $hours, $minutes, $seconds);

$fechaHora = date('Y-m-d H:i:s');

$sql = "INSERT INTO partida (duracion, fechaHora, nickname, puntuacion, idJugador) 
        VALUES (:duracion, :fechaHora, :nickname, :puntuacion, :idJugador)";

$stmt = $pdo->prepare($sql);
$stmt->bindParam(':duracion', $duration);
$stmt->bindParam(':fechaHora', $fechaHora);
$stmt->bindParam(':nickname', $nickname);
$stmt->bindParam(':puntuacion', $score);
$stmt->bindParam(':idJugador', $idJugador);

if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Datos guardados correctamente']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Error al guardar los datos']);
}

