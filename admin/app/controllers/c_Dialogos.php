<?php 


class C_Dialogos{

  
  public function __construct()
  {
    require_once './app/models/m_Dialogos.php';
  }

  public function llamada(){

    header('Content-Type: application/json');

    $dialogo = new M_Dialogos();
    $data = $dialogo->obtenerDialogos();

    if($data){
      echo json_encode($data);
    }else{
      echo json_encode(['mensaje' => 'no se encontraron resultados']);
   }

  }
}
