import M_dialogos from "../modelo/m_dialogos.js"

class C_dialogos{

  constructor(panelAdmin){
    this.panelAdmin = panelAdmin
    this.contenedorTabla = document.createElement('div')
    this.contenedorTabla.id = 'contenedorTabla'
  }


  async cargarDatos(){
    this.panelAdmin.innerHTML = ''
   const dialogos = new M_dialogos()   
    const data = await dialogos.datosDialogos()
    this.generarTabla(data)

  }

  generarTabla(data){

    this.panelAdmin.appendChild(this.contenedorTabla)
    this.contenedorTabla.innerHTML = ''

    if(data.mensaje){
      this.contenedorTabla.innerHTML  = `<h2>${data.mensaje}</h2>`
      return
    }

    const table = document.createElement('table')
    const cabeceras = Object.keys(data[0]).filter(cabecera => cabecera !== 'idDialogo');
    let theadHTML = '<thead><tr>'
    cabeceras.forEach(cabecera =>{

      theadHTML += `<th>${cabecera.toUpperCase()}</th>`
    })
    theadHTML += '<th>ACCIONES</th></thead>'

    table.innerHTML = theadHTML

    const tbody = document.createElement('tbody')
    data.forEach(dato => {
      const fila = document.createElement('tr')
      cabeceras.forEach(cabecera => {
        const celda = document.createElement('td')
        if(dato[cabecera]!='idDialogo'){

          celda.textContent = dato[cabecera]
        }
        fila.appendChild(celda)
      })
        const actionCell = document.createElement('td')
        actionCell.classList.add('action-buttons')
        actionCell.innerHTML = `
            <button class="btn btn-eliminar" data-id="${dato.idDialogo}">Eliminar</button>
            <button class="btn btn-modificar" data-id="${dato.idDialogo}">Modificar</button>
        `
        fila.appendChild(actionCell)

        tbody.appendChild(fila)

    })
    
    table.appendChild(tbody)
    this.contenedorTabla.appendChild(table)
    //Delegación de Eventos
    this.contenedorTabla.addEventListener('click', (event)=>{
      if(event.target.classList.contains('btn-eliminar')){
        console.log(event.target.dataset.id)
      }
     if(event.target.classList.contains('btn-modificar')){
        console.log(event.target.dataset.id)
      }
    })

  }
}

export default C_dialogos
