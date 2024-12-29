class M_dialogos{

  async datosDialogos(){

    try {
      const respuesta = await fetch('./index.php?c=Dialogos&m=llamada')
      const data =  await respuesta.json()
      console.log(data)
      return data
    } catch (error) {
      console.log('Error', error)
    }
  }
}

export default M_dialogos
