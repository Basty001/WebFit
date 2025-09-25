document.addEventListener('DOMContentLoaded', function() {

    // --- Manejo de sesión ---
    function gestionarSesion() {
        const adminLogueado = localStorage.getItem('adminLogueado');
        const usuarioLogueado = sessionStorage.getItem('usuarioLogueado');
        const loginContainer = document.getElementById('login-container');
        if (!loginContainer) return;

        if (adminLogueado === 'true') {
            loginContainer.innerHTML = `
          <div class="dropdown">
            <button class="btn btn-outline-warning dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Hola, Admin
            </button>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="admin.html">Panel de Control</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" id="logout-btn-admin">Cerrar Sesión</a></li>
            </ul>
          </div>`;
            document.getElementById('logout-btn-admin').addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('¿Quieres cerrar tu sesión de administrador?')) {
                    localStorage.removeItem('adminLogueado');
                    window.location.href = 'index.html';
                }
            });
        } else if (usuarioLogueado) {
            loginContainer.innerHTML = `
          <div class="dropdown">
            <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
              Hola, ${usuarioLogueado}
            </button>
            <ul class="dropdown-menu dropdown-menu-dark">
              <li><a class="dropdown-item" href="perfil.html">Ver Perfil</a></li>
              <li><hr class="dropdown-divider"></li>
              <li><a class="dropdown-item" href="#" id="logout-btn-user">Cerrar Sesión</a></li>
            </ul>
          </div>`;
            document.getElementById('logout-btn-user').addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('¿Quieres cerrar sesión?')) {
                    sessionStorage.removeItem('usuarioLogueado');
                    window.location.href = 'index.html';
                }
            });
        }
    }

    // --- Formulario Planes ---
    function inicializarFormularioPlanes() {
        const form = document.getElementById('form-inscripcion');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            document.getElementById('mensajeExito').classList.remove('d-none');
            setTimeout(() => window.location.href = "index.html", 2000);
        });
    }

    // --- Tienda ---
    function inicializarTienda() {
        const productGrid = document.getElementById('product-grid');
        if (!productGrid) return;

        // --- Cargar productos, asegurando que tengan datos válidos ---
        let productos = []; // Inicializamos como un array vacío

        try {
            // Intentamos obtener y parsear los productos guardados
            const productosGuardados = JSON.parse(localStorage.getItem('productos'));
            // Verificamos que lo que obtuvimos sea realmente un array
            if (Array.isArray(productosGuardados)) {
                productos = productosGuardados;
            }
        } catch (e) {
            // Si hay un error al parsear (JSON inválido), lo ignoramos y 'productos' seguirá siendo un array vacío.
            console.error("Error al leer productos del localStorage:", e);
        }

        // Comprobamos si hay productos o si los datos existentes están incompletos
        const datosIncompletos = productos.some(p => !p.nombre || !p.precio || !p.imagen);

        if (productos.length === 0 || datosIncompletos) {
            const productosPredeterminados = [{
                    id: 1,
                    nombre: "Mancuernas Ajustables",
                    precio: 45000,
                    imagen: "asset",
                    descripcion: "Mancuernas ajustables de 2 a 24 kg. Ideales para entrenamiento en casa.",
                    stock: 20
                },
                {
                    id: 2,
                    nombre: "Colchoneta Yoga",
                    precio: 12000,
                    imagen: "https://www.ironside.cl/cdn/shop/files/mmexport1736342993067_5b0bdeb1-d8e5-4b49-91b1-705dc88f676b.png?v=1744220563&width=1000",
                    descripcion: "Colchoneta antideslizante, perfecta para yoga, pilates y estiramientos.",
                    stock: 20
                },
                {
                    id: 3,
                    nombre: "Banda Elástica",
                    precio: 8000,
                    imagen: "https://www.ironside.cl/cdn/shop/files/PowerBandsPack-7_8eb3c46f-1233-4279-8c6b-0b7557fdbb04.jpg?v=1744213833&width=1000",
                    descripcion: "Banda de resistencia de alta durabilidad para entrenamiento de fuerza.",
                    stock: 20
                },
                {
                    id: 4,
                    nombre: "Botella Deportiva",
                    precio: 6000,
                    imagen: "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/dffb7992446842a98f73aa860118cfee_9366/Botella_Hidratante_Performance_075_Litros_Negro_FM9931_01_00_standard.jpg",
                    descripcion: "Botella deportiva 750ml libre de BPA, perfecta para el gimnasio.",
                    stock: 20
                },
                {
                    id: 5,
                    nombre: "Guantes de Gimnasio",
                    precio: 15000,
                    imagen: "https://media.falabella.com/falabellaCL/123371005_01/w=1500,h=1500,fit=pad",
                    descripcion: "Guantes acolchados para proteger tus manos durante el levantamiento de pesas.",
                    stock: 20
                }
            ];
            // Guardamos los productos predeterminados en localStorage y en nuestra variable local
            localStorage.setItem('productos', JSON.stringify(productosPredeterminados));
            productos = productosPredeterminados;
        } else {
            // Asegurar que todos los productos tengan stock (para datos antiguos)
            productos = productos.map(p => {
                if (typeof p.stock === "undefined") {
                    p.stock = 20; // Asignamos un stock por defecto si no lo tiene
                }
                return p;
            });
            // Opcional: Volver a guardar en localStorage para que todos los productos tengan stock
            localStorage.setItem('productos', JSON.stringify(productos));
        }

        function renderizarProductos() {
            productGrid.innerHTML = '';
            if (productos.length === 0) {
                productGrid.innerHTML = '<p class="text-center text-muted">Aún no hay productos.</p>';
                return;
            }

            productos.forEach(prod => {
                console.log(prod); // Verifica los datos de cada producto
                productGrid.innerHTML += `
                  <div class="col-12 col-md-6 col-lg-4">
                      <div class="card bg-black text-light h-100 shadow-sm border-secondary d-flex flex-column">
                          <img src="${prod.imagen}" class="card-img-top" alt="${prod.nombre}" style="height: 250px; object-fit: contain;">
                          <div class="card-body text-center d-flex flex-column">
                              <h5 class="card-title text-warning">${prod.nombre}</h5>
                              <p class="card-text fw-bold fs-5">$${prod.precio.toLocaleString()}</p>
                              <p class="text-muted">Stock: ${prod.stock}</p>
                              <button class="btn btn-outline-warning mt-auto"
                                  data-bs-toggle="modal"
                                  data-bs-target="#modalProducto"
                                  data-id="${prod.id}"
                                  data-nombre="${prod.nombre}"
                                  data-precio="${prod.precio}"
                                  data-imagen="${prod.imagen}"
                                  data-stock="${prod.stock}"
                                  data-descripcion="${prod.descripcion || 'Descripción no disponible.'}">
                                  Ver más
                              </button>
                          </div>
                      </div>
                  </div>`;
            });
        }


        // --- Variables del carrito ---
        const modalProducto = document.getElementById('modalProducto');
        const btnAddCart = document.getElementById('btnAddCart');
        const inputCantidad = document.getElementById('cantidadProducto');
        const cartItemsUl = document.getElementById('cart-items');
        const cartTotalSpan = document.getElementById('cart-total');
        const cartCountBadge = document.getElementById('cart-count');
        const cartCountPanel = document.getElementById('cart-count-panel');
        const cartPanel = document.getElementById('cart-panel');
        const cartBtn = document.getElementById('cart-btn');
        const formRetiro = document.getElementById('form-retiro');

        let carrito = [];

        // --- Modal Producto ---
        if (modalProducto) {
            modalProducto.addEventListener('show.bs.modal', function(event) {
                const button = event.relatedTarget;
                const id = button.getAttribute('data-id');
                const nombre = button.getAttribute('data-nombre');
                const precio = button.getAttribute('data-precio');
                const imagen = button.getAttribute('data-imagen');
                const descripcion = button.getAttribute('data-descripcion');
                const stock = button.getAttribute('data-stock');

                modalProducto.querySelector('#modalTitle').textContent = nombre;
                modalProducto.querySelector('#modalImagen').src = imagen;
                modalProducto.querySelector('#modalDescripcion').textContent = descripcion;
                modalProducto.querySelector('#modalPrecio').textContent = parseInt(precio).toLocaleString();
                modalProducto.querySelector('#modalStock').textContent = stock;

                btnAddCart.dataset.id = id;
                btnAddCart.dataset.nombre = nombre;
                btnAddCart.dataset.precio = precio;
                btnAddCart.dataset.stock = stock;

                inputCantidad.value = 1;
                inputCantidad.max = stock;
            });

            btnAddCart.addEventListener('click', function() {
                const id = btnAddCart.dataset.id;
                const nombre = btnAddCart.dataset.nombre;
                const precio = parseInt(btnAddCart.dataset.precio);
                const stock = parseInt(btnAddCart.dataset.stock);
                const cantidad = parseInt(inputCantidad.value);

                if (cantidad > stock) {
                    alert("No puedes agregar más del stock disponible.");
                    return;
                }

                const existente = carrito.find(item => item.id === id);
                if (existente) {
                    if (existente.cantidad + cantidad > stock) {
                        alert("Supera el stock disponible.");
                        return;
                    }
                    existente.cantidad += cantidad;
                } else {
                    carrito.push({ id, nombre, precio, cantidad, stock });
                }

                actualizarVistaCarrito();
                bootstrap.Modal.getInstance(modalProducto).hide();
            });
        }

        // --- Vista Carrito ---
        function actualizarVistaCarrito() {
            cartItemsUl.innerHTML = '';
            let total = 0;
            carrito.forEach((item, index) => {
                total += item.precio * item.cantidad;
                const li = document.createElement('li');
                li.className = 'd-flex justify-content-between align-items-center mb-2';
                li.innerHTML = `
            <div>
              <span>${item.nombre} (x${item.cantidad})</span><br>
              <small>$${(item.precio * item.cantidad).toLocaleString()}</small>
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary btn-restar" data-index="${index}">-</button>
              <button class="btn btn-sm btn-outline-secondary btn-sumar" data-index="${index}">+</button>
              <button class="btn btn-sm btn-outline-danger btn-eliminar" data-index="${index}">&times;</button>
            </div>`;
                cartItemsUl.appendChild(li);
            });

            cartItemsUl.querySelectorAll('.btn-restar').forEach(btn => {
                btn.addEventListener('click', e => {
                    const i = parseInt(e.target.dataset.index);
                    if (carrito[i].cantidad > 1) carrito[i].cantidad -= 1;
                    else carrito.splice(i, 1);
                    actualizarVistaCarrito();
                });
            });

            cartItemsUl.querySelectorAll('.btn-sumar').forEach(btn => {
                btn.addEventListener('click', e => {
                    const i = parseInt(e.target.dataset.index);
                    if (carrito[i].cantidad < carrito[i].stock) carrito[i].cantidad += 1;
                    else alert("No hay más stock disponible.");
                    actualizarVistaCarrito();
                });
            });

            cartItemsUl.querySelectorAll('.btn-eliminar').forEach(btn => {
                btn.addEventListener('click', e => {
                    const i = parseInt(e.target.dataset.index);
                    carrito.splice(i, 1);
                    actualizarVistaCarrito();
                });
            });

            cartTotalSpan.textContent = total.toLocaleString();
            cartCountBadge.textContent = carrito.reduce((acc, item) => acc + item.cantidad, 0);
            cartCountPanel.textContent = cartCountBadge.textContent;
        }

        if (cartBtn) cartBtn.addEventListener('click', () => cartPanel.classList.toggle('active'));

        // --- Checkout ---
        if (formRetiro) {
            formRetiro.addEventListener('submit', (e) => {
                e.preventDefault();
                e.stopPropagation();

                if (!formRetiro.checkValidity()) {
                    formRetiro.classList.add('was-validated');
                    return;
                }

                if (carrito.length === 0) {
                    alert('Tu carrito está vacío.');
                    return;
                }

                const nombre = document.getElementById('nombreRetiro').value.trim();
                const sucursal = document.getElementById('sucursalRetiro').value;

                alert(`¡Perfecto, ${nombre}! Tu pedido estará listo para ser retirado en ${sucursal} en 48 horas.`);

                carrito = [];
                actualizarVistaCarrito();
                formRetiro.reset();
                formRetiro.classList.remove('was-validated');
                cartPanel.classList.remove('active');
            });
        }

        renderizarProductos();
    }

    // --- Inicialización ---
    gestionarSesion();
    inicializarFormularioPlanes();
    inicializarTienda();
});