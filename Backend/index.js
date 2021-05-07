require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Instancia de conexion
const { dbConnection } = require('./database/config');

// Crear servidor de express
const app = express();

//Configurar Cors
app.use( cors() );

//Lectura y parseo del body
app.use( express.json() );

//Base de Datos
dbConnection(); 

//Rutas
app.use( '/api/usuarios', require('./routes/usuarios') )
app.use( '/api/login', require('./routes/auth') )

app.listen( process.env.PORT, ()=> {
    console.log('Servidor corriendo en puerto ' + process.env.PORT );
});