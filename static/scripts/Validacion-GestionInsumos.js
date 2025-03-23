const expresionesPedidos = {
	descripcion: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, 
    cantidad: /^[1-9]\d*(\.\d+)?$/, 
    cantidad_minima: /^[1-9]\d*(\.\d+)?$/
}
const camposPedidos = {
	descripcion: false,
	cantidad: false,
    cantidad_minima:false,
    fechaSolicitud:false,
    insumo_tabla:false,
    unidad_tabla:false
    
	
}




document.addEventListener("DOMContentLoaded", (e)=>{
    const $formulario= document.querySelector('#formulario')
    const $main= document.querySelector('#main')
    const addButton = document.getElementById('boton_agregar');



   
    
    $main.addEventListener("keyup", (e) => { 
         if(e.target.matches("#descripcion_insumo")){  
            validarCampo(expresionesPedidos.descripcion, e.target, 'descripcion');
        }   
        else if(e.target.matches("#cantidad_insumo")){
            validarCampo(expresionesPedidos.cantidad, e.target, 'cantidad');
        }
        else if(e.target.matches("#cantidad_minima_insumo")){
            validarCampo(expresionesPedidos.cantidad_minima, e.target, 'cantidad_minima');
        }
    });

    
    $formulario.addEventListener("submit",(e)=>{
        e.preventDefault();
	    if(camposPedidos.descripcion &&  camposPedidos.cantidad && camposPedidos.cantidad_minima){
            document.getElementById('formulario__mensaje').classList.remove('formulario__mensaje-activo');
            document.getElementById('formulario__mensaje-exito').classList.add('formulario__mensaje-exito-activo');
            setTimeout(() => {
                document.getElementById('formulario__mensaje-exito').classList.remove('formulario__mensaje-exito-activo');
            }, 7000);

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

function confirmCancel(enlace) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar producto',
        cancelButtonText: 'No, mantener producto'
    }).then((result) => {
        if (result.isConfirmed) {
            let formulario = document.getElementById('formulario_eliminar')
            formulario.action = enlace
            formulario.submit()
        }
    });
}