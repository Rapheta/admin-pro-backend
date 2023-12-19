const fs = require('fs');   //File System

const Medico = require('../models/medico');
const Hospital = require('../models/hospital');
const Usuario = require('../models/usuario');

const borrarImagen = ( path ) => {
    if( fs.existsSync(path) ){
        //Borra la imagen anterior
        fs.unlinkSync( path );
    }
}

const actualizarImagen = async (tipo, id, nombreArchivo) => {

    switch( tipo )
    {
        case 'medicos':
            const medico = await Medico.findById(id);
            if( !medico )
            {
                return false;
            }

            const pathMedico = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathMedico);

            medico.img = nombreArchivo;
            await medico.save();

            return true;

            break;

        case 'hospitales':

            const hospital = await Hospital.findById(id);
            if( !hospital )
            {
                return false;
            }

            const pathHospital = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathHospital);

            hospital.img = nombreArchivo;
            await hospital.save();

            return true;
            break;

        case 'usuarios':

            const usuario = await Usuario.findById(id);
            if( !usuario )
            {
                return false;
            }

            const pathUsuario = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathUsuario);

            usuario.img = nombreArchivo;
            await usuario.save();

            return true;
            break;
    }

}

module.exports = {
    actualizarImagen
}