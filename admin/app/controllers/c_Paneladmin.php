<?php 

Class C_Paneladmin{


  public function __construct(){
    require_once './app/models/m_listarTipos.php';
  }


  public function listarTipos(){

    $objListar = new M_listarTipos();
    $datos = $objListar->tipos();
    header('Content-Type: application/json');
    echo json_encode($datos);

  }
}
