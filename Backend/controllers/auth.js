const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { getMenuFrontend } = require('../helpers/menu-frontend');
const { googleVerify } = require('../helpers/google-verify');

const login = async( req, res = response ) => {

    const { email, password } = req.body;

    try {

        // Verificar E-mail
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario o Password Incorrectos!'
            });
        }

        // Verificar Password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o Password Incorrectos!'
            });
        }

        // Generar TOKEN - JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token,
            menu: getMenuFrontend( usuarioDB.role )
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error: Comuniquese con el administrador del Sistema!'
        })
    }
}

const googleSignIn = async ( req, res = response ) => {
    
    const googleToken = req.body.token;

    try {

        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if ( !usuarioDB ) {
            // si no existe el usuario
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            // existe usuario
            usuario = usuarioDB;
            usuario.google = true;
        }

        // Guardar en DB
        await usuario.save();

        // Generar el TOKEN - JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            token,
            menu: getMenuFrontend( usuario.role )
        });
        
    } catch (error) {
        res.status(401).json({
            ok: false,
            msg: "error"
        });
    }
}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    // Generar el TOKEN - JWT
    const token = await generarJWT( uid );

    //Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token,
        usuario,
        menu: getMenuFrontend( usuario.role )
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}