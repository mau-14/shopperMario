class M_subirImagenes {

  // Método para subir una imagen
  async uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    console.log(formData)

    try {
      const response = await fetch('../../app/controllers/c_subirImagen.php', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json()
      console.log(data)
      return data
    } catch (error) {
      console.error('Error: ', error);
    }
  }
}

export default M_subirImagenes;
