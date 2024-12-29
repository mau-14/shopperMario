'use strict'

async function cargarImagenes() {
    try {
        
        const response = await fetch('index.php?c=PanelControl&m=');
        if (!response.ok) throw new Error(`Error en la respuesta: ${response.statusText}`);


        const data = await response.json();

        const tbody = document.querySelector('tbody');

        tbody.innerHTML = '';

        data.imagenes.forEach((imagen) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${imagen.id}</td>
                <td>${imagen.nombre}</td>
                <td>${imagen.descripcion}</td>
                <td>${imagen.tipo}</td>
                <td><img src="${imagen.url}" alt="${imagen.nombre}" style="width: 100px;"></td>
                <td class="action-buttons">
                    <button onclick="eliminarImagen(${imagen.id})" class="btn btn-eliminar">Eliminar</button>
                    <button onclick="modificarImagen(${imagen.id})" class="btn btn-modificar">Modificar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar las imágenes:', error);
        alert('No se pudieron cargar las imágenes. Revisa la consola para más detalles.');
    }

}