<?php

    Class C_panelcontrol {

        private $objMPanelControl;
        public $mensajeEstado;
        public $vista;

        public function __construct(){
            require_once 'app/models/m_PanelControl.php';
            $this->objMPanelControl = new M_PanelControl();
        }

        /* ------------------------------- METODO POR DEFECTO ------------------------------- */
        public function inicio() {
            $this->vista = 'PanelAdmin.php';
        }

        /* ------------------------------- CRUD DE PERSONAJES ------------------------------- */
        public function c_AltaPersonaje($datosPersonaje) {

            $estado = $this->vDatosPersonaje($datosPersonaje);

            if($estado) {

                $nombre = $datosPersonaje['nombre'];
                $descripcion = $datosPersonaje['descripcion'];
                $tipo = $datosPersonaje['tipo'];
                $urlImagen = $datosPersonaje['url'];
                
                $idPersonaje = $this->objMPanelControl->mAltaPersonaje($nombre, $descripcion, $tipo);
            } else {
                return false;
            }
            
            if($idPersonaje) {
                $estado = $this->objMPanelControl->mAltaImagen($idPersonaje, $urlImagen);
                $this->vista = 'Alta.php';
            } else {
                $this->vista = 'Error.php';
                return false;
            }

            return $estado;
        }
        public function cEliminarPersonaje($idPersonaje) {
            
            if(!empty($idPersonaje)) {
                $estado = $this->objMPanelControl->mEliminarPersonaje($idPersonaje);
                return $estado;
            }
            
            return false;
        }
        public function cModificarPersonaje($datosPersonaje) {

            $estado = $this->vDatosPersonaje($datosPersonaje);

            if($estado) {
                $idPersonaje = $datosPersonaje['idPersonaje'];
                $nombre = $datosPersonaje['nombre'];
                $descripcion = $datosPersonaje['descripcion'];
                $tipo = $datosPersonaje['tipo'];
                $urlImagen = $datosPersonaje['url'];

                $estado = $this->objMPanelControl->mModificarPersonaje($idPersonaje, $nombre, $descripcion, $tipo, $urlImagen);

                if($estado)
                    $this->vista = 'PanelAdmin.php';
                else 
                    $this->vista = 'Error.php';
            }
            return false;
        }
        public function cListarPersonajes() {
            
            $personajes = $this->objMPanelControl->mListarPersonajes();
            
            return $personajes;
        }

        /* ------------------------------- VALIDACION DE DATOS PERSONAJES ------------------------------- */
        public function vDatosPersonaje($datosPersonaje) {
            if (empty($datosPersonaje['nombre'])) {
                $this->mensajeEstado = 'No se ha rellenado el nombre';
                return false;
            }
    
            if (empty($datosPersonaje['descripcion'])) {
                $this->mensajeEstado = 'No se ha rellenado la descripción';
                return false;
            }
    
            if (empty($datosPersonaje['imagen'])) {
                $this->mensajeEstado = 'No se ha añadido la URL de la imagen';
                return false;
            }

            if (!isset($datosPersonaje['tipo'])) {
                $this->mensajeEstado = 'No se ha añadido tipo de personaje';
                return false;
            }
    
            return true;
        }
        /* ------------------------------- FIN VALIDACION DE DATOS PERSONAJES ------------------------------- */


        /* ------------------------------- CRUD DE NPC ------------------------------- */
        public function c_AltaNPC ($datosNPC) {

            $estado = $this->vDatosNPC($datosNPC);
            
            $this->objMPanelControl->mAltaNPC($datosNPC);

            if($estado) {

                $nombre = $datosNPC['nombre'];
                $descripcion = $datosNPC['descripcion'];
                $tipo = 'N';
                $urlImagen = $datosNPC['url'];
                
                $idNPC = $this->objMPanelControl->mAltaPersonaje($nombre, $descripcion, $tipo);
            } else {
                return false;
            }
            
            if(!$idNPC) {
                $this->vista = 'Error.php';
                return false;
            } else {
                $this->objMPanelControl->mAltaImagen($idNPC, $urlImagen);
                return true;
            }
        }
        public function c_ModificarNPC ($datosNPC) {

            $estado = $this->vDatosNPC($datosNPC);

            if($estado) {

                $idNPC = $datosNPC['idPersonaje'];
                $nombre = $datosNPC['nombre'];
                $descripcion = $datosNPC['descripcion'];
                $tipo = 'N';
                $urlImagen = $datosNPC['url'];

                $estado = $this->objMPanelControl->mModificarPersonaje($idNPC, $nombre, $descripcion, $tipo, $urlImagen);


            } else {
                return false;
            }

            
        }
        public function c_EliminarNPC ($idNPC) {
            
            $estado = $this->objMPanelControl->mEliminarPersonaje($idNPC);

            if($estado) {
                $this->vista = 'PanelAdmin.php';
            } else {
                $this->vista = 'Error.php';
            }
        }
        public function c_ListarNPC () {
            
            $datos = $this->objMPanelControl->mListarNPC();
        }
        /* ------------------------------- VALIDACION DE DATOS PERSONAJES ------------------------------- */
        public function vDatosNPC($datosNPC) {
            if (empty($datosNPC['nombre'])) {
                $this->mensajeEstado = 'No se ha rellenado el nombre';
                return false;
            }
    
            if (empty($datosNPC['descripcion'])) {
                $this->mensajeEstado = 'No se ha rellenado la descripción';
                return false;
            }
    
            if (empty($datosNPC['imagen'])) {
                $this->mensajeEstado = 'No se ha añadido la URL de la imagen';
                return false;
            }

            if (!isset($datosNPC['tipo'])) {
                $this->mensajeEstado = 'No se ha añadido tipo de personaje';
                return false;
            }
    
            return true;
        }
        /* ------------------------------- FIN VALIDACION DE DATOS PERSONAJES ------------------------------- */


        /* ------------------------------- CRUD DE DIALOGO ------------------------------- */
        public function c_AltaDialogo ($datosDialogo) {

            $estado = $this->vDatosDialogo($datosDialogo);

            if($estado) {

                $mensaje = $datosDialogo['mensaje'];

                $estado = $this->objMPanelControl->mAltaDialogo($mensaje);
            }
        }
        public function c_ModificarDialogo ($datosDialogo) {

            $estado = $this->vDatosDialogo($datosDialogo);

            if($estado){

                $idDialogo = $datosDialogo['idDialogo']; 
                $mensaje = $datosDialogo['mensaje']; 

                $estado = $this->objMPanelControl->mModificarDialogo($idDialogo, $mensaje);

                if($estado)
                    return true;
                else
                    return false;
            }
            else
                return false;

        }
        public function c_EliminarDialogo ($idDialogo) {
            
            $estado = $this->objMPanelControl->mEliminarDialogo($idDialogo);

            if($estado){
                $this->vista = 'Modificar.php';
                return true;
            } else {   
                $this->vista = 'Error.php';
                return false;
            }
        }
        public function c_ListarDialogo () {
            
            $datos = $this->objMPanelControl->mListarDialogo();

            if(is_array($datos)){
                $this->vista = 'Listar.php';
            } else {
                $this->vista = 'Error.php';
            }

        }
        public function vDatosDialogo($datosDialogo) {

            if(!empty($datosDialogo['mensaje']))
                return false;
        }
    }
?>
