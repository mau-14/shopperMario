import M_dashboard from "../modelo/m_dashboard.js"

class C_dashboard{

  constructor(panelAdmin){
    this.panelAdmin = panelAdmin
  }

  async cargarDatos(){
     const dashboard = new M_dashboard()
    const data = await dashboard.datosDashboard()
    console.log(data)
    this.mostrarDatos(data)

  }

  mostrarDatos(data){
      
    this.panelAdmin.innerHTML = ''

    this.panelAdmin.innerHTML = '<h2>Estadísticas</h2>'
    
    const totalPartidasDiv = this.crearDiv('Total Partidas: ', data.total_partidas)
    this.panelAdmin.appendChild(totalPartidasDiv)

    const promedioPuntuacionDiv = this.crearDiv('Promedio Puntuación: ',data.promedioPuntuacion)
    this.panelAdmin.appendChild(promedioPuntuacionDiv)

    const promedioDuracionDiv = this.crearDiv('Tiempo Promedio de las Partidas: ', data.promedio_duracion)
    this.panelAdmin.appendChild(promedioDuracionDiv)
    
    const maximaPuntuacionDiv = this.crearDiv('Máxima puntuación: ', `${data.maxima_puntuacion.nickname} - ${data.maxima_puntuacion.puntuacion}`)
    this.panelAdmin.appendChild(maximaPuntuacionDiv)
    
    
    const tamanoBaseDeDatosDiv = this.crearDiv('Tamaño de la Base de Datos:', `${data.tamano_mb} MB`);
    this.panelAdmin.appendChild(tamanoBaseDeDatosDiv);
    
  }


  crearDiv(titulo, contenido){
    const contenedor = document.createElement('div')
    contenedor.classList.add('dinamicos-Admin')
    const encabezado = document.createElement('h3')
    encabezado.innerText = titulo
    const parrafo = document.createElement('p')
    parrafo.innerText = contenido


    contenedor.appendChild(encabezado)
    contenedor.appendChild(parrafo)
    return contenedor
  }

}

export default C_dashboard
