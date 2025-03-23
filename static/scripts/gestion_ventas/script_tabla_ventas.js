const d = document;


d.addEventListener("click", function(e){
    if(e.target.matches(".edit-button") || e.target.matches(".edit-button i")){
        let idVenta = e.target.dataset.id;
        window.location.href = idVenta
    }
    if(e.target === d.getElementById("btnGenerarInforme")){
        const $elementosOcultar = d.querySelectorAll(".no-informe");
        for(let elemento of $elementosOcultar){
            elemento.classList.add("ocultar");
        }
        e.target.classList.add("ocultar");
        setTimeout(function(){
            for(let elemento of $elementosOcultar){
                elemento.classList.remove("ocultar");
            }
            e.target.classList.remove("ocultar");
        }, 1000);
        
        window.print()
    }
})

function confirmCancel(enlace) {
    Swal.fire({
        title: '¿Anular la venta?',
        text: "¡No podrás revertir esto!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, anular venta',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            let formulario = document.getElementById('formulario_anular')
            formulario.action = enlace
            formulario.submit()
        }
    });
}

function buscarVenta() {
    const inputID = document.getElementById("searchInputID").value.toUpperCase();
    const inputDateMin = document.getElementById("searchInputDateMin").value;
    const inputDateMax = document.getElementById("searchInputDateMax").value;
    const tipoVenta = document.getElementById("tipoVenta_b").value.toUpperCase();
    const estadoVenta = document.getElementById("estadoVenta_b").value.toUpperCase();
    const table = document.querySelector(".table-container table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const idCell = rows[i].getElementsByTagName("td")[1];
        const fechaCell = rows[i].getElementsByTagName("td")[2];
        const tipoVentaCell = rows[i].getElementsByTagName("td")[4];
        const estadoVentaCell = rows[i].getElementsByTagName("td")[9];

        if (idCell && fechaCell && tipoVentaCell && estadoVentaCell) {
            const idText = idCell.textContent || idCell.innerText;
            const fechaText = fechaCell.textContent || fechaCell.innerText;
            const fechaDate = new Date(fechaText);
            const tipoVentaText = tipoVentaCell.textContent || tipoVentaCell.innerText;
            const estadoVentaText = estadoVentaCell.textContent || estadoVentaCell.innerText;

            let matchesID = true;
            let matchesFecha = true;
            let matchesTipoVenta = true;
            let matchesEstadoVenta = true;
            // Filtrar por ID
            if (inputID && idText.toUpperCase().indexOf(inputID) === -1) {
                matchesID = false;
            }

            // Filtrar por rango de fechas
            if (inputDateMin && fechaDate < new Date(inputDateMin)) {
                matchesFecha = false;
            }
            if (inputDateMax && fechaDate > new Date(inputDateMax)) {
                matchesFecha = false;
            }
            // filtrar por tipo de venta
            if (tipoVenta && tipoVentaText.toUpperCase().indexOf(tipoVenta) === -1) {
                matchesTipoVenta = false;
            }        
            if (estadoVenta && estadoVentaText.toUpperCase().indexOf(estadoVenta) === -1) {
                matchesEstadoVenta = false;
            }              

            // Mostrar o esconder la fila según las coincidencias
            if (matchesID && matchesFecha && !matchesTipoVenta && !matchesEstadoVenta) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}