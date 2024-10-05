let mysql = require("mysql");

// Configuración de la conexión a la base de datos
let conexion = mysql.createConnection({
    host: "localhost",
    database: "control_multas",
    user: "root",
    password: ""
});

// Establecer la conexión a la base de datos
conexion.connect(function(err){
    if(err){
        console.log("CONEXION FALLIDA");  // Error al conectar
    }
    else{
        console.log("CONECTADO CORRECTAMENTE PMT SANTA");  // Conexión exitosa
    }
});

// Exportar el objeto de conexión para usarlo en otros módulos
module.exports = conexion;
