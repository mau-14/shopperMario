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

    this.contenedorTabla.addEventListener('click', (event) => {
    const target = event.target
    const id = target.dataset.id

    if (id) {
      if (target.classList.contains('btn-eliminar')) {
        this.eliminarPersonaje(id)
      } else if (target.classList.contains('btn-modificar')) {
        this.modificarPersonaje(id)
      }
    }
  })

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
  this.generarFormulario(null, data, false);  // `false` indica inserción
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
async manejarOption(valorSelect) {
  const listarTablas = new M_listarTareas()
  let personajes = await listarTablas.listar(valorSelect)
  this.generarTabla(personajes)
}

generarTabla(personajes, data) {
  this.panelAdmin.appendChild(this.contenedorTabla)
  this.contenedorTabla.innerHTML = ''

  if (personajes.mensaje) {
    this.contenedorTabla.innerHTML = `<h2>${personajes.mensaje}</h2>`
    return
  }

  // Crear un fragmento de documento para mejorar la performance
  const fragment = document.createDocumentFragment()

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
        const imagenDiv = document.createElement('div')
        imagenDiv.style.display = 'flex'
        imagenDiv.style.gap = '10px'
        const imagenes = personaje[cabecera].split(',')
        imagenes.forEach(url => {
          const imagen = document.createElement('img')
          imagen.src = '/SHOPPERMARIO/admin/img/' + url.trim()
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

  // Agregar la tabla al fragmento en lugar de directamente al DOM
  fragment.appendChild(table)

  // Finalmente, agregar el fragmento al contenedor de la tabla
  this.contenedorTabla.appendChild(fragment)

}

eliminarPersonaje(id) {
  const respuesta = confirm("Estás seguro que deseas borrarlo?")
  if (respuesta) {
    // Eliminar el personaje de la base de datos o de tu fuente de datos
    new M_modificar().eliminarPersonaje(Number(id)).then(() => {
      // Una vez eliminada la persona, recargar la tabla
      const valorSelect = document.getElementById('select-entidades').value
      this.manejarOption(valorSelect)
    }).catch((error) => {
      console.error("Error al eliminar:", error)
    })
  }
}
async modificarPersonaje(id) {
  const entidades = new M_entidades()
  const data = await entidades.datosDashboard()

  const valorSelect = document.getElementById('select-entidades').value
  const listarTablas = new M_listarTareas()
  let personajes = await listarTablas.listar(valorSelect)
  const personajeSeleccionado = personajes.find(p => p.idPersonaje == id)
  this.generarFormulario(personajeSeleccionado, data, true)
}


generarFormulario(personaje = null, data, esModificacion = false) {
    console.log(personaje)
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
                    <button id="guardar-cambios" class="btn">${esModificacion ? 'Guardar Cambios' : 'Crear Personaje'}</button>
                </div>
            </div>`
        document.body.appendChild(modal)
    }

    const modalBody = document.getElementById('modal-body')
    modalBody.innerHTML = ''

    const formulario = document.createElement('form')
    formulario.id = esModificacion ? 'formulario-modificar' : 'formulario-insertar'
    formulario.enctype = 'multipart/form-data'

    // Campos a manejar
    const fields = ['idPersonaje','nombre', 'descripcion', 'tipo', 'urls']

    // Rellenar el formulario según si es modificación o inserción
    fields.forEach(key => {
        const label = document.createElement('label')
        label.textContent = key.toUpperCase()
        label.setAttribute('for', key)

        let input

        if (key === 'nombre') {
            input = document.createElement('input')
            input.type = 'text'
            input.id = 'name'
            input.name = key
            input.value = esModificacion && personaje ? personaje[key] : ''
        } else if (key === 'descripcion') {
            input = document.createElement('textarea')
            input.id = 'description'
            input.name = key
            input.value = esModificacion && personaje ? personaje[key] : ''
        } else if (key === 'tipo') {
            input = document.createElement('select')
            input.name = key
            data.forEach(valor => {
                const option = document.createElement('option')
                option.value = valor.tipo
                option.textContent = valor.nombre
                if (esModificacion && personaje && valor.tipo === personaje[key]) {
                    option.selected = true
                }
                input.appendChild(option)
            })
        } else if (key === 'idPersonaje' && esModificacion){
            input = document.createElement('input')
            input.type = 'hidden'
            input.id = 'idPersonaje'
            input.name = key
            input.value = personaje[key]
        } else if (key === 'urls') {
            // Manejo de imágenes
            const imageContainer = document.createElement('div')
            imageContainer.className = 'image-container'
            imageContainer.style.display = 'flex'

            if (esModificacion && personaje && personaje[key]) {
                // Mostrar imágenes existentes si estamos en modificación
                personaje[key].split(',').forEach((url, index) => {
                    const imgWrapper = document.createElement('div')
                    imgWrapper.className = 'img-wrapper'
                    imgWrapper.style.display = 'flex'
                    imgWrapper.style.flexDirection = 'column'

                    // Imagen actual
                    const img = document.createElement('img')
                    img.src = '../../img/' + url.trim()
                    img.className = 'imagen-sql'
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
                    hiddenInput.name = 'existingImages[]'
                    hiddenInput.value = url.trim()
                    imgWrapper.appendChild(hiddenInput)
                })

                input = document.createElement('input')
                input.type = 'hidden'
                input.id = 'idPersonaje'
                input.value = personaje['idPersonaje']
           

            formulario.appendChild(label)
            formulario.appendChild(imageContainer)

            // Campo para seleccionar nuevas imágenes
            const newImageInput = document.createElement('input')
            newImageInput.type = 'file'
            newImageInput.id = 'insertImagenes'
            newImageInput.name = 'newImages[]'
            newImageInput.multiple = true
            formulario.appendChild(newImageInput)

            formulario.appendChild(document.createElement('br'))
            return; // Evitar procesar más después de manejar imágenes
        }
        }else{


          input = document.createElement('input')
          input.type = 'hidden'
          input.id = 'idPersonaje'
          input.value = personaje['idPersonaje']
          console.log('ENTROO')
        }
        // Agregar los elementos comunes al formulario
        formulario.appendChild(label)
        formulario.appendChild(input)
        formulario.appendChild(document.createElement('br'))
    })

    modalBody.appendChild(formulario);
 const closeButton = modal.querySelector('.close-button')
    closeButton.onclick = () => {
        modal.remove()
    }
 const guardarCambios = modal.querySelector('#guardar-cambios')
  guardarCambios.addEventListener('click', async (event) => {
  event.preventDefault()

  // Validar formulario
  const valido = new C_validarEnemigo(formulario).validarFormulario()
  if (!valido) {
    alert('Por favor, corrija los errores en el formulario.')
    return
  }

  const formData = new FormData(formulario)

    console.log(formData)

  // Crear objeto con los datos del formulario
  const data = Object.fromEntries(formData.entries())
  if (data.idPersonaje) {
    console.log(data.idPersonaje)
    data.idPersonaje = Number(data.idPersonaje)
  }

  // Obtener imágenes existentes, eliminadas y nuevas
  const existingImages = formData.getAll('existingImages[]')
  const deletedImages = formData.getAll('deletedImages[]')
  const newImages = formData.getAll('newImages[]')

  const newImageNames = []
  const subeImagenes = new M_subirImagenes()

  try {
    for (const imageFile of newImages) {
      const filename = await subeImagenes.uploadImage(imageFile)
      newImageNames.push(filename.filename)
    }
    data['newImages'] = newImageNames
    data['existingImages'] = existingImages
    data['deletedImages'] = deletedImages
    console.log(data)
    // Instanciar el modelo para modificar la entidad

    const modificar = new M_modificar()
    console.log(data)
    if(esModificacion){
      await modificar.mandarModificacion(data)
    }else{
      
      await modificar.mandarInsercion(data)
    }

    alert('Cambios guardados con éxito.')
    modal.classList.add('hidden')
    formulario.reset()
    modal.remove()
  } catch (error) {
    console.error('Error al guardar los cambios:', error)
    alert('Ocurrió un problema al guardar los cambios. Inténtelo nuevamente.')
  }
})
    // Mostrar modal
    modal.classList.remove('hidden')
}}
export default C_entidades
