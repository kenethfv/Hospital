require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Instancia de conexion
const { dbConnection } = require('./database/config');

// Crear servidor de express
const app = express();

//Configurar Cors
app.use( cors() );

//Base de Datos
dbConnection();

//Rutas
app.get( '/', (req, res) => {
    res.status(400).json({
        ok: true,
        msg: 'Hola Mundo'
    })
});

app.listen( process.env.PORT, ()=> {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
})
