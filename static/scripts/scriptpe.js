const $botonAgregarInsumo = document.getElementById("add-form");
const $botonVerInsumos = document.getElementById("listarInsumos")


const expresionesPedidos = {
	observaciones: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
	cantidad: /^.{1,90}$/, // 1 a 90 digitos.
}
const camposPedidos = {
	observaciones: false,
	cantidad: false,
	
}





document.addEventListener("DOMContentLoaded", (e)=>{
    const $formulario= document.querySelector('#formulario')
    const addButton = document.getElementById('add-form');
    const formsetContainer = document.getElementById('formset-container');


    const formCount = formsetContainer.children.length;

    

    
    $formulario.addEventListener("keyup", (e) => { 
            if(e.target.matches("#observaciones")){
                
                validarCampo(expresionesPedidos.observaciones, e.target, 'observaciones');
            }   
            else if(e.target.matches("#cantidad")){
                validarCampo(expresionesPedidos.cantidad, e.target, 'cantidad');
            }
        });

   
        
    $formulario.addEventListener("submit",(e)=>{
        e.target.submit();

        e.preventDefault();
     
	    if(camposPedidos.observaciones && camposPedidos.cantidad ){
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

    
    

    // Función para actualizar el índice de un elemento
   
    // Agregar nuevo formulario
    addButton.addEventListener('click', function(e) {
        e.preventDefault();
        const formCount = formsetContainer.children.length;
        const template = formsetContainer.children[0].cloneNode(true);
        

        // Limpiar los valores del formulario clonado
        template.querySelectorAll('input[type="number"]').forEach(input => input.value = '');
        template.querySelectorAll('select').forEach(select => select.selectedIndex = 0);

        formsetContainer.appendChild(template);
        updateFormIndexes();
        actualizarFormulario();
    });

    // Eliminar formulario
    formsetContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-form')) {
            e.preventDefault();
            const form = e.target.closest('.seccion-form');
            form.remove();
            updateFormIndexes();
        }
    });
    
 

});

function updateFormIndexes() {
    const totalForms = document.getElementById('id_insumos-TOTAL_FORMS');
    const formsetContainer = document.getElementById('formset-container');
    const forms = formsetContainer.getElementsByClassName('insumos-form');
    for (let i = 0; i < forms.length; i++) {
        const formInputs = forms[i].getElementsByTagName('input');
        const formSelects = forms[i].getElementsByTagName('select');

        for (let input of formInputs) {
            updateElementIndex(input, 'insumos', i);
        }
        for (let select of formSelects) {
            updateElementIndex(select, 'insumos', i);
        }
    }
    totalForms.value = forms.length;
}

function updateElementIndex(element, prefix, index) {
    const idRegex = new RegExp(`(${prefix}-\\d+)`);
    const replacement = `${prefix}-${index}`;
    if (element.id) element.id = element.id.replace(idRegex, replacement);
    if (element.name) element.name = element.name.replace(idRegex, replacement);
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





function agregarFormularioATabla(form, index) {
    const $tbody = document.querySelector("table tbody");
    const insumos=querySelectorAll('#insumo')
    const insumo = form.querySelector('select[name$="-insumo"]').options[form.querySelector('select[name$="-insumo"]').selectedIndex].text;
    const cantidad = form.querySelector('input[name$="-cantidad"]').value;
    console.log(form)
    console.log(insumo,cantidad)
    const row = document.createElement('tr');
    row.setAttribute("data-form-index", index);

    
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${insumo}</td>
        <td>${cantidad}</td>
        <td>
            <div class="action-buttons">
                    <button class="action-button edit-button onclick="editarFormulario(${index})"><i class="fa-solid fa-pen-to-square fa-sm" style="color: #ffffff;"></i></button>
                    <button class="action-button delete-button" onclick="eliminarFormulario(${index})"><i class="fa-solid fa-trash fa-sm" style="color: #ffffff;"></i></button>
            </div>
        </td>
    `;
    $tbody.appendChild(row);
}


function editarFormulario(index) {
    const form = document.querySelector(`#formset-container .seccion-form:nth-child(${index + 1})`);
    form.style.display = "block"; // Muestra el formulario correspondiente en el formset.
}


function eliminarFormulario(index) {
    const form = document.querySelector(`#formset-container .seccion-form:nth-child(${index + 1})`);
    const deleteCheckbox = form.querySelector('input[type="checkbox"][name$="-DELETE"]');
    
    if (deleteCheckbox) {
        deleteCheckbox.checked = true; // Marcar para eliminar el formulario en el formset.
    }
    
    const row = document.querySelector(`table tbody tr[data-form-index="${index}"]`);
    if (row) {
        row.remove(); // Eliminar la fila de la tabla.
    }
}

function actualizarFormulario() {
    const $tbody = document.querySelector('.tbody'); // Asegúrate de tener un selector correcto
    const insumos = document.querySelectorAll('select[name$="-insumo"]'); // Suponiendo que insumos son selectores de insumo
    const cantidades = document.querySelectorAll('input[name$="-cantidad"]');
    // Limpiar el contenido del tbody antes de agregar nuevas filas
    $tbody.innerHTML = '';

    insumos.forEach((insumo, index) => {

        if(insumo.options[insumo.selectedIndex].text!='Seleccione'){
            console.log('text',insumo.options[insumo.selectedIndex].text)
                // Verifica que la cantidad no esté vacía
            const cantidad = cantidades[index] ? cantidades[index].value : '';
            console.log(cantidad)
            // Crear la fila
            const row = document.createElement('tr');
            row.setAttribute("data-form-index", index);
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${insumo.options[insumo.selectedIndex].text}</td>
                <td>${cantidad}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-button edit-button" onclick="editarFormulario(${index})"><i class="fa-solid fa-pen-to-square fa-sm" style="color: #ffffff;"></i></button>
                        <button class="action-button delete-button" onclick="eliminarFormulario(${index})"><i class="fa-solid fa-trash fa-sm" style="color: #ffffff;"></i></button>
                    </div>
                </td>
            `;

            // Agregar la fila al tbody
            $tbody.appendChild(row);
        }
        else console.log('xd')
        
    });
}