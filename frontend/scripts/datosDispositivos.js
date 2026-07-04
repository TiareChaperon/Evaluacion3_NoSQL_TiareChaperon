window.onload = function () {
  obtenerDispositivos();
};

async function obtenerDispositivos() {

  try {

    const respuesta = await fetch('http://localhost:3000/obtenerDispositivos');

    if (respuesta.ok) {

      const dispositivos = await respuesta.json();

      console.log(dispositivos);

      new DataTable('#tablaDispositivos', {

        data: dispositivos,

        columns: [
          { data: null, render: data => data.datosUsuario?.nombre || '' },
          { data: null, render: data => data.datosUsuario?.rut || '' },
          { data: 'tipo' },
          { data: 'marca' },
          { data: 'modelo' },
          { data: 'serie' },
          { data: 'sistemaOperativo' },
          { data: 'estado' },
          { data: 'valor' }
        ]

      });

    }

  } catch (error) {

    console.log('Error:', error);

  }

}
