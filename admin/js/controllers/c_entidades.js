import M_entidades from "../modelo/m_entidades.js"
import M_listarTareas from "../modelo/m_listarTablas.js"
import C_validarEnemigo from './c_validarEnemigo.js'
import M_modificar from '../modelo/m_modificar.js'
import M_subirImagenes from "../modelo/m_subirImagen.js"

class C_entidades {

  constructor(panelAdmin) {
    this.panelAdmin = panelAdmin
    this.contenedorTabla = document.createElement('div')
    this.contenedorTabla.id = 'contenedorTabla'
  }

async crearSelect() {
  const fragment = document.createDocumentFragment()

  // Crear y configurar el select
  const selectEntidades = document.createElement('select')
  selectEntidades.id = 'select-entidades'

  const defaultOption = document.createElement('option')
  defaultOption.value = ''
  defaultOption.textContent = 'Elige'
  defaultOption.disabled = true
  defaultOption.selected = true

  selectEntidades.appendChild(defaultOption)

  // Obtener datos y llenar el select
  const entidades = new M_entidades()
  const data = await entidades.datosDashboard()

  if (!data || data.length === 0) {
    console.error("No hay datos disponibles.")
    return
  }

  data.forEach(item => {
    const option = this.createOption(item.tipo, item.nombre)
    selectEntidades.appendChild(option)
  })

  // Crear botón de insertar
  const insertarButton = document.createElement('button')
  insertarButton.id = 'insertar-btn'
  insertarButton.classList.add('btn', 'btn-insertar')
  insertarButton.textContent = 'Insertar'

  // Añadir eventos
  insertarButton.addEventListener('click', () => {
    this.generarFormularioVacio(data)
  })

  selectEntidades.addEventListener('change', (event) => {
    const valorSelect = event.target.value
    this.manejarOption(valorSelect, data)
  })

  // Añadir elementos al fragmento
  fragment.appendChild(selectEntidades)
  fragment.appendChild(insertarButton)

  // Vaciar y agregar contenido al panel
  this.panelAdmin.innerHTML = ''
  this.panelAdmin.appendChild(fragment)
}

createOption(value, text) {
  const option = document.createElement('option')
  option.value = value
  option.textContent = text
  return option
}
async manejarOption(valorSelect, data) {
    const listarTablas = new M_listarTareas()
    let personajes = await listarTablas.listar(valorSelect)
    this.generarTabla(personajes, data)
  }

  generarTabla(personajes, data) {
    this.panelAdmin.appendChild(this.contenedorTabla)
    this.contenedorTabla.innerHTML = ''

    if (personajes.mensaje) {
        this.contenedorTabla.innerHTML = `<h2>${personajes.mensaje}</h2>`
        return
    }

    const table = document.createElement('table')
    const cabeceras = Object.keys(personajes[0]).filter(cabecera => cabecera !== 'idPersonaje')
    let theadHTML = '<thead><tr>'
    cabeceras.forEach(cabecera => {
        theadHTML += `<th>${cabecera.toUpperCase()}</th>`
    })
    theadHTML += '<th>ACCIONES</th></thead>'

    table.innerHTML = theadHTML

    const tbody = document.createElement('tbody')
    personajes.forEach(personaje => {
        const fila = document.createElement('tr')
        cabeceras.forEach(cabecera => {
            const celda = document.createElement('td')
            if (cabecera === 'urls' && personaje[cabecera]) {
                const imagenDiv = document.createElement('div') // Contenedor para imágenes
                imagenDiv.style.display = 'flex' // Flexbox para mostrar imágenes horizontalmente
                imagenDiv.style.gap = '10px'

                // Convertir la cadena de URLs a un array
                const imagenes = personaje[cabecera].split(',')
                console.log(imagenes)
                imagenes.forEach(url => {
                    console.log(url)
                    const imagen = document.createElement('img')
                    imagen.src = '../../img/'+url.trim() 
                    imagen.className = 'imagen-lista'
                    imagen.alt = 'Imagen del personaje'
                    imagen.style.width = '100px'
                    imagen.style.height = 'auto'
                    imagenDiv.appendChild(imagen)
                })

                celda.appendChild(imagenDiv)
            } else {
                celda.textContent = personaje[cabecera]
            }

            fila.appendChild(celda)
        })

        // Columna de acciones
        const actionCell = document.createElement('td')
        actionCell.classList.add('action-buttons')
        actionCell.innerHTML = `
            <button class="btn btn-eliminar" data-id="${personaje.idPersonaje}">Eliminar</button>
            <button class="btn btn-modificar" data-id="${personaje.idPersonaje}">Modificar</button>
        `
        fila.appendChild(actionCell)

        tbody.appendChild(fila)
    })

    table.appendChild(tbody)
    this.contenedorTabla.appendChild(table)

    // Delegación de Eventos
    this.contenedorTabla.addEventListener('click', (event) => {
        if (event.target.classList.contains('btn-eliminar')) {
          let id = event.target.dataset.id
          console.log(id)
          id= Number(id) 
          const respuesta = confirm("Estás seguro que deseas borrarlo?")
          if(respuesta){
              const modificar = new M_modificar().eliminarPersonaje(id)
          }
        }
        if (event.target.classList.contains('btn-modificar')) {
            const id = event.target.dataset.id
            const personajeSeleccionado = personajes.find(p => p.idPersonaje == id)
            this.generarFormulario(personajeSeleccionado, data)
        }
    })

  }

  generarFormulario(personaje, data) {
    let modal = document.getElementById('modal')
    if (!modal) {
      modal = document.createElement('div')
      modal.id = 'modal'
      modal.className = 'modal hidden'
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close-button">&times;</span>
          <div id="modal-body"></div>
          <div class="modal-footer">
              <button id="guardar-cambios" class="btn">Guardar Cambios</button>
          </div>
        </div>`
      document.body.appendChild(modal)
    }

    const modalBody = document.getElementById('modal-body')
    modalBody.innerHTML = ''

    const formulario = document.createElement('form')
    formulario.id = 'formulario-modificar'
    formulario.enctype = 'multipart/form-data' // Para manejar archivos
    Object.keys(personaje).forEach(key => {
      const label = document.createElement('label')
      label.textContent = key === 'urls' ? 'Imagenes' : key.toUpperCase()
      label.setAttribute('for', key)

      let input
      if (key === 'nombre') {
        input = document.createElement('input')
        input.type = 'text'
        input.name = key
        input.value = personaje[key]
      } else if (key === 'descripcion') {
        input = document.createElement('textarea')
        input.name = key
        input.value = personaje[key]
      } else if (key === 'tipo') {
        input = document.createElement('select')
        input.name = key
        data.forEach(valor => {
          const option = document.createElement('option')
          option.value = valor.tipo
          option.textContent = valor.nombre
          if (valor.tipo === personaje[key]) {
            option.selected = true
          }
          input.appendChild(option)
        })
      } else if (key === 'urls') {
        const imageContainer = document.createElement('div')
        imageContainer.className = 'image-container'
        imageContainer.style.display = 'flex'

        if(personaje[key]){
        personaje[key].split(',').forEach((url, index) => {
          const imgWrapper = document.createElement('div')
          imgWrapper.className = 'img-wrapper'
          imgWrapper.style.display = 'flex'
          imgWrapper.style.flexDirection = 'column'

          // Imagen actual
          const img = document.createElement('img')
          img.src = '../../img/' + url.trim()
          img.className ='imagen-sql'
          img.alt = `Imagen ${index + 1}`
          img.style.width = '100px'
          img.style.height = '100px'

          // Botón para eliminar la imagen
          const deleteButton = document.createElement('button')
          deleteButton.type = 'button'
          deleteButton.textContent = 'Eliminar'
          deleteButton.onclick = () => {
            imgWrapper.remove()

            const deletedInput = document.createElement('input')
              deletedInput.type = 'hidden'
              deletedInput.name = 'deletedImages[]'
              deletedInput.value = url.trim()
              formulario.appendChild(deletedInput)
          }

          imgWrapper.appendChild(img)
          imgWrapper.appendChild(deleteButton)
          imageContainer.appendChild(imgWrapper)

          // Campo oculto para indicar imágenes que se conservarán
          const hiddenInput = document.createElement('input')
          hiddenInput.type = 'hidden'
          hiddenInput.name = `existingImages[]`
          hiddenInput.value = url.trim()
          imgWrapper.appendChild(hiddenInput)

        })
        }

        formulario.appendChild(label)
        formulario.appendChild(imageContainer)

        // Campo para seleccionar nuevas imágenes
        const newImageInput = document.createElement('input')
        newImageInput.type = 'file'
        newImageInput.id='insertImagenes'
        newImageInput.name = 'newImages[]'
        newImageInput.multiple = true
        formulario.appendChild(newImageInput)
      } else {
        input = document.createElement('input')
        input.type = 'text'
        input.name = key
        input.value = personaje[key] || ''
        input.readOnly = true
      }

      if (key !== 'urls') {
        input.id = key
        formulario.appendChild(label)
        formulario.appendChild(input)
        formulario.appendChild(document.createElement('br'))
      }
    })

    modalBody.appendChild(formulario)
    modal.classList.remove('hidden')

    const closeButton = modal.querySelector('.close-button')
    closeButton.onclick = () => {
      modal.classList.add('hidden')
    }

    const guardarCambios = modal.querySelector('#guardar-cambios')
    guardarCambios.addEventListener('click', async (event) => {
      event.preventDefault()

      // Validar formulario
      const valido = new C_validarEnemigo(formulario).validarFormulario()
      if (valido) {
        const formData = new FormData(formulario)

        // Crear objeto con los datos del formulario
        const data = Object.fromEntries(formData.entries())
        if (data.idPersonaje) {
          data.idPersonaje = Number(data.idPersonaje) // Convertir idPersonaje a número
        }

        // Obtener imágenes existentes y eliminadas
        const existingImages = formData.getAll('existingImages[]')
        const deletedImages = formData.getAll('deletedImages[]')

        const newImages = formData.getAll('newImages[]')
        const newImageNames = []
        const subeImagenes = new M_subirImagenes()

        for (const imageFile of newImages) {
           try {
             const filename = await subeImagenes.uploadImage(imageFile)
            newImageNames.push(filename.filename)
          } catch (error) {
            console.error('Error subiendo la imagen:', error)
            alert('Hubo un problema al subir las imágenes.')
            return
          }    
        }

        console.log(newImageNames)
        data['newImages'] = newImageNames

        // Asignar imágenes existentes y eliminadas al objeto `data`
        data['existingImages'] = existingImages
        data['deletedImages'] = deletedImages

        // Cerrar el modal
        modal.classList.add('hidden')

        // Instanciar el modelo para modificar la entidad
        const modificar = new M_modificar()
        await modificar.mandarModificacion(data)
      }
    })
  }


generarFormularioVacio(data) {

  let modal = document.getElementById('modal')
  if (!modal) {
    modal = document.createElement('div')
    modal.id = 'modal'
    modal.className = 'modal hidden'
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-button">&times;</span>
        <div id="modal-body"></div>
        <div class="modal-footer">
            <button id="guardar-cambios" class="btn">Guardar Cambios</button>
        </div>
      </div>`
    document.body.appendChild(modal)
  }

  const modalBody = document.getElementById('modal-body')
  modalBody.innerHTML = ''

  const formulario = document.createElement('form')
  formulario.id = 'formulario-insertar'
  formulario.enctype = 'multipart/form-data' // Para manejar archivos
  const fields = ['nombre', 'descripcion', 'tipo', 'urls']
  
  fields.forEach(key => {
    const label = document.createElement('label')
    label.textContent = key.toUpperCase()
    label.setAttribute('for', key)

    let input
    if (key === 'tipo') {
      input = document.createElement('select')
      input.name = key
      // Suponiendo que `data` contiene los valores de tipos posibles
      data.forEach(valor => {
        const option = document.createElement('option')
        option.value = valor.tipo
        option.textContent = valor.nombre
        input.appendChild(option)
      })
    } else if (key === 'urls') {
      input = document.createElement('input')
      input.type = 'file'
      input.id='insertImagenes'
      input.name = 'newImages[]'
      input.multiple = true
    } else {
      input = document.createElement('input')
      input.type = 'text'
      input.name = key
    }

    input.id = key
    formulario.appendChild(label)
    formulario.appendChild(input)
    formulario.appendChild(document.createElement('br'))
  })

  modalBody.appendChild(formulario)
  modal.classList.remove('hidden')

  const closeButton = modal.querySelector('.close-button')
  closeButton.onclick = () => {
    modal.classList.add('hidden')
  }

  const guardarCambios = modal.querySelector('#guardar-cambios')
  guardarCambios.addEventListener('click', async (event) => {
    event.preventDefault()

    // Validar formulario
        const formData = new FormData(formulario)

        modal.classList.add('hidden')
        // Crear objeto con los datos del formulario
        const data = Object.fromEntries(formData.entries())
        if (data.idPersonaje) {
          data.idPersonaje = Number(data.idPersonaje) // Convertir idPersonaje a número
        }

        // Obtener imágenes existentes y eliminadas
        const existingImages = formData.getAll('existingImages[]')
        const deletedImages = formData.getAll('deletedImages[]')

        const newImages = formData.getAll('newImages[]')
        const newImageNames = []
        const subeImagenes = new M_subirImagenes()

        for (const imageFile of newImages) {
           try {
             const filename = await subeImagenes.uploadImage(imageFile)
            newImageNames.push(filename.filename)
          } catch (error) {
            console.error('Error subiendo la imagen:', error)
            alert('Hubo un problema al subir las imágenes.')
            return
          }    
        }

        console.log(newImageNames)
        data['newImages'] = newImageNames

        // Asignar imágenes existentes y eliminadas al objeto `data`
        data['existingImages'] = existingImages
        data['deletedImages'] = deletedImages

        // Cerrar el modal
        modal.classList.add('hidden')

        // Instanciar el modelo para modificar la entidad
        const modificar = new M_modificar()
        await modificar.mandarInsercion(data)

    })
}
}
export default C_entidades
