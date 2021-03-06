/*
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarJWT, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT ,getUsuarios );

router.post( '/',
    [ 
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        check('password', 'La contrasenia es obligatorio').not().isEmpty(),
        check('email', 'El E-mail es obligatorio').isEmail(),
        validarCampos
    ], 
    crearUsuario 
 ); 

 router.put( '/:id',
 [ 
    validarJWT,
    validarADMIN_ROLE_o_MismoUsuario,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El E-mail es obligatorio').isEmail(),
    check('role', 'El role es obligatorio').not().isEmpty(),
    validarCampos
],
 actualizarUsuario );

 router.delete( '/:id', 
    validarJWT,
    borrarUsuario 
);

module.exports = router; 