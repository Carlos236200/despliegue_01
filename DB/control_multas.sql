-- Crear la base de datos si no existe y seleccionarla
CREATE DATABASE IF NOT EXISTS control_multas;
USE control_multas;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Estructura de tabla para la tabla `usuarios`
DROP TABLE IF EXISTS usuarios;
CREATE TABLE usuarios (
    id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol ENUM('Administrador', 'Estándar') NOT NULL,
    estado BOOLEAN NOT NULL DEFAULT 1,  -- 1 para activo, 0 para inactivo
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estructura de tabla para la tabla `infractores`
DROP TABLE IF EXISTS infractores;
CREATE TABLE infractores (
    id_infractor INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    num_dpi VARCHAR(20) NOT NULL UNIQUE,
    num_licencia VARCHAR(20) NOT NULL UNIQUE
);

-- Estructura de tabla para la tabla `vehiculos`
DROP TABLE IF EXISTS vehiculos;
CREATE TABLE vehiculos (
    id_vehiculo INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_infractor INT NOT NULL,
    tarjeta_circulacion VARCHAR(20) NOT NULL UNIQUE,
    placa VARCHAR(20) NOT NULL UNIQUE,
    tipo_vehiculo VARCHAR(50) NOT NULL,
    marca VARCHAR(20) NOT NULL,
    color VARCHAR(50) NOT NULL,
    CONSTRAINT fk_infractor_vehiculo FOREIGN KEY (id_infractor) REFERENCES infractores(id_infractor) ON DELETE CASCADE
);

-- Estructura de tabla para la tabla `tipos_infraccion`
DROP TABLE IF EXISTS tipos_infraccion;
CREATE TABLE tipos_infraccion (
    id_tipo_infraccion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    tipo_infraccion VARCHAR(50) NOT NULL
);

-- Estructura de tabla para la tabla `multas`
DROP TABLE IF EXISTS multas;
CREATE TABLE multas (
    id_multa INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    numero_multa VARCHAR(20) NOT NULL UNIQUE,
    id_infractor INT NOT NULL,
    id_vehiculo INT NOT NULL,
    id_tipo_infraccion INT NOT NULL,
    fecha_infraccion DATETIME NOT NULL,
    monto_multa DECIMAL(10, 2) NOT NULL,
    estado_multa ENUM('Pendiente', 'Pagada', 'Vencida') NOT NULL,
    fecha_vencimiento DATE DEFAULT NULL,
    CONSTRAINT fk_infractor_multa FOREIGN KEY (id_infractor) REFERENCES infractores(id_infractor) ON DELETE CASCADE,
    CONSTRAINT fk_vehiculo_multa FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo) ON DELETE CASCADE,
    CONSTRAINT fk_tipo_infraccion_multa FOREIGN KEY (id_tipo_infraccion) REFERENCES tipos_infraccion(id_tipo_infraccion) ON DELETE CASCADE
);

-- Estructura de tabla para la tabla `comentarios`
DROP TABLE IF EXISTS comentarios;
CREATE TABLE comentarios (
    id_comentario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_multa INT,
    comentario VARCHAR(200),
    fecha_comentario DATETIME,
    id_usuario INT,
    CONSTRAINT fk_multa_comentario FOREIGN KEY (id_multa) REFERENCES multas(id_multa) ON DELETE CASCADE,
    CONSTRAINT fk_usuario_comentario FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE SET NULL
);

-- Estructura de tabla para la tabla `notificaciones`
DROP TABLE IF EXISTS notificaciones;
CREATE TABLE notificaciones (
    id_notificacion INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_multa INT NOT NULL,
    mensaje VARCHAR(200) NOT NULL,
    fecha DATE NOT NULL,
    estado ENUM('Pendiente', 'Leído') NOT NULL,
    CONSTRAINT fk_usuario_notificacion FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_multa_notificacion FOREIGN KEY (id_multa) REFERENCES multas(id_multa) ON DELETE CASCADE
);

-- Estructura de tabla para la tabla `registro`
DROP TABLE IF EXISTS registro;
CREATE TABLE registro (
    id_registro INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    fecha_registro DATETIME NOT NULL,
    accion_realizada VARCHAR(100) NOT NULL,
    CONSTRAINT fk_usuario_registro FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);

COMMIT;
