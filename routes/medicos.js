/*
    Ruta: /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');


const { getMedicos, crearMedico, actualizarMedico, borrarMedico } = require('../controllers/medicos');

const router = Router();

router.get( '/', getMedicos );

router.post( '/',
    [
        validarJWT,
        check('nombre','El nombre del médico es obligatorio').not().isEmpty(),
        check('hospital','El hospital debe de ser válido').isMongoId(),
        validarCampos   //Tiene que estar siempre al final
    ],
    crearMedico );

router.put( '/:id',
    [],
    actualizarMedico );

router.delete( '/:id', borrarMedico );


module.exports = router;