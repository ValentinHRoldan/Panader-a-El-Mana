const expresionesPedidos = {
	observaciones: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	precioTotal: /^.{1,90}$/, // 1 a 90 digitos.
}
const camposPedidos = {
	observaciones: false,
	precioTotal: false,
	
}







document.addEventListener("DOMContentLoaded", (e)=>{
    const $formulario= document.querySelector('#formulario')
    const $main= document.querySelector('#main')
    cargarTablaDesdeFormset();


    $main.addEventListener("keyup", (e) => { 
            if(e.target.matches("#id_observacion")){
                
                validarCampo(expresionesPedidos.observaciones, e.target, 'observaciones');
            }   
            else if(e.target.matches("#precioTotal")){
            
                validarCampo(expresionesPedidos.precioTotal, e.target, 'precioTotal');
            }
        });

   
        
    $formulario.addEventListener("submit",(e)=>{
        
        e.preventDefault();
        validarCampo(expresionesPedidos.observaciones, e.target, 'observaciones');
        validarCampo(expresionesPedidos.precioTotal, e.target, 'precioTotal');
        console.log(        validarCampo(expresionesPedidos.precioTotal, e.target, 'precioTotal')    )
	    if(camposPedidos.observaciones && camposPedidos.precioTotal ){
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
            document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
            setTimeout(() => {
                document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
            }, 5000);

            document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                icono.classList.remove('formulario__grupo-correcto');
            });
            
            e.target.submit();
        }
       
        else {
            document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
            }
            
       
    });



 

});





function validarCampo(expresion, input, campo){
    if(expresion.test(input.value)){
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-check-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-times-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		camposPedidos[campo] = true;
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		document.querySelector(`#grupo__${campo} i`).classList.add('fa-times-circle');
		document.querySelector(`#grupo__${campo} i`).classList.remove('fa-check-circle');
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		camposPedidos[campo] = false;
	}
    
}






function cargarTablaDesdeFormset() {
    const formsetContainer = document.getElementById('formset-container');
    const tablaBody = document.querySelector("#tableContainer tbody");
    tablaBody.innerHTML = ""; // Limpiamos el contenido previo de la tabla

    // Iterar sobre los formularios en el formset
    const forms = formsetContainer.getElementsByClassName('insumos-form');
    Array.from(forms).forEach((form, index) => {
        const insumoSelect = form.querySelectorAll('select');
        const cantidadInput = form.querySelector('input[type="number"]');

        // Verificar que el insumo y la cantidad no estén vacíos
        if (insumoSelect[0].value && insumoSelect[1].value && cantidadInput.value) {
            // Crear una nueva fila en la tabla
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td class="insumo-item">${insumoSelect[0].options[insumoSelect[0].selectedIndex].text}</td>
                <td class="cantidad-item">${cantidadInput.value}</td>
                <td class="unidad-item">${insumoSelect[1].options[insumoSelect[1].selectedIndex].text}</td>
                <td class="precio-item">
                    <input type="number" placeholder="$" class="precio-unitario">
                </td>
                <td class="precioTotal-item"></td>
            `;
            // Agregar la fila a la tabla
            tablaBody.appendChild(fila);

            // Añadir el evento para el campo de precio unitario
            const precioUnitarioInput = fila.querySelector(".precio-unitario");
            precioUnitarioInput.addEventListener("input", () => actualizarPrecioPorCantidad(fila, cantidadInput.value));
        }
    });

    // Actualizar el total cada vez que cambian los precios
    actualizarTotal();
}

// Función para calcular el precio por cantidad y actualizar el total general
function actualizarPrecioPorCantidad(fila, cantidad) {
    const precioUnitario = parseFloat(fila.querySelector(".precio-unitario").value) || 0;
    const precioPorCantidad = precioUnitario * parseFloat(cantidad);

    // Asignar el precio por cantidad a la columna correspondiente
    fila.querySelector(".precioTotal-item").textContent = `$${precioPorCantidad.toFixed(2)}`;

    // Recalcular el total general después de actualizar el precio por cantidad
    actualizarTotal();
}

// Función para calcular y setear el total general en el campo correspondiente
function actualizarTotal() {
    const tablaBody = document.querySelector("#tableContainer tbody");
    const totalFoot = document.querySelector("#foot-tr td:last-child");
    let total = 0;

    // Sumar cada precio por cantidad en la columna correspondiente
    tablaBody.querySelectorAll(".precioTotal-item").forEach(celda => {
        const precio = parseFloat(celda.textContent.replace("$", "")) || 0;
        total += precio;
    });

    // Asignar el total en la última celda del pie de la tabla y el campo de total
    totalFoot.textContent = `$${total.toFixed(2)}`;

    
    const inputTotal = document.querySelector("#precioTotal"); // Asumiendo que tienes un input con id="inputTotal"
    inputTotal.value = total.toFixed(2);
    
}