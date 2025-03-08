// Variables globales
const d = document
const nombrePro = d.querySelector("#nombrePro")
const precioPro = d.querySelector("#precioPro")
const descripcionPro = d.querySelector("#descripcionPro")
const imagenPro = d.querySelector("#imagenPro")
const btnGuardad = d.querySelector(".btnGuardad")
let btnActualizar = d.querySelector(".btnActualizar")
const btnPdf = d.querySelector(".btnPdf")
const btnFiltrar = d.querySelector("#btnFiltrar")
const filterType = d.querySelector("#filterType")
const filterValue = d.querySelector("#filterValue")
const tabla = d.querySelector(".table tbody")

// Evento para guardar productos
btnGuardad.addEventListener("click", (e) => {
  e.preventDefault()
  validarDatos()
  borrarTabla()
  mostrarDatos()
})

// Mostrar productos al cargar la página
d.addEventListener("DOMContentLoaded", () => {
  borrarTabla()
  mostrarDatos()
})

// Función para validar datos del formulario
function validarDatos() {
  let producto
  if (nombrePro.value && precioPro.value && descripcionPro.value && imagenPro.value) {
    producto = {
      nombre: nombrePro.value,
      precio: precioPro.value,
      descripcion: descripcionPro.value,
      imagen: imagenPro.value,
    }

    console.log(producto)
    guardarDatos(producto)
  } else {
    alert("Todos los campos son obligatorios ☣️")
    return
  }

  nombrePro.value = ""
  precioPro.value = ""
  descripcionPro.value = ""
  imagenPro.value = ""
}

// Guardar en localStorage
function guardarDatos(pro) {
  const productos = JSON.parse(localStorage.getItem("productos")) || []
  productos.push(pro)
  localStorage.setItem("productos", JSON.stringify(productos))
  alert("Producto guardado con éxito 👌")
}

// Mostrar productos en la tabla
function mostrarDatos(productosAMostrar) {
  const productos = productosAMostrar || JSON.parse(localStorage.getItem("productos")) || []
  productos.forEach((prod, i) => {
    const fila = d.createElement("tr")
    fila.innerHTML = `
            <td>${i + 1}</td>
            <td>${prod.nombre}</td>
            <td>${prod.precio}</td>
            <td>${prod.descripcion}</td>
            <td>
                <img src="${prod.imagen}" width="30%" alt="Fotico">
            </td>
            <td>
                <span onclick="actualizarProducto(${i})" class="btn btn-editar"> 🖋️ </span>
                <span onclick="eliminarPedido(${i})" class="btn btn-eliminar"> ❎ </span>
            </td>
        `
    tabla.appendChild(fila)
  })
}

// Eliminar producto
function eliminarPedido(pos) {
  const productos = JSON.parse(localStorage.getItem("productos")) || []
  const nombreProducto = productos[pos].nombre
  const confirmar = confirm(`¿Deseas eliminar ${nombreProducto} de la lista?`)

  if (confirmar) {
    productos.splice(pos, 1)
    localStorage.setItem("productos", JSON.stringify(productos))
    alert(`${nombreProducto} eliminado de la lista.`)
    borrarTabla()
    mostrarDatos()
  }
}

// Quitar datos de la tabla
function borrarTabla() {
  const filas = d.querySelectorAll(".table tbody tr")
  filas.forEach((f) => f.remove())
}

// Actualizar producto
function actualizarProducto(pos) {
  const productos = JSON.parse(localStorage.getItem("productos")) || []
  nombrePro.value = productos[pos].nombre
  precioPro.value = productos[pos].precio
  descripcionPro.value = productos[pos].descripcion
  imagenPro.value = productos[pos].imagen

  btnActualizar.classList.remove("d-none")
  btnGuardad.classList.add("d-none")

  const nuevoBtn = btnActualizar.cloneNode(true)
  btnActualizar.replaceWith(nuevoBtn)
  btnActualizar = nuevoBtn

  btnActualizar.addEventListener("click", (e) => {
    e.preventDefault()
    productos[pos].nombre = nombrePro.value
    productos[pos].precio = precioPro.value
    productos[pos].descripcion = descripcionPro.value
    productos[pos].imagen = imagenPro.value

    localStorage.setItem("productos", JSON.stringify(productos))
    alert("El dato fue actualizado con éxito")

    nombrePro.value = ""
    precioPro.value = ""
    descripcionPro.value = ""
    imagenPro.value = ""

    btnActualizar.classList.add("d-none")
    btnGuardad.classList.remove("d-none")

    borrarTabla()
    mostrarDatos()
  })
}

// Variable para productos
let filteredProducts = []

// Filtrar productos
btnFiltrar.addEventListener("click", () => {
  const productos = JSON.parse(localStorage.getItem("productos")) || []
  filteredProducts = productos.filter((prod) => {
    if (filterType.value === "nombre") {
      return prod.nombre.toLowerCase().includes(filterValue.value.toLowerCase())
    } else if (filterType.value === "precio") {
      return prod.precio === filterValue.value
    }
  })
  borrarTabla()
  mostrarDatos(filteredProducts)
})

// Exportar a PDF
btnPdf.addEventListener("click", () => {
  const { jsPDF } = window.jspdf
  const doc = new jsPDF()
  const productos = filteredProducts.length > 0 ? filteredProducts : JSON.parse(localStorage.getItem("productos")) || []
  let y = 20

  doc.text("Lista de Productos", 10, 10)
   //Esto es para que cuando se imprima se dejen espacios en el eje Y todo se vea más bonito
  productos.forEach((prod, i) => {
    doc.setFontSize(12)
    doc.text(`${i + 1}. ${prod.nombre}`, 10, y)
    y += 7
    doc.setFontSize(10)
    doc.text(`Precio: ${prod.precio}`, 15, y)
    y += 5
    doc.text(`Descripción: ${prod.descripcion}`, 15, y)
    y += 5
    doc.text(`Imagen: ${prod.imagen}`, 15, y)
    y += 10

    if (y > 270) {
      doc.addPage()
      y = 20
    }
  })

  doc.save("productos.pdf")
})