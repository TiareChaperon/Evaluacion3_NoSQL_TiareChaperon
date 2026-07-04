// Instanciamos/Importamos las depedencias necesarias y las almacenamos en una constante
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Iniciamos nuestra aplicación express
const aplicacion = express();
const puerto = 3000;

// Instanciamos las depedencias de la aplicación
aplicacion.use(cors());
aplicacion.use(express.json());

// Crear la conexión con DB
mongoose.connect('mongodb://localhost:27017/AP-N3-C2')
    .then(() => console.log('Conexión Exitosa!'))
    .catch((excepcion) => console.log('No ha sido posible conectarse con la DB, error ocurrido: ', excepcion));

const PORT = process.env.PORT || 3000;
aplicacion.listen(PORT, 'localhost', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

const direccion = new mongoose.Schema({
    comuna: String,
    calle: String,
    numero: String,
    departamento: String
});

const usuario = new mongoose.Schema({
    nombre: { type: String, required: true },
    rut: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: String,
    fechaNacimiento: { type: Date, required: true },
    nacionalidad: { type: String, required: true, minlength: 2, maxlength: 2 },
    genero: { type: String, enum: ['M', 'F', 'O'] },
    direccion: {
        comuna: { type: String, required: true },
        calle: { type: String, required: true },
        numero: { type: String, required: true },
        departamento: String
    },
    contrasena: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date.now },
    activo: { type: Boolean, default: true }
});

const Usuario = mongoose.model('Usuario', usuario, 'usuarios');

const dispositivoElectronicoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuarios',
        required: true
    },
    tipo: { type: String, required: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    serie: { type: String, required: true },
    fechaCompra: Date,
    garantiaMeses: Number,
    sistemaOperativo: String,
    estado: String,
    valor: Number
});

const DispositivoElectronico = mongoose.model(
    'DispositivoElectronico',
    dispositivoElectronicoSchema,
    'dispositivosElectronicos'
);

const pais = new mongoose.Schema({
    nombre: String,
    iso2: String,
    iso3: String,
    codigoPais: String,
    nacionalidad: String
});


const Pais = mongoose.model('Pais', pais, 'paises');

aplicacion.post('/guardarUsuario', async (req, res) => {
    console.log('ENTRÓ A GUARDAR USUARIO');
    console.log(req.body);

    try {
        console.log('DATOS RECIBIDOS:', req.body);

        const {
            nombre,
            rut,
            nacionalidad,
            correo,
            telefono,
            fechaNacimiento,
            genero,
            contrasena,
            direccion
        } = req.body;

        const hash = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            rut,
            nacionalidad,
            correo,
            telefono,
            fechaNacimiento,
            genero,
            contrasena: hash,
            direccion
        });

        await nuevoUsuario.save();

        res.status(200).json({ mensaje: 'Datos almacenados correctamente.' });
    } catch (error) {
        console.log('ERROR GUARDAR USUARIO:', error);

        res.status(500).json({
            mensaje: 'No se han podido guardar los datos.',
            error: error.toString()
        });
    }

});

aplicacion.get('/obtenerUsuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.aggregate([{
            $lookup: {
                from: 'paises', // Colección que tiene los datos que aagregaremos
                localField: 'nacionalidad', // Campo que contiene los datos relacionados a la segunda colección
                foreignField: 'iso2', // campo de la colección secundaria registrado en la colección primaria
                as: 'paisOrigen'
            }
        }]);
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos. ', error });
    }
});

aplicacion.get('/obtenerPaises', async (req, res) => {
    try {
        const paises = await Pais.find();
        res.json(paises);
    } catch (error) {
        res.status(500).json({ mensaje: 'No se han podido obtener los datos. ', error });
    }
});

aplicacion.post('/guardarDispositivo', async (req, res) => {
    try {
        const nuevoDispositivo = new DispositivoElectronico(req.body);
        await nuevoDispositivo.save();

        res.status(200).json({
            mensaje: 'Dispositivo guardado correctamente.'
        });
    } catch (error) {
        res.status(500).json({
            mensaje: 'No se pudo guardar el dispositivo.',
            error: error.message
        });
    }
});


aplicacion.get('/obtenerDispositivos', async (req, res) => {
    try {
        const dispositivos = await DispositivoElectronico.aggregate([
            {
                $lookup: {
                    from: 'usuarios',
                    localField: 'usuario',
                    foreignField: '_id',
                    as: 'datosUsuario'
                }
            },
            {
                $unwind: '$datosUsuario'
            }
        ]);

        res.json(dispositivos);
    } catch (error) {
        res.status(500).json({
            mensaje: 'No se pudieron obtener los dispositivos.',
            error: error.message
        });
    }
});
