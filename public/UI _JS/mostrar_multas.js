document.addEventListener("DOMContentLoaded", function() {
    fetch('/UI/obtener_multas')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#multasTable tbody');
            if (tableBody) { // Verifica que el elemento tbody exista
                tableBody.innerHTML = ''; // Limpiar tabla antes de agregar datos

                data.forEach(row => {
                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${row.infractor || 'N/A'}</td>
                        <td>${row.direccion || 'N/A'}</td>
                        <td>${row.dpi || 'N/A'}</td>
                        <td>${row.licencia || 'N/A'}</td>
                        <td>${row.tarjeta_circulacion || 'N/A'}</td>
                        <td>${row.placa || 'N/A'}</td>
                        <td>${row.tipo_vehiculo || 'N/A'}</td>
                        <td>${row.marca || 'N/A'}</td>
                        <td>${row.color || 'N/A'}</td>
                        <td>${row.tipo_infraccion || 'N/A'}</td>  <!-- Nueva columna para el tipo de infracción -->
                        <td>${row.numero_multa || 'N/A'}</td>
                        <td>${formatearFecha(row.fecha_infraccion) || 'N/A'}</td>
                        <td>${row.monto_multa || 'N/A'}</td>
                        <td>${row.estado_multa || 'N/A'}</td>
                        <td>${formatearFecha(row.fecha_vencimiento) || 'N/A'}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            } else {
                console.error('No se encontró el tbody con el ID #multasTable tbody');
            }
        })
        .catch(error => console.error('Error:', error));
});

// Función para formatear la fecha de aaaa-mm-dd a dd/mm/aaaa
function formatearFecha(fecha) {
    if (!fecha) return '';
    
    // Crear un objeto Date a partir de la fecha en formato ISO
    const dateObj = new Date(fecha);

    // Extraer el día, mes y año
    const dia = String(dateObj.getDate()).padStart(2, '0'); // Obtener el día
    const mes = String(dateObj.getMonth() + 1).padStart(2, '0'); // Obtener el mes (0-11)
    const anio = dateObj.getFullYear(); // Obtener el año

    // Formatear a dd/mm/aaaa
    return `${dia}/${mes}/${anio}`;
}
