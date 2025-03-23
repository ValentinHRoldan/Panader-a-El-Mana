const $botonAgregarInsumo = document.getElementById("add-form");
const $botonVerInsumos = document.getElementById("listarInsumos")


const expresionesPedidos = {
	observaciones: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	cantidad_tabla: /^.{1,90}$/, // 1 a 90 digitos.// 1 a 90 digitos.
    
}
const camposPedidos = {
	cantidad_tabla: false,
    insumo_tabla:false,
    unidad_tabla:false
    
	
}





document.addEventListener("DOMContentLoaded", (e)=>{
    const $formulario= document.querySelector('#formulario_insumo_restar')
    const $main= document.querySelector('#main')
    const addButton = document.getElementById('add-form');
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

    addButton.addEventListener('click', function() {
        validarCampo(expresionesPedidos.cantidad_tabla, e.target, 'cantidad_tabla');
        validarCampoFuncion(validarSelectInsumo(),'insumo_tabla')
        validarCampoFuncion(validarSelectUnidad(),'unidad_tabla')
    
        if(camposPedidos.insumo_tabla && camposPedidos.unidad_tabla && camposPedidos.cantidad_tabla){
            agregarInsumo();
        }
            
           
    });
        
    $formulario.addEventListener("submit",(e)=>{
        e.preventDefault();
       
	    if(camposPedidos.cantidad_tabla){
            
            generarCamposOcultos();
            e.target.submit();
           
        }
       
            
       
    });

   
 

});


function agregarOption(insumoSelect) {
    console.log('hola')
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






function agregarInsumo(){
    const tableBody = document.querySelector("#tableContainer tbody");
    const rowCount = tableBody.rows.length + 1;
    
    // Obtener valores de los campos de entrada
    const insumoSelect = document.getElementById("insumo_tabla");
    const insumo = insumoSelect.options[insumoSelect.selectedIndex].text;
    const cantidad = document.getElementById("cantidad_tabla").value;
    const unidadSelect = document.getElementById("unidad_tabla");
    const unidad = unidadSelect.options[unidadSelect.selectedIndex].text;
    

    const cantidadInsumo=insumoSelect.options[insumoSelect.selectedIndex].dataset.cantidad
        // Verifica si los campos están completos antes de agregar la fila
    if (insumoSelect.value === "" || cantidad === "" || unidadSelect.value=== "") {
        alert("Por favor, complete todos los campos antes de agregar.");
        return;
    }

    // Crear la nueva fila
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${rowCount}</td>
        <td class="insumo-item">${insumo}</td>
        <td class="cantidad-insumo-item">${cantidadInsumo}</td>
        <td class="unidad-item">${unidad}</td>
        <td class="cantidad-item">${cantidad}</td>
        <td>
            <button type="button" class="action-button edit-button" onclick="habilitarEdicion(this)"><i class="fa-solid fa-pen-to-square fa-sm" style="color: #ffffff;"></i></button>
            <button type="button" class="action-button delete-button" onclick="eliminarFila(this)" ><i class="fa-solid fa-trash fa-sm" style="color: #ffffff;"></i></button>
        </td>
    `;
    
    // Agregar la fila a la tabla
    tableBody.appendChild(row);

    // Limpiar los campos después de agregar la fila
    insumoSelect.value = "";
    unidadSelect.value= "";
    document.getElementById("cantidad_tabla").value = "";

}  

function eliminarFila(button) {
    const row = button.closest("tr");
    row.remove();
}

function habilitarEdicion(button) {
    const row = button.closest("tr");
    const insumoCell = row.querySelector(".insumo-item");
    const cantidadInsumoCell=row.querySelector('.cantidad-insumo-item')
    const cantidadCell = row.querySelector(".cantidad-item");
    const unidadCell = row.querySelector(".unidad-item");
    // Obtener los valores actuales
    const insumoActual = insumoCell.textContent.trim();
    const cantidadActual = cantidadCell.textContent.trim();
    const unidadActual= unidadCell.textContent.trim()
    // Obtener el select del HTML y copiar sus opciones
    

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


    // Reemplazar la celda de insumo con el select
    insumoCell.innerHTML = "";
    insumoCell.appendChild(insumoSelect);
    unidadCell.innerHTML = "";
    unidadCell.appendChild(unidadSelect);

    
    insumoSelect.onclick= function(){
        cantidadInsumoCell.innerHTML=insumoSelect.options[insumoSelect.selectedIndex].dataset.cantidad

    }
    cantidadCell.innerHTML = `<input type="number" class="tabla__input" id="cantidad_editar" value="${cantidadActual}">`;

    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="18" fill="white" class="bi bi-floppy-fill" viewBox="0 0 16 16">
        <path d="M0 1.5A1.5 1.5 0 0 1 1.5 0H3v5.5A1.5 1.5 0 0 0 4.5 7h7A1.5 1.5 0 0 0 13 5.5V0h.086a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5H14v-5.5A1.5 1.5 0 0 0 12.5 9h-9A1.5 1.5 0 0 0 2 10.5V16h-.5A1.5 1.5 0 0 1 0 14.5z"/>
        <path d="M3 16h10v-5.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5zm9-16H4v5.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5zM9 1h2v4H9z"/>
        </svg> `;
    button.classList.remove("edit-button");
    button.classList.add("save-button");
    
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
    const cantidadInsumoCell=row.querySelector('.cantidad-insumo-item')
    const cantidadCell = row.querySelector(".cantidad-item");
    const unidadCell = row.querySelector(".unidad-item");

    // Obtener los valores del select y el input de edición
    const insumoEditado = row.querySelector("#insumo_editar").options[row.querySelector("#insumo_editar").selectedIndex].text;
    const cantidadEditada = row.querySelector("#cantidad_editar").value;
    const unidadEditado = row.querySelector("#unidad_editar").options[row.querySelector("#unidad_editar").selectedIndex].text;


    // Guardar los valores en las celdas como texto
    insumoCell.textContent = insumoEditado;
    cantidadCell.textContent = cantidadEditada;
    unidadCell.textContent=unidadEditado;
    // Cambiar el botón "Guardar" de nuevo a "Modificar"
    // Cambiar el botón a ícono de modificar y clase
    button.innerHTML = '<i class="fa-solid fa-pen-to-square fa-sm" style="color: #ffffff;"></i>';
    button.classList.remove("save-button");
    button.classList.add("edit-button");
    button.onclick = function() {
        habilitarEdicion(button);
    };
}

function generarCamposOcultos() {
    const formsetContainer = document.getElementById('formset-container');
    const totalForms = document.getElementById('id_form-TOTAL_FORMS');
    const filas = document.querySelectorAll("#tableContainer tbody tr");
    
    // Vaciar los formularios actuales (excepto el primero, que es la plantilla)
    while (formsetContainer.children.length > 1) {
        formsetContainer.removeChild(formsetContainer.lastChild);
    }
    // Actualizar el total de formularios en el formset
    totalForms.value = filas.length;

    // Usar el primer formulario del formset para el primer elemento de la tabla
    if (filas.length > 0) {
        const firstTemplate = formsetContainer.children[0];
   
        // Obtener valores de insumo y cantidad desde la primera fila
        const firstInsumo = filas[0].querySelector(".insumo-item").textContent.trim();
        const firstCantidad = filas[0].querySelector(".cantidad-item").textContent.trim();
        const firstUnidad = filas[0].querySelector(".unidad-item").textContent.trim();

        // Asignar los valores al primer formulario
        firstTemplate.querySelector('input[type="number"]').value = firstCantidad;
        const firstSelect = firstTemplate.querySelector('select');
        for (let option of firstSelect.options) {
            option.selected = (option.textContent.trim() === firstInsumo);
        }
        const secondSelect = firstTemplate.querySelector('#id_form-0-unidad_medida');
        for (let option of secondSelect.options) {
            option.selected = (option.textContent.trim() === firstUnidad);
        }
       
        // Actualizar índices del primer formulario
        updateElementIndex(firstTemplate.querySelector('input[type="number"]'), 'insumos', 0);
        updateElementIndex(firstTemplate.querySelector('select'), 'insumos', 0);
        updateElementIndex(firstTemplate.querySelector('#id_form-0-unidad_medida'), 'insumos', 0);
    }

    // Clonar el formulario base para el resto de las filas en la tabla
    for (let index = 1; index < filas.length; index++) {
        const fila = filas[index];

        // Clonar el primer formulario (la plantilla) y limpiar sus valores
        const template = formsetContainer.children[0].cloneNode(true);
        template.querySelector('input[type="number"]').value = "";
        template.querySelector('select').selectedIndex = -1;
        formsetContainer.appendChild(template);
       

        // Obtener valores de insumo y cantidad de la fila actual
        const insumo = fila.querySelector(".insumo-item").textContent.trim();
        const cantidad = fila.querySelector(".cantidad-item").textContent.trim();
        const unidad = fila.querySelector(".unidad-item").textContent.trim();


        // Asignar los valores al formulario clonado
        template.querySelector('input[type="number"]').value = cantidad;
        const selects = template.querySelectorAll('select');

        for(let select of selects){
            console.log(selects)
            if(select===selects[0]){
                for (let option of select.options) {
                    option.selected = (option.textContent.trim() === insumo);
                } 
            }
            else{
                for (let option of select.options) {
                    option.selected = (option.textContent.trim() === unidad);
                } 
            }
            
        }
              
     

        // Actualizar los índices de los elementos en el formulario clonado
        const formInputs = template.getElementsByTagName('input');
        const formSelects = template.getElementsByTagName('select');
        for (let input of formInputs) {
            updateElementIndex(input, 'form', index);
        }
        for (let select of formSelects) {
            updateElementIndex(select, 'form', index);
        }

    }
}




function updateElementIndex(element, prefix, index) {
    const idRegex = new RegExp(`(${prefix}-\\d+)`);
    const replacement = `${prefix}-${index}`;
    if (element.id) element.id = element.id.replace(idRegex, replacement);
    if (element.name) element.name = element.name.replace(idRegex, replacement);
}
