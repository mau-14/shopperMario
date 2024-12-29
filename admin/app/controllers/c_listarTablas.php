<?php 

Class C_listarTablas{

  public function  __construct()
  {
    require_once './app/models/m_listarTablas.php';
    
  }

  public function listarTipos($dato){
        
    $obj = new M_listarTablas();
    $personajes =  $obj->obtenerTablas($dato);
    
    if($personajes){
        echo json_encode($personajes);
    }else{
        echo json_encode(['mensaje' => 'no se encontraron resultados']);
      }
    }

}
