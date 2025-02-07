import C_login from './controllers/c_login.js'
import C_validarEnemigo from './controllers/c_validarEnemigo.js'
import C_dashboard from './controllers/c_dashboard.js'
import C_entidades from './controllers/c_entidades.js'
import C_dialogos from './controllers/c_dialogos.js'

window.addEventListener('DOMContentLoaded', () => {



  /*--------------------- PÁGINA INICIO DE SESIÓN --------------------- */

    const loginForm = document.getElementById('loginForm')

  if(loginForm){

    loginForm.addEventListener('submit', function(event) {
          event.preventDefault()
          const formData = new FormData(loginForm)
          const data = Object.fromEntries(formData.entries())
          const login = new C_login(data)
          login.validarInicioSesion(loginForm)
      })

      const checkbox = document.getElementById('showPasswd')
      const passwd = document.getElementById('passwd')

      const visibilidadPassword = () => {
          passwd.type = checkbox.checked ? 'text' : 'password';
      }

      visibilidadPassword() // Para por si se recarga la página con el check pulsado
      checkbox.addEventListener('click', visibilidadPassword)

  }

  /*--------------------- PANEL ADMIN -------------------- */

 let isLoading = false;

const panelAdmin = document.getElementById('mostrarDatosPanelAdmin');
if (panelAdmin) {
  const botonDashboard = document.getElementById('dashboard');
  if (botonDashboard) {
    botonDashboard.addEventListener('click', () => {
      if (isLoading) return; // Evita sobrescribir si ya está cargando
      isLoading = true;
      panelAdmin.innerHTML = '<h3>Cargando Dashboard...</h3>';
      const dashboard = new C_dashboard(panelAdmin);
      dashboard.cargarDatos().finally(() => {
        isLoading = false; // Libera la bandera cuando termine
      });
    });
  }

  const botonEntidades = document.getElementById('entidades');
  if (botonEntidades) {
    botonEntidades.addEventListener('click', () => {
      if (isLoading) return;
      isLoading = true;
      panelAdmin.innerHTML = '<h3>Cargando...</h3>';
      const entidades = new C_entidades(panelAdmin);
      entidades.crearSelect().finally(() => {
        isLoading = false;
      });
    });
  }

  const botonDialogos = document.getElementById('dialogos');
  if (botonDialogos) {
    botonDialogos.addEventListener('click', () => {
      if (isLoading) return;
      isLoading = true;
      panelAdmin.innerHTML = 'Cargando Diálogos...';
      const dialogos = new C_dialogos(panelAdmin);
      dialogos.cargarDatos().finally(() => {
        isLoading = false;
      });
    });
  }
} 
})
