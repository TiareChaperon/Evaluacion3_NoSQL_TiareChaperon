window.onload = function () {
    obtenerDataUsuarios();
};

async function obtenerDataUsuarios() {
    try {
        const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');
        if (respuesta.ok) {
            const usuarios = await respuesta.json();

            console.log(usuarios);

            new DataTable('#tablaUsuarios', {
                data: usuarios,
                columns: [
                    { data: 'nombre' },
                    { data: 'rut' },
                    { data: null, render: data => data.paisOrigen?.[0]?.nombre || data.nacionalidad || '' },
                    { data: null, render: data => data.correo || data.email || '' },
                    { data: null, render: data => data.telefono || data.celular || '' },
                    { data: 'fechaNacimiento' }
                ]
            });
        }
    } catch (error) {
        console.log('Error al cargar los datos: ', error)
    }
};

