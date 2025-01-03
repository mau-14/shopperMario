class C_validarEnemigo {

  constructor(formElement) {
    if (!formElement) {
      throw new Error("El formulario no existe en el DOM.")
    }
    this.formElement = formElement
    this.nombreEnemigo = document.getElementById('nombre')
    this.descripcionEnemigo = document.getElementById('descripcion')
    this.imagenes = document.getElementById('newImages[]')
    this.contenedorImagen = document.createElement('div')
    this.formElement.appendChild(this.contenedorImagen)
    
  }


  validarFormulario() {
    this.limpiarErrores()
    
    
    let valido = true

    // Validación genérica de campos
    valido = this.validarCampo(this.nombreEnemigo, 'El nombre del enemigo es obligatorio') && valido
    valido = this.validarDescripcion(this.descripcionEnemigo) && valido
    valido = this.validarImagenes() && valido

    if (valido) {
      console.log('Formulario valido')
      return true
    }
  }

  validarCampo(campo, mensajeError) {
    if (!campo.value.trim()) {
      this.mostrarError(campo, mensajeError)
      return false
    }
    return true
  }

  validarDescripcion(campo) {
    if (campo.value.trim().length < 10) {
      this.mostrarError(campo, 'La descripción debe tener al menos 10 caracteres')
      return false
    }
    return true
  }


  validarImagenes() {

    if(this.imagenes){
      if (this.imagenes.files.length === 0) {
        return true
      }else{
        return this.validarFormatoImagenes(this.imagenes.files)
      }
    }
  }

  validarFormatoImagenes(files) {
    const formatosPermitidos = ['image/jpeg', 'image/png']
    let valido = true

    Array.from(files).forEach(file => {
      if (!formatosPermitidos.includes(file.type)) {
        valido = false
        if(this.imagenes){

          this.mostrarError(this.imagenes, 'Formato de la imagen no permitido, solo se aceptan JPEG y PNG')
        }
      }
    })

    return valido
  }

  mostrarError(elemento, mensaje) {
    const error = document.createElement('span')
    error.className = 'mensaje-error'
    error.style.color = 'red'
    error.style.fontSize = '0.9em'
    error.textContent = mensaje
    error.style.display = 'block'
    elemento.insertAdjacentElement('afterend', error)
  }

  limpiarErrores() {
    document.querySelectorAll('.mensaje-error').forEach(msg => msg.remove())
  }

  /*mostrarImagen() {
    this.imagenes.addEventListener('change', (event) => {
      const archivos = event.target.files
      if (archivos.length > 0) {
        Array.from(archivos).forEach(archivo => {
          const reader = new FileReader()
            reader.onload = function(e) {
            const img = document.createElement('img')
            img.src = e.target.result
            img.className = 'img-enemigo'
            img.style.maxWidth = '100px'
            img.style.height = 'auto'
            this.contenedorImagen.appendChild(img)  // Asegúrate de tener un contenedor
          }
          reader.readAsDataURL(archivo)
        })
      }
    })
  }*/
}
export default C_validarEnemigo
