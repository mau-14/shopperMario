import M_login from '../modelo/m_login.js'

class C_login {
  constructor(data) {
    this.data = data
    this.email = data.email
    this.passwd = data.passwd
  }

  async validarInicioSesion(formulario) {
    const modeloLogin = new M_login(this.data)

    try {
      const respuesta = await modeloLogin.login()

      if (respuesta.success === 1) {
        window.location.href = './app/views/v_panelAdmin.html'
      } else {
          const existingError = formulario.querySelector('.error-message')
          if (existingError) {
            existingError.remove()
          }
            const error = document.createElement('h2')
            error.classList.add('error-message')
            error.innerHTML = respuesta.mensaje || 'Usuario o contraseña incorrectos'
            formulario.append(error)
      }
    } catch (error) {
      console.error('Error al intentar iniciar sesión', error)
    }
  }
}

export default C_login
