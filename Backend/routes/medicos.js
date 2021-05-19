/*
    Medicos
    PATH: '/api/medicos'
*/
const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const { validarJWT } = require('../middlewares/validar-jwt');
const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedicosById } = require('../controllers/medicos')

const router = Router();

router.get( '/' , validarJWT, getMedicos );

router.post( '/',
    [ 
        validarJWT,
        check('nombre', 'El nombre del Medico es necesario').not().isEmpty(),
        check('hospital', 'El Id del Hospital debe ser valido es necesario').isMongoId(),
        validarCampos    
    ], 
    crearMedico 
 ); 

 router.put( '/:id',
    [ 
        validarJWT,
        check('nombre', 'El nombre del Medico es necesario').not().isEmpty(),
        check('nombre', 'El Id del Hospital es necesario').not().isEmpty(),
        validarCampos
    ],
    actualizarMedico 
);

 router.delete( '/:id',
    validarJWT,
    borrarMedico 
);

router.get( '/:id',
    validarJWT,
    getMedicosById 
);

module.exports = router; 
