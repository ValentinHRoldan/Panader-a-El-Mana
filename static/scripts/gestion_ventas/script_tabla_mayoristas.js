

document.addEventListener("click", function(e){
    if(e.target.matches(".edit-button") || e.target.matches(".edit-button i")){
        let cuitMayorista = e.target.dataset.cuit;
        window.location.href = cuitMayorista
    }
})


function confirmCancel(enlace) {
    Swal.fire({
        title: '¿Dar de baja al mayorista?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, dar de baja',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let formulario = document.getElementById('formulario_anular')
            formulario.action = enlace
            formulario.submit()
        }
    });
}