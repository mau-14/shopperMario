<?php
    Class C_InicioSesion {
        private $objMInicioSesion;

        public function __construct() {
            require_once 'app/models/m_InicioSesion.php';
            $this->objMInicioSesion = new M_InicioSesion();
        }

        public function inicio (){
            $this->vista = 'InicioSesion.html';
        }
        
        public function validarInicioSesion($datosIS) {
            ob_clean();
            header('Content-Type: application/json');
            if(!empty($datosIS['email']) && !empty($datosIS['passwd'])){
                $estado = $this->objMInicioSesion->validarInicioSesion($datosIS);

                if($estado) {
                  echo json_encode(['success' => 1, 'mensaje'=>'Éxito en el inicio de sesión','vista'=>'PanelAdmin.php']);
                }
                else {
                  echo json_encode(['success' => 0, 'mensaje'=>'Error al iniciar sesion bobo', 'vista'=>'Error.php']);
                }
                
            }else{
                  echo json_encode(['success' => 0, 'mensaje'=>'Rellenalo bien hazme el favor', 'vista'=>'Error.php']);
            }
        }
    }
