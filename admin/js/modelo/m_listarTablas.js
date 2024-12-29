class M_listarTablas{


  async listar(valorSelect){


    try {


      const response =  await fetch('../../index.php?c=listarTablas&m=listarTipos',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({valor: valorSelect})
      })

      const data =  await response.json()
      return data
      

    } catch (error) {
      console.error(error)
    }
  }
}


export default M_listarTablas
