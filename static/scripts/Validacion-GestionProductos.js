const boton_agregar = document.getElementById('boton_agregar')
boton_agregar.addEventListener('click',validar)
document.getElementById('categoria_producto').options[0].hidden = true;
document.getElementById('unidad_medida').options[0].hidden = true;
console.log(document.getElementById('categoria_producto').options[0])

const formulario = document.getElementById('formulario');

function validar(e){
    e.preventDefault();

    const descripcion = document.getElementById('descripcion_producto');
    if(descripcion.value === '')
    {
        alert('Descripción del producto es obligatorio');
        return false;

    }else if(!validarSoloLetras(descripcion)){
        alert('La descripcion debe ser solo letras');
        return false;
    }

    formulario.submit();
}

function validarSoloLetras(input) {
    if (input.value.length === 0)
    {
        return true;
    }
    const regex = /^[a-zA-ZñÑ\s]+$/;
    return regex.test(input.value);
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

document.addEventListener('click',function(e){
    console.log(e.target)
})