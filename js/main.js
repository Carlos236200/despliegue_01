// main.js

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const conexion = require("./conexion");
const bcrypt = require("bcrypt");
const session = require("express-session");
const crearUsuario = require("./crear_usuario");
const generarMulta = require("./generar_multa");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use(session({
    secret: 'your_secret_key',  // clave secreta unica
    resave: false,
    saveUninitialized: false
}));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.post("/login", (req, res) => {
    const username = req.body.usuario;
    const password = req.body.clave;

    const query = "SELECT * FROM usuarios WHERE username = ?";
    conexion.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error en la base de datos");
        }

        if (results.length > 0) {
            const user = results[0];
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) {
                    console.error(err);
                    return res.status(500).send("Error en la verificación de la contraseña");
                }

                if (isMatch) {
                    req.session.userId = user.id_usuario;
                    res.redirect("UI/inicio.html");
                } else {
                    res.send(`<script>alert('Usuario o contraseña incorrectos'); window.location.href = '/';</script>`);
                }
            });
        } else {
            res.send(`<script>alert('Usuario o contraseña incorrectos'); window.location.href = '/';</script>`);
        }
    });
});

app.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Error al cerrar la sesión");
        }
        res.redirect("/");
    });
});

app.use("/", crearUsuario);
app.use("/UI", generarMulta);

app.listen(3000, () => {
    console.log("Servidor iniciado en el puerto 3000");
});
