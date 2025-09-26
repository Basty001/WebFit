document.addEventListener('DOMContentLoaded', function () {
  
  // --- LÓGICA PARA CAMBIO DE PESTAÑAS ---
  const tabProductos = document.getElementById('tab-productos');
  const tabUsuarios = document.getElementById('tab-usuarios');
  const sectionProductos = document.getElementById('section-productos');
  const sectionUsuarios = document.getElementById('section-usuarios');

  tabProductos.addEventListener('click', (e) => { 
    e.preventDefault(); 
    sectionProductos.classList.remove('d-none'); 
    sectionUsuarios.classList.add('d-none'); 
    tabProductos.classList.add('active'); 
    tabUsuarios.classList.remove('active'); 
  });
  tabUsuarios.addEventListener('click', (e) => { 
    e.preventDefault(); 
    sectionUsuarios.classList.remove('d-none'); 
    sectionProductos.classList.add('d-none'); 
    tabUsuarios.classList.add('active'); 
    tabProductos.classList.remove('active'); 
  });

  // --- INICIALIZACIÓN DE DATOS (productos y usuarios por defecto) ---
  function inicializarDatos() {
    if (!localStorage.getItem('productos')) {
      const productosIniciales = [
        { id: 1, nombre: 'Proteína Whey', precio: 25000, descripcion: 'La mejor proteína para recuperación muscular.', imagen: 'asset/img/proteina.jpg', stock: 50 },
        { id: 2, nombre: 'Guantes Pro', precio: 10000, descripcion: 'Guantes con muñequera para máximo soporte.', imagen: 'asset/img/guantes.jpg', stock: 100 },
        { id: 3, nombre: 'Botella Térmica', precio: 5000, descripcion: 'Mantiene tus líquidos fríos por 24 horas.', imagen: 'asset/img/botella.jpg', stock: 80 }
      ];
      localStorage.setItem('productos', JSON.stringify(productosIniciales));
    }
    
    if (!localStorage.getItem('usuarios')) {
      const usuariosIniciales = [ 
        { id: 1, nombre: 'Juan Pérez', rut: '12345678-9', email: 'juan@test.com', telefono: '987654321', password: '123' }
      ];
      localStorage.setItem('usuarios', JSON.stringify(usuariosIniciales));
    }
  }

  // --- CARGAR PRODUCTOS ---
  const tablaProductosBody = document.getElementById('tabla-productos-body');
  const formAddProducto = document.getElementById('form-add-producto');
  const btnCancelarEdicionProducto = document.getElementById('btn-cancelar-edicion-producto');
  const productoIdInput = document.getElementById('producto-id');
  
  function cargarProductos() {
    const productos = JSON.parse(localStorage.getItem('productos')) || [];
    tablaProductosBody.innerHTML = '';
    productos.forEach(p => {
      const fila = `<tr><td>${p.id}</td><td>${p.nombre}</td><td>$${p.precio.toLocaleString()}</td><td>${p.stock}</td><td><button class="btn btn-sm btn-outline-info btn-editar-producto me-2" data-id="${p.id}">Editar</button><button class="btn btn-sm btn-outline-danger btn-eliminar-producto" data-id="${p.id}">Eliminar</button></td></tr>`;
      tablaProductosBody.innerHTML += fila;
    });
  }

  // Lógica para editar producto
  function editarProducto(id) {
    const producto = (JSON.parse(localStorage.getItem('productos')) || []).find(p => p.id === id);
    if (producto) {
        document.getElementById('form-producto-titulo').textContent = 'Editar Producto';
        productoIdInput.value = producto.id;
        document.getElementById('producto-nombre').value = producto.nombre;
        document.getElementById('producto-precio').value = producto.precio;
        document.getElementById('producto-imagen').value = producto.imagen;
        document.getElementById('producto-descripcion').value = producto.descripcion;
        document.getElementById('producto-stock').value = producto.stock;
        formAddProducto.classList.remove('d-none');
        btnCancelarEdicionProducto.classList.remove('d-none');
    }
  }

  // Resetear formulario
  function resetFormularioProducto() {
    document.getElementById('form-producto-titulo').textContent = 'Nuevo Producto';
    formAddProducto.reset();
    productoIdInput.value = '';
    formAddProducto.classList.add('d-none');
    btnCancelarEdicionProducto.classList.add('d-none');
    formAddProducto.classList.remove('was-validated');
  }

  // Guardar producto (nuevo o editado)
  formAddProducto.addEventListener('submit', function (event) {
    event.preventDefault();
    if (formAddProducto.checkValidity()) {
        const productos = JSON.parse(localStorage.getItem('productos')) || [];
        const id = parseInt(productoIdInput.value);
        if (id) {
            const index = productos.findIndex(p => p.id === id);
            if(index !== -1) {
                productos[index].nombre = document.getElementById('producto-nombre').value;
                productos[index].precio = parseInt(document.getElementById('producto-precio').value);
                productos[index].imagen = document.getElementById('producto-imagen').value;
                productos[index].descripcion = document.getElementById('producto-descripcion').value;
                productos[index].stock = parseInt(document.getElementById('producto-stock').value);
            }
        } else {
            const nuevoProducto = { 
              id: Date.now(), 
              nombre: document.getElementById('producto-nombre').value, 
              precio: parseInt(document.getElementById('producto-precio').value), 
              imagen: document.getElementById('producto-imagen').value,
              descripcion: document.getElementById('producto-descripcion').value,
              stock: parseInt(document.getElementById('producto-stock').value)
            };
            productos.push(nuevoProducto);
        }
        localStorage.setItem('productos', JSON.stringify(productos));
        cargarProductos();
        resetFormularioProducto();
    }
    formAddProducto.classList.add('was-validated');
  });

  // Eliminar producto
  tablaProductosBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-editar-producto')) {
      editarProducto(parseInt(event.target.dataset.id));
    }
    if (event.target.classList.contains('btn-eliminar-producto')) {
      if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        let productos = JSON.parse(localStorage.getItem('productos')) || [];
        productos = productos.filter(p => p.id !== parseInt(event.target.dataset.id));
        localStorage.setItem('productos', JSON.stringify(productos));
        cargarProductos();
      }
    }
  });

  document.getElementById('btn-show-form-producto').addEventListener('click', () => { 
    resetFormularioProducto(); 
    formAddProducto.classList.toggle('d-none'); 
  });

  btnCancelarEdicionProducto.addEventListener('click', resetFormularioProducto);

  // --- CARGAR USUARIOS ---
  const tablaUsuariosBody = document.getElementById('tabla-usuarios-body');
  const formAddUsuario = document.getElementById('form-add-usuario');
  const btnCancelarEdicionUsuario = document.getElementById('btn-cancelar-edicion-usuario');
  const usuarioIdInput = document.getElementById('usuario-id');
  
  function cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    tablaUsuariosBody.innerHTML = '';
    usuarios.forEach(u => {
      const fila = `<tr><td>${u.id}</td><td>${u.nombre}</td><td>${u.rut}</td><td>${u.email}</td><td>${u.telefono}</td><td><button class="btn btn-sm btn-outline-info btn-editar-usuario me-2" data-id="${u.id}">Editar</button><button class="btn btn-sm btn-outline-danger btn-eliminar-usuario" data-id="${u.id}">Eliminar</button></td></tr>`;
      tablaUsuariosBody.innerHTML += fila;
    });
  }

  // Lógica para editar usuario
  function editarUsuario(id) {
    const usuario = (JSON.parse(localStorage.getItem('usuarios')) || []).find(u => u.id === id);
    if (usuario) {
      document.getElementById('form-usuario-titulo').textContent = 'Editar Usuario';
      usuarioIdInput.value = usuario.id;
      document.getElementById('usuario-nombre').value = usuario.nombre;
      document.getElementById('usuario-email').value = usuario.email;
      document.getElementById('usuario-telefono').value = usuario.telefono;
      formAddUsuario.classList.remove('d-none');
      btnCancelarEdicionUsuario.classList.remove('d-none');
    }
  }

  // Resetear formulario
  function resetFormularioUsuario() {
    document.getElementById('form-usuario-titulo').textContent = 'Nuevo Usuario';
    formAddUsuario.reset();
    usuarioIdInput.value = '';
    formAddUsuario.classList.add('d-none');
    btnCancelarEdicionUsuario.classList.add('d-none');
    formAddUsuario.classList.remove('was-validated');
  }

 formAddUsuario.addEventListener('submit', function (event) {
    event.preventDefault();

    // Usar trim para limpiar espacios
    const emailInput = document.getElementById('usuario-email').value.trim();
    const nombreInput = document.getElementById('usuario-nombre').value.trim();
    const telefonoInput = document.getElementById('usuario-telefono').value.trim();
    const password = document.getElementById('password').value.trim();// Nueva línea para obtener el valor del campo de contraseña

    // Regex de dominio permitido
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/;

    let error = false;

    // Validaciones
    if (!nombreInput) {
        alert("Debes ingresar un nombre.");
        error = true;
    }

    if (!emailRegex.test(emailInput)) {
        alert("El correo debe ser de los dominios permitidos: @duoc.cl, @profesor.duoc.cl o @gmail.com");
        error = true;
    }

      // Validación de contraseña (mínimo 4, máximo 10 caracteres)
    if (password.length < 4 || password.length > 10) {
        alert('La contraseña debe tener entre 4 y 10 caracteres.');
        return;
    } // Fin de la nueva validación

    if (!telefonoInput) {
        alert("Debes ingresar un número de teléfono.");
        error = true;
    }


    if (error) {
        formAddUsuario.classList.add('was-validated'); // muestra feedback de HTML
        return; // Detiene el submit si hay error
    }

    // Guardar usuario
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const id = parseInt(usuarioIdInput.value);

    if (id) {
        // Editar existente
        const index = usuarios.findIndex(u => u.id === id);
        if (index !== -1) {
            usuarios[index].nombre = nombreInput;
            usuarios[index].email = emailInput;
            usuarios[index].telefono = telefonoInput;
        }
    } else {
        // Crear nuevo usuario
        usuarios.push({
            id: Date.now(),
            nombre: nombreInput,
            email: emailInput,
            telefono: telefonoInput
        });
    }

    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    cargarUsuarios();
    resetFormularioUsuario();
});



  // Eliminar usuario
  tablaUsuariosBody.addEventListener('click', (event) => {
    if (event.target.classList.contains('btn-editar-usuario')) {
      editarUsuario(parseInt(event.target.dataset.id));
    }
    if (event.target.classList.contains('btn-eliminar-usuario')) {
      if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
        let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
        usuarios = usuarios.filter(u => u.id !== parseInt(event.target.dataset.id));
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        cargarUsuarios();
      }
    }
  });

  document.getElementById('btn-show-form-usuario').addEventListener('click', () => { 
    resetFormularioUsuario(); 
    formAddUsuario.classList.toggle('d-none'); 
  });

  btnCancelarEdicionUsuario.addEventListener('click', resetFormularioUsuario);

  // Inicializar datos y cargar listas
  inicializarDatos();
  cargarProductos();
  cargarUsuarios();
});
