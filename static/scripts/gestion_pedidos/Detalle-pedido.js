const expresionesPedidos = {
	observaciones: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	cantidad_tabla: /^.{1,90}$/, // 1 a 90 digitos.
}


const camposPedidos = {
	observaciones: false,
	cantidad_tabla: false,
    fechaSolicitud:false,
    insumo_tabla:false,
    unidad_tabla:false
    
	
}



document.addEventListener("DOMContentLoaded", (e)=>{
 
    cargarTablaDesdeFormset();
    validarCampo(expresionesPedidos.observaciones, e.target, 'observaciones');



 

});




document.addEventListener("DOMContentLoaded", (e)=>{
    const $formulario= document.querySelector('#formulario')
    const $main= document.querySelector('#main')
    const addButton = document.getElementById('add-form');
    const formsetContainer = document.getElementById('formset-container');
    const $unidadInsumoSelect = document.getElementById("insumo_tabla");



    $unidadInsumoSelect.addEventListener("change",(e)=>{
        agregarOption(e.target);

    })



    

    
    $main.addEventListener("keyup", (e) => { 
            if(e.target.matches("#observaciones")){
                
                validarCampo(expresionesPedidos.observaciones, e.target, 'observaciones');
            }   
            else if(e.target.matches("#cantidad_tabla")){
            
                validarCampo(expresionesPedidos.cantidad_tabla, e.target, 'cantidad_tabla');
            }
        });

   
        
    $formulario.addEventListener("submit",(e)=>{
        
        e.preventDefault();
       
	    if(camposPedidos.observaciones){
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
            document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
            setTimeout(() => {
                document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
            }, 5000);

            document.querySelectorAll('.formulario__grupo-correcto').forEach((icono) => {
                icono.classList.remove('formulario__grupo-correcto');
            });
            cargarDatosEnFormset()
            e.target.submit();
        }
       
        else {
            document.getElementById('formulario__mensaje').classList.add('formulario__mensaje-activo');
            }
            
       
    });



    addButton.addEventListener('click', function() {
        validarCampo(expresionesPedidos.cantidad_tabla, e.target, 'cantidad_tabla');
        validarCampoFuncion(validarSelectInsumo(),'insumo_tabla')
        validarCampoFuncion(validarSelectUnidad(),'unidad_tabla')
    
        if(camposPedidos.insumo_tabla && camposPedidos.unidad_tabla && camposPedidos.cantidad_tabla){
            agregarInsumo();
            agregarInsumoFormset();
        }
            
           
    });
 

 

});



function agregarOption(insumoSelect) {
    const $SelectUnidad = document.querySelector("#unidad_tabla");
    while ($SelectUnidad.firstChild) {
        $SelectUnidad.removeChild($SelectUnidad.firstChild);
    }
    const selectedOption = insumoSelect.options[insumoSelect.selectedIndex];
    const unidadMedida = selectedOption.dataset.unidadmedida;

    if (unidadMedida) {
        const option = document.createElement("option");
        option.value = unidadMedida;
        option.textContent = unidadMedida;
        $SelectUnidad.appendChild(option);
    }
}


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

function validarCampoFuncion(funcion, campo){
 
    if(funcion){
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-correcto');
		
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.remove('formulario__input-error-activo');
		camposPedidos[campo] = true;
	} else {
		document.getElementById(`grupo__${campo}`).classList.add('formulario__grupo-incorrecto');
		document.getElementById(`grupo__${campo}`).classList.remove('formulario__grupo-correcto');
		
		document.querySelector(`#grupo__${campo} .formulario__input-error`).classList.add('formulario__input-error-activo');
		camposPedidos[campo] = false;
	}
    
}

function validarFecha(){
    const $fechaVenta= document.getElementById("id_fecha_pedido");
    
    if($fechaVenta.value!=""){
        return true
    }
    return false
}

function validarSelectProveedor(){
    const $proveedor= document.querySelector("#proveedor")
    if($proveedor.value===''){
        return false
    }
    return true
}

function validarSelectInsumo(){
    const $insumoTabla= document.querySelector("#insumo_tabla")
    if($insumoTabla.value===''){
        return false
    }
    return true
}

function validarSelectUnidad(){
    const $insumoTabla= document.querySelector("#unidad_tabla")

    if($insumoTabla.value===''){
        return false
    }
    return true
    


}


function agregarInsumo(){
    const tableBody = document.querySelector("#tableContainer tbody");
    const rowCount = tableBody.rows.length + 1;
    
    // Obtener valores de los campos de entrada
    const insumoSelect = document.getElementById("insumo_tabla");
    const insumo = insumoSelect.options[insumoSelect.selectedIndex].text;
    const cantidad = document.getElementById("cantidad_tabla").value;
    const unidadSelect = document.getElementById("unidad_tabla");
    const unidad = unidadSelect.options[unidadSelect.selectedIndex].text;
    
    // Verifica si los campos están completos antes de agregar la fila
    if (insumoSelect.value === "" || cantidad === ""|| unidadSelect.value=== "") {
        alert("Por favor, complete todos los campos antes de agregar.");
        return;
    }

    // Crear la nueva fila
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${rowCount}</td>
        <td class="insumo-item">${insumo}</td>
        <td class="cantidad-item">${cantidad}</td>
        <td class="unidad-item">${unidad}</td>
        <td>
            <button type="button" class="action-button edit-button" onclick="habilitarEdicion(this)"><i class="fa-solid fa-pen-to-square fa-sm" style="color: #ffffff;"></i></button>
            <button type="button" class="action-button delete-button" onclick="eliminarFormulario(this)" ><i class="fa-solid fa-trash fa-sm" style="color: #ffffff;"></i></button>
        </td>
    `;
    
    // Agregar la fila a la tabla
    tableBody.appendChild(row);

    // Limpiar los campos después de agregar la fila
    insumoSelect.value = "";
    document.getElementById("cantidad_tabla").value = "";

}  

function habilitarEdicion(button) {
    const row = button.closest("tr");
    const insumoCell = row.querySelector(".insumo-item");
    const cantidadCell = row.querySelector(".cantidad-item");
    const unidadCell = row.querySelector(".unidad-item");

    // Obtener los valores actuales
    const insumoActual = insumoCell.textContent.trim();
    const cantidadActual = cantidadCell.textContent.trim();
    const unidadActual= unidadCell.textContent.trim()

    const insumoSelect = document.getElementById("insumo_tabla").cloneNode(true);
    insumoSelect.classList.add("tabla__input"); 
    insumoSelect.id = "insumo_editar"; 

    const unidadSelect = document.getElementById("unidad_tabla").cloneNode(true);
    unidadSelect.classList.add("tabla__input"); 
    unidadSelect.id = "unidad_editar"; 

    // Establecer el valor actual en el select copiado
    for (let option of insumoSelect.options) {
        option.selected = (option.textContent.trim() === insumoActual);
    }
    for (let option of unidadSelect.options) {
        option.selected = (option.textContent.trim() === unidadActual);
    }

    insumoCell.innerHTML = "";
    insumoCell.appendChild(insumoSelect);
    unidadCell.innerHTML = "";
    unidadCell.appendChild(unidadSelect);
    cantidadCell.innerHTML = `<input type="number" class="tabla__input" id="cantidad_editar" value="${cantidadActual}">`;
    
    // Cambiar el botón a ícono de guardar y clase
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" fill="white" class="bi bi-floppy-fill" viewBox="0 0 16 16">
        <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
        <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
        </svg> `;
    button.classList.remove("edit-button");
    button.classList.add("save-button");
    
    actualizarUnidadSelect(insumoSelect, unidadSelect)
    insumoSelect.addEventListener("change", () => {
        actualizarUnidadSelect(insumoSelect, unidadSelect);
    });
    
    button.onclick = function() {
        guardarEdicion(button);
    };
}

function actualizarUnidadSelect(insumoSelect, unidadSelect) {
    while (unidadSelect.firstChild) {
        unidadSelect.removeChild(unidadSelect.firstChild);
    }

    const selectedOption = insumoSelect.options[insumoSelect.selectedIndex];
    const unidadMedida = selectedOption.dataset.unidadmedida;

    if (unidadMedida) {
        const option = document.createElement("option");
        option.value = unidadMedida;
        option.textContent = unidadMedida;
        unidadSelect.appendChild(option);
    }
}


function guardarEdicion(button) {
    const row = button.closest("tr");
    const insumoCell = row.querySelector(".insumo-item");
    const cantidadCell = row.querySelector(".cantidad-item");
    const unidadCell = row.querySelector(".unidad-item");

    const insumoEditarElement = row.querySelector("#insumo_editar");
    const cantidadEditarElement = row.querySelector("#cantidad_editar");
    const unidadEditarElement = row.querySelector("#unidad_editar")


    if (insumoEditarElement && cantidadEditarElement && unidadEditarElement) {
        const insumoEditado = insumoEditarElement.options[insumoEditarElement.selectedIndex].text;
        const cantidadEditada = cantidadEditarElement.value;
        const unidadEditado = unidadEditarElement.options[unidadEditarElement.selectedIndex].text;


        insumoCell.textContent = insumoEditado;
        cantidadCell.textContent =cantidadEditada;
        unidadCell.textContent =unidadEditado;

        // Obtener el índice del formulario en el formset
        const index = Array.from(row.parentNode.children).indexOf(row);
        // Actualizar los campos correspondientes en el formset usando el índice
        const form = document.querySelector(`#formset-container .insumos-form:nth-child(${index + 1})`);
        const insumoField = form.querySelectorAll('select')[0];
        const unidadField = form.querySelectorAll('select')[1];
        const cantidadField = form.querySelector('input[type="number"]');

        // Actualizar los valores del formset con los valores editados en la tabla
        insumoField.value = insumoEditarElement.value;
        cantidadField.value = cantidadEditada;
        unidadField.value= unidadEditarElement.value;
        // Cambiar el botón a ícono de modificar y clase
        button.innerHTML = '<i class="fa-solid fa-pen-to-square fa-sm" style="color: #ffffff;"></i>';
        button.classList.remove("save-button");
        button.classList.add("edit-button");
        button.onclick = function() {
            habilitarEdicion(button);
        };
    } else {
        console.error("Elementos de edición no encontrados.");
    }
}



function cargarTablaDesdeFormset() {
    const formsetContainer = document.getElementById('formset-container');
    const tablaBody = document.querySelector("#tableContainer tbody");

    tablaBody.innerHTML = ""; 

    const forms = formsetContainer.getElementsByClassName('insumos-form');
    Array.from(forms).forEach((form, index) => {
        const insumoSelect = form.querySelectorAll('select');
        const cantidadInput = form.querySelector('input[type="number"]');

        if (insumoSelect[0].value && insumoSelect[1].value && cantidadInput.value) {
            // Crear una nueva fila en la tabla
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${index + 1}</td>
                <td class="insumo-item">${insumoSelect[0].options[insumoSelect[0].selectedIndex].text}</td>
                <td class="cantidad-item">${cantidadInput.value}</td>
                <td class="unidad-item">${insumoSelect[1].options[insumoSelect[1].selectedIndex].text}</td>
                <td>
                    <button type="button" class="action-button edit-button" onclick="habilitarEdicion(this)">
                        <i class="fa-solid fa-pen-to-square fa-sm" style="color: #ffffff;"></i>
                    </button>
                    <button type="button" class="action-button delete-button" onclick="eliminarFormulario(this)">
                        <i class="fa-solid fa-trash fa-sm" style="color: #ffffff;"></i>
                    </button>
                </td>
            `;
            // Agregar la fila a la tabla
            tablaBody.appendChild(fila);
        }
    });
}

function eliminarFormulario(button) {
    const row = button.closest("tr");
    const index = Array.from(row.parentNode.children).indexOf(row);

    // Seleccionar el formulario en el formset-container usando el índice
    const form = document.querySelector(`#formset-container .insumos-form:nth-of-type(${index + 1})`);

    if (form) {
        const deleteCheckbox = form.querySelector('input[type="checkbox"][name$="-DELETE"]');
        if (deleteCheckbox) {
            deleteCheckbox.checked = true;
        }
        row.style.display = "none"; // Ocultar la fila en la tabla sin eliminar el formulario
    } else {
        console.error("No se encontró el formulario correspondiente.");
    }
}

function cargarDatosEnFormset() {
    const rows = document.querySelectorAll("#tableContainer tbody tr");
    const forms = document.querySelectorAll("#formset-container .insumos-form");
   
    rows.forEach((row, index) => {
        const insumoCell = row.querySelector(".insumo-item").textContent; // Obtener el insumo
        const cantidadCell = row.querySelector(".cantidad-item").textContent; // Obtener la cantidad
        const unidadCell = row.querySelector(".unidad-item").textContent
        if (forms[index]) {
            const form = forms[index];
            const insumoField = form.querySelector('select[name$="-insumo"]'); // Seleccionar el campo de insumo
            const cantidadField = form.querySelector('input[name$="-cantidad"]'); // Seleccionar el campo de cantidad
            const unidadField = form.querySelector('select[name$="-unidad_medida"]');
            cantidadField.value = cantidadCell;
       

            
            const options = insumoField.options;
            for (let i = 0; i < options.length; i++) {
                if (options[i].text === insumoCell) {
                    insumoField.value = options[i].value; // Asignar el valor del insumo
                    break; 
                }
            }
            const optionsUnidad = unidadField.options;
            for (let i = 0; i < optionsUnidad.length; i++) {
                if (optionsUnidad[i].text === unidadCell) {
                    unidadField.value = optionsUnidad[i].value; // Asignar el valor del insumo
                    break; 
                }
            }
        }
    });
}


function agregarInsumoFormset() {
    const formsetContainer = document.getElementById('formset-container');
    const totalForms = document.getElementById('id_insumos-TOTAL_FORMS');
    const filas = document.querySelectorAll("#tableContainer tbody tr");

    // Obtener el último formulario del formset
    const lastForm = formsetContainer.lastElementChild;
    const newForm = lastForm.cloneNode(true); // Clonar el último formulario

    // Limpiar los valores del nuevo formulario
    const inputs = newForm.querySelectorAll('input');
    const selects = newForm.querySelectorAll('select');

    inputs.forEach(input => {
        input.value = ""; // Limpiar el valor del input
    });

    selects.forEach(select => {
        select.selectedIndex = -1; // Limpiar la selección del select
    });

    // Agregar el nuevo formulario al contenedor
    formsetContainer.appendChild(newForm);

    // Actualizar el total de formularios
    totalForms.value = parseInt(totalForms.value) + 1;

    // Actualizar los índices de todos los formularios
    actualizarIndicesFormset(formsetContainer);
}

function actualizarIndicesFormset(formsetContainer) {
    const forms = formsetContainer.querySelectorAll('.insumos-form');
    forms.forEach((form, index) => {
        const inputs = form.querySelectorAll('input');
        const selects = form.querySelectorAll('select');
      
        inputs.forEach(input => {
            updateElementIndex(input, 'insumos', index);
        });

        selects.forEach(select => {
            updateElementIndex(select, 'insumos', index);
        });
    });
}



function updateElementIndex(element, prefix, index) {
    const idRegex = new RegExp(`(${prefix}-\\d+)`);
    const replacement = `${prefix}-${index}`;
    if (element.id) element.id = element.id.replace(idRegex, replacement);
    if (element.name) element.name = element.name.replace(idRegex, replacement);
}
