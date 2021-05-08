/*
    PATH: '/api/upload/:busqueda'
*/
const { Router } = require('express');
const expressFileUpload = require('express-fileupload');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');
const { fileUpload, retornaImagen } = require('../controllers/uploads')

const router = Router();

// default options
router.use( expressFileUpload() );

router.put( '/:tipo/:id', validarJWT, fileUpload );

router.get( '/:tipo/:foto', retornaImagen );

module.exports = router; 