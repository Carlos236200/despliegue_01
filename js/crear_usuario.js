const express = require("express");
const bcrypt = require("bcrypt");
const conexion = require("./conexion");

const router = express.Router();

// Ruta para procesar la creación de usuarios
router.post("/crear_usuario", (req, res) => {
    const { firstName, lastName, username, password, role, estatus } = req.body;

    // Verifica que la contraseña tenga al menos 8 caracteres
    if (password.length < 8) {
        return res.send(`<script>alert('La contraseña debe tener al menos 8 caracteres.'); window.location.href = 'UI/crear_usuario.html';</script>`);
    }

    // Verifica si el nombre de usuario ya existe
    const queryCheckUser = "SELECT * FROM usuarios WHERE username = ?";
    conexion.query(queryCheckUser, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error en la base de datos al verificar el usuario");
        }

        if (results.length > 0) {
            // El usuario ya existe
            res.send(`<script>alert('El nombre de usuario ya existe. Elige otro.'); window.location.href = 'UI/crear_usuario.html';</script>`);
        } else {
            // El usuario no existe, procede a crearlo
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error al encriptar la contraseña");
                }

                // Inserción en la base de datos
                const queryInsertUser = "INSERT INTO usuarios (nombre, apellido, username, password, rol, estado) VALUES (?, ?, ?, ?, ?, 1)";
                conexion.query(queryInsertUser, [firstName, lastName, username, hashedPassword, role, estatus], (err, result) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send("Error en la base de datos al crear el usuario");
                    }

                    res.send(`<script>alert('Usuario creado exitosamente'); window.location.href = 'UI/crear_usuario.html';</script>`);
                });
            });
        }
    });
});

module.exports = router;
