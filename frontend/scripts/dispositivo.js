window.onload = function () {
  cargarUsuarios();
};

async function cargarUsuarios() {
  try {
    const respuesta = await fetch('http://localhost:3000/obtenerUsuarios');

    if (respuesta.ok) {
      const usuarios = await respuesta.json();

      const select = document.getElementById('selectUsuario');

      usuarios.forEach(usuario => {
        const option = document.createElement('option');
        option.value = usuario._id;
        option.textContent = usuario.nombre + ' - ' + usuario.rut;
        select.appendChild(option);
      });
    }
  } catch (error) {
    console.log(error);
  }
}

async function guardarDispositivo() {

  const formulario = document.getElementById('formularioDispositivo');
  const datos = new FormData(formulario);

  const dispositivo = Object.fromEntries(datos.entries());

  try {

    const respuesta = await fetch('http://localhost:3000/guardarDispositivo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dispositivo)
    });

    if (respuesta.ok) {
      alert('Dispositivo guardado correctamente');
      window.location.href = './datosDispositivos.html';
    } else {
      const error = await respuesta.json();
      alert(error.mensaje);
    }

  } catch (error) {
    console.log(error);
  }
}
