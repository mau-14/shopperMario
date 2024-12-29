class M_dashboard{


  async datosDashboard(){


    try {
      const respuesta = await fetch('../../index.php?c=Dashboard&m=llamada')

      const data = await respuesta.json()
      return data
    } catch (error) {

      console.error('Error: ',error)
    }
  }
}


export default M_dashboard
