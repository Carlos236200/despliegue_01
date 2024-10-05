const bcrypt = require('bcrypt');
const conexion = require('./conexion');  // archivo de conexión a la base de datos

// Datos de ejemplo
const nombre = 'Carlos';
const apellido = 'Rodríguez';
const username = 'Crodriguez';
const password = 'carlos23';  // La contraseña original (antes de encriptar)
const rol = 'Administrador';
const estado = '1';

// Encriptar la contraseña
bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }

    // Query para insertar el usuario en la base de datos
    const query = `INSERT INTO usuarios (nombre, apellido, username, password, rol, estado) VALUES (?, ?, ?, ?, ?, ?)`;
    conexion.query(query, [nombre, apellido, username, hash, rol, estado], (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Usuario insertado con éxito');
    });
});
