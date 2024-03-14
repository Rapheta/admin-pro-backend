/*
    Ruta: /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const { getMedicos, crearMedico, actualizarMedico, borrarMedico, getMedico } = require('../controllers/medicos');

const router = Router();

router.get( '/', validarJWT, getMedicos );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del médico es obligatorio').not().isEmpty(),
        check('hospital','El hospital debe de ser válido').isMongoId(),
        validarCampos   //Tiene que estar siempre al final
    ],
    crearMedico );

router.put( '/:id',
    [
        validarJWT,
        check('nombre','El nombre del médico es obligatorio').not().isEmpty(),
        check('hospital','El hospital debe de ser válido').isMongoId(),
        validarCampos   //Tiene que estar siempre al final
    ],
    actualizarMedico );

router.delete( '/:id', validarJWT, borrarMedico );

router.get( '/:id', validarJWT, getMedico );


module.exports = router;