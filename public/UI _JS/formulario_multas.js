        // Cargar dinámicamente los tipos de infracción desde el backend
        document.addEventListener("DOMContentLoaded", function () {
            fetch("/UI/form_generar_multa")
                .then(response => response.json())
                .then(data => {
                    console.log(data);  // Verificar si los datos están siendo recibidos correctamente
                    const tipoInfraccionSelect = document.getElementById("tipo_infraccion");
                    data.forEach(tipo => {
                        const option = document.createElement("option");
                        option.value = tipo.id_tipo_infraccion;
                        option.textContent = tipo.tipo_infraccion;
                        tipoInfraccionSelect.appendChild(option);
                    });
                })
                .catch(error => {
                    console.error("Error al cargar los tipos de infracción:", error);
                });
        });

        // Verificar infractor
        document.getElementById("verificarInfractor").addEventListener("click", function() {
            const dpi = document.getElementById("num_dpi").value;

            fetch(`/UI/verificar_infractor/${dpi}`)
                .then(response => response.json())
                .then(data => {
                    if (data.existe) {
                        document.getElementById("nombre_infractor").value = data.nombre;
                        document.getElementById("direccion_infractor").value = data.direccion;
                        document.getElementById("num_licencia").value = data.num_licencia;
                        alert("Infractor encontrado y datos rellenados");
                    } else {
                        alert("El infractor no existe");
                    }
                })
                .catch(error => console.error("Error al verificar el infractor:", error));
        });

        // Verificar vehículo
        document.getElementById("verificarVehiculo").addEventListener("click", function() {
            const placa = document.getElementById("placa").value;

            fetch(`/UI/verificar_vehiculo/${placa}`)
                .then(response => response.json())
                .then(data => {
                    if (data.existe) {
                        document.getElementById("tarjeta_circulacion").value = data.tarjeta_circulacion;
                        document.getElementById("tipo_vehiculo").value = data.tipo_vehiculo;
                        document.getElementById("marca").value = data.marca;
                        document.getElementById("color").value = data.color;
                        alert("Vehículo encontrado y datos rellenados");
                    } else {
                        alert("El vehículo no existe");
                    }
                })
                .catch(error => console.error("Error al verificar el vehículo:", error));
        });