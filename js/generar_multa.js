const express = require("express");
const conexion = require("./conexion");

const router = express.Router();

// Ruta GET para obtener los tipos de infracción y enviarlos al frontend
router.get("/form_generar_multa", (req, res) => {
    const queryTiposInfraccion = "SELECT id_tipo_infraccion, tipo_infraccion FROM tipos_infraccion";
    conexion.query(queryTiposInfraccion, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener los tipos de infracción.");
        }
        res.json(results);
    });
});

// Ruta GET para verificar si el infractor existe
router.get("/verificar_infractor/:dpi", (req, res) => {
    const dpi = req.params.dpi;
    const queryVerificarInfractor = "SELECT id_infractor, nombre, direccion, num_licencia FROM infractores WHERE num_dpi = ?";
    
    conexion.query(queryVerificarInfractor, [dpi], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al verificar el infractor.");
        }

        if (result.length > 0) {
            res.json({
                existe: true,
                nombre: result[0].nombre,
                direccion: result[0].direccion,
                num_licencia: result[0].num_licencia
            });
        } else {
            res.json({ existe: false });
        }
    });
});

// Ruta GET para verificar si el vehículo existe
router.get("/verificar_vehiculo/:placa", (req, res) => {
    const placa = req.params.placa;
    const queryVerificarVehiculo = "SELECT id_vehiculo, tarjeta_circulacion, tipo_vehiculo, marca, color FROM vehiculos WHERE placa = ?";
    
    conexion.query(queryVerificarVehiculo, [placa], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al verificar el vehículo.");
        }

        if (result.length > 0) {
            res.json({
                existe: true,
                tarjeta_circulacion: result[0].tarjeta_circulacion,
                tipo_vehiculo: result[0].tipo_vehiculo,
                marca: result[0].marca,
                color: result[0].color
            });
        } else {
            res.json({ existe: false });
        }
    });
});

// Ruta POST para generar la multa
router.post("/generar_multa", (req, res) => {
    const { infractorNombre, infractorDireccion, infractorDPI, infractorLicencia, tarjetaCirculacion, placa, tipoVehiculo, marca, color, tipoInfraccion, numeroMulta, fechaInfraccion, montoMulta, estadoMulta, fechaVencimiento } = req.body;

    // Verificar si el infractor ya existe
    const queryVerificarInfractor = "SELECT id_infractor FROM infractores WHERE num_dpi = ?";
    conexion.query(queryVerificarInfractor, [infractorDPI], (err, resultInfractor) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al verificar el infractor.");
        }

        let idInfractor;

        if (resultInfractor.length > 0) {
            idInfractor = resultInfractor[0].id_infractor;
            manejarVehiculo();
        } else {
            // Insertar nuevo infractor
            const queryInsertarInfractor = "INSERT INTO infractores (nombre, direccion, num_dpi, num_licencia) VALUES (?, ?, ?, ?)";
            conexion.query(queryInsertarInfractor, [infractorNombre, infractorDireccion, infractorDPI, infractorLicencia], (err, resultInsertarInfractor) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error al insertar el infractor.");
                }
                idInfractor = resultInsertarInfractor.insertId;
                manejarVehiculo();
            });
        }

        // Manejar la verificación del vehículo
        function manejarVehiculo() {
            const queryVerificarVehiculo = "SELECT id_vehiculo FROM vehiculos WHERE placa = ?";
            conexion.query(queryVerificarVehiculo, [placa], (err, resultVehiculo) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error al verificar el vehículo.");
                }

                let idVehiculo;

                if (resultVehiculo.length > 0) {
                    idVehiculo = resultVehiculo[0].id_vehiculo;
                    insertarMulta(idVehiculo); // Pasar idVehiculo a la función insertarMulta
                } else {
                    // Insertar nuevo vehículo
                    const queryInsertarVehiculo = "INSERT INTO vehiculos (id_infractor, tarjeta_circulacion, placa, tipo_vehiculo, marca, color) VALUES (?, ?, ?, ?, ?, ?)";
                    conexion.query(queryInsertarVehiculo, [idInfractor, tarjetaCirculacion, placa, tipoVehiculo, marca, color], (err, resultInsertarVehiculo) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send("Error al insertar el vehículo.");
                        }
                        idVehiculo = resultInsertarVehiculo.insertId;
                        insertarMulta(idVehiculo); // Pasar idVehiculo a la función insertarMulta
                    });
                }
            });
        }

        // Insertar la multa
        function insertarMulta(idVehiculo) {
            const queryTipoInfraccion = "SELECT id_tipo_infraccion FROM tipos_infraccion WHERE id_tipo_infraccion = ?";
            conexion.query(queryTipoInfraccion, [tipoInfraccion], (err, resultTipoInfraccion) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error al obtener el tipo de infracción.");
                }

                if (resultTipoInfraccion.length === 0) {
                    return res.status(404).send("El tipo de infracción no existe.");
                }

                const idTipoInfraccion = resultTipoInfraccion[0].id_tipo_infraccion;

                const queryInsertarMulta = "INSERT INTO multas (numero_multa, id_infractor, id_vehiculo, id_tipo_infraccion, fecha_infraccion, monto_multa, estado_multa, fecha_vencimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
                conexion.query(queryInsertarMulta, [numeroMulta, idInfractor, idVehiculo, idTipoInfraccion, fechaInfraccion, montoMulta, estadoMulta, fechaVencimiento], (err, resultMulta) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error al insertar la multa.");
                    }

                    res.send(`<script>alert('Multa generada exitosamente'); window.location.href = 'generar_multas.html';</script>`);
                });
            });
        }
    });
});

// Ruta GET para obtener las multas
router.get("/obtener_multas", (req, res) => {
    const query = `
        SELECT 
            i.nombre AS infractor, 
            i.direccion, 
            i.num_dpi AS dpi, 
            i.num_licencia AS licencia, 
            v.tarjeta_circulacion, 
            v.placa, 
            v.tipo_vehiculo, 
            v.marca, 
            v.color, 
            m.numero_multa, 
            m.fecha_infraccion, 
            m.monto_multa, 
            m.estado_multa, 
            m.fecha_vencimiento,
            ti.tipo_infraccion  -- Se agrega el tipo de infracción
        FROM 
            multas m
        JOIN 
            infractores i ON m.id_infractor = i.id_infractor
        JOIN 
            vehiculos v ON m.id_vehiculo = v.id_vehiculo
        JOIN 
            tipos_infraccion ti ON m.id_tipo_infraccion = ti.id_tipo_infraccion;  -- Join con tipos_infraccion
    `;
    conexion.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener las multas.");
        }
        res.json(results);
    });
});



// Ruta GET para obtener las multas de un vehículo por su placa
router.get("/consultar_multas/:placa", (req, res) => {
    const placa = req.params.placa;
    const query = `
        SELECT 
            m.fecha_infraccion, 
            ti.tipo_infraccion AS tipo_infraccion,  
            m.monto_multa, 
            m.estado_multa 
        FROM 
            multas m
        JOIN 
            vehiculos v ON m.id_vehiculo = v.id_vehiculo
        JOIN 
            tipos_infraccion ti ON m.id_tipo_infraccion = ti.id_tipo_infraccion
        WHERE 
            v.placa = ?;
    `;
    conexion.query(query, [placa], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al obtener las multas.");
        }
       // Si no hay resultados, devuelve un array vacío con estado 200
       if (results.length === 0) {
        return res.status(200).json([]); // Cambiado a 200 con un array vacío
    }
        res.json(results);
    });
});



module.exports = router;
