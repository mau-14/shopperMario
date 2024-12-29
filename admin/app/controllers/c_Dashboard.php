<?php 

Class C_Dashboard {



  public function __construct(){
    require_once './app/models/m_dashboard.php';
  }


  public function llamada(){

    $objMPanelControl = new M_dashboard();
    $datos = $objMPanelControl->datosAdmin();
    header('Content-Type: application/json');

    echo json_encode($datos);
  }
}
