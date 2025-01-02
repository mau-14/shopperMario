class M_login{

  constructor(data){
    this.data = data
  }


  async login(){

    try{
      const respuesta = await fetch('/SHOPPERMARIO/admin/index.php?c=InicioSesion&m=validarInicioSesion',{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(this.data)
      })

      if(!respuesta.ok){
        throw new Error('Error en la respuesta del servidor')
      }

      const respuestaJson = await respuesta.json()
      return respuestaJson

    }catch(error){
      return { success: false, error: 'Ocurrió un problema al intentar iniciar sesión. Intenta de nuevo más tarde.' }
    }
  }
}


export default M_login
