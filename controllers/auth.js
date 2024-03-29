const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {
        
        //Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB )
        {
            return res.status(404).json({
                ok: false,
                msg: 'Credenciales no válidas'
            })
        }

        //Verificar password
        const validPassword = bcrypt.compareSync( password, usuarioDB.password );

        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña no válida'
            })
        }

        //TODO: Generar JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token: token,
            menu: getMenuFrontEnd( usuarioDB.role )
        })

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        })

    }

}

const googleSignIn = async (req, res = response) => {

    try {

        const { email, name, picture } = await googleVerify( req.body.token );

        const usuarioDB = await Usuario.findOne({ email });
        let usuario;

        if( !usuarioDB )
        {
            usuario = new Usuario({
                nombre: name,
                email: email,
                password: '@@@',
                img: picture,
                google: true
            });
        } else {
            usuario = usuarioDB;
            usuario.google = true;
        }

        //Guardar usuario
        await usuario.save();

        //TODO: Generar JWT
        const token = await generarJWT( usuario.id );

        res.json({
            ok: true,
            email: email,
            name: name,
            picture: picture,
            token: token,
            menu: getMenuFrontEnd( usuario.role )
        })

    } catch (error) {

        res.status(400).json({
            ok: false,
            msg: 'Token de Google incorrecto'
        });

    }

}

const renewToken = async (req, res = response) => {

    const uid = req.uid;

    //TODO: Generar JWT
    const token = await generarJWT( uid );

    //Obtener el usuario por UID
    const usuario = await Usuario.findById( uid );

    res.json({
        ok: true,
        token: token,
        usuario: usuario,
        menu: getMenuFrontEnd( usuario.role )
    });
}

module.exports = {
    login,
    googleSignIn,
    renewToken
}