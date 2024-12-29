<?php 

Class C_Modificar{
  private $obj;

  public function  __construct()
  {
    require_once './app/models/m_Modificar.php';
    $this->obj = new M_Modificar();

  }

  public function modificar($dato){


    if($this->obj->consultaModificacion($dato)){
      echo json_encode(['success' => '1', "mensaje" => 'modificación ejecutada correctamente']);
    }else{

      echo json_encode(['success' => '0', "mensaje" => 'error en la modificacion']);
    }
  }

  public function borrar($dato){

    if($this->obj->consultaEliminar($dato)){
      echo json_encode(['success' => '1', "mensaje" => 'Borrado ejecutado con éxito']);
    }else{

      echo json_encode(['success' => '0', "mensaje" => 'error en el borrado']);
    }
  }

  public function insertar($dato){
    if($this->obj->consultaInsertar($dato)){
      echo json_encode(['success' => '1', "mensaje" => 'Insertado ejecutado con éxito']);
    }else{

      echo json_encode(['success' => '0', "mensaje" => 'error en el insertado']);
    }
  }
}
