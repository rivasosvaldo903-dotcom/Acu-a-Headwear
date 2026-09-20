let carrito = [];
const ENLACE_PAGO_MERCADO_PAGO = "";
let temporizadorNotificacion;


// AGREGAR PRODUCTO

function agregarCarrito(nombre, precio) {

    carrito.push({
        nombre: nombre,
        precio: precio
    });

    actualizarCarrito();

    mostrarNotificacion(nombre);
}

function mostrarNotificacion(nombre) {
    const notificacion = document.getElementById("notificacion-carrito");
    const productoAgregado = document.getElementById("producto-agregado");

    productoAgregado.textContent = nombre;
    notificacion.classList.add("visible");

    clearTimeout(temporizadorNotificacion);
    temporizadorNotificacion = setTimeout(cerrarNotificacion, 4500);
}

function cerrarNotificacion() {
    document.getElementById("notificacion-carrito").classList.remove("visible");
}


// ACTUALIZAR CARRITO

function actualizarCarrito() {

    const contador = document.getElementById("contador");
    const productos = document.getElementById("productos-carrito");
    const total = document.getElementById("total");

    contador.textContent = carrito.length;

    if (carrito.length === 0) {

        productos.innerHTML =
            "<p>Tu carrito está vacío.</p>";

        total.textContent = "0";

        return;
    }


    productos.innerHTML = "";

    let totalCompra = 0;


    carrito.forEach((producto, index) => {

        totalCompra += producto.precio;

        productos.innerHTML += `

            <div class="cart-item">

                <span>
                    ${producto.nombre}
                </span>

                <strong>
                    $${producto.precio}
                </strong>

            </div>

        `;

    });


    total.textContent = totalCompra;
}


// ABRIR CARRITO

function mostrarCarrito() {

    document.getElementById("carrito").style.display =
        "flex";

}


// CERRAR CARRITO

function cerrarCarrito() {

    document.getElementById("carrito").style.display =
        "none";

}


// CONTACTO

function contactar() {

    window.open(
        "https://wa.me/528771182967",
        "_blank"
    );

}


function crearResumenPedido(datos) {
    const totalCompra = carrito.reduce((total, producto) => total + producto.precio, 0);
    const productos = carrito.map(producto => `${producto.nombre} - $${producto.precio} MXN`).join("\n");

    return `Hola, quiero realizar el siguiente pedido:

${productos}

Total: $${totalCompra} MXN
Nombre: ${datos.nombre}
Teléfono: ${datos.telefono}
Dirección: ${datos.direccion}`;
}

function enviarPedidoPorWhatsApp(datos) {
    const mensaje = crearResumenPedido(datos) + "\nForma de pago: Transferencia bancaria";

    window.open(
        "https://wa.me/528771182967?text=" + encodeURIComponent(mensaje),
        "_blank"
    );
}

function comprar(evento) {
    evento.preventDefault();

    if (carrito.length === 0) {

        alert("Tu carrito está vacío.");

        return;
    }

    const datos = Object.fromEntries(new FormData(evento.target));

    if (datos.metodoPago === "transferencia") {
        enviarPedidoPorWhatsApp(datos);
        return;
    }

    if (!ENLACE_PAGO_MERCADO_PAGO) {
        alert("Configura tu link de pago de Mercado Pago en script.js para activar el cobro en línea.");
        return;
    }

    const urlPago = new URL(ENLACE_PAGO_MERCADO_PAGO);
    urlPago.searchParams.set("external_reference", datos.telefono);
    window.open(urlPago.toString(), "_blank");
}


document.getElementById("checkout-form").addEventListener("submit", comprar);