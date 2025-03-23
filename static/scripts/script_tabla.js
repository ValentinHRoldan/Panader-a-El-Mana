function buscarVenta() {
    const inputID = document.getElementById("searchInputID").value.toUpperCase();
    const inputDateMin = document.getElementById("searchInputDateMin").value;
    const inputDateMax = document.getElementById("searchInputDateMax").value;
    const table = document.querySelector(".table-container table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
        const idCell = rows[i].getElementsByTagName("td")[1];
        const fechaCell = rows[i].getElementsByTagName("td")[2];

        if (idCell && fechaCell) {
            const idText = idCell.textContent || idCell.innerText;
            const fechaText = fechaCell.textContent || fechaCell.innerText;
            const fechaDate = new Date(fechaText);

            let matchesID = true;
            let matchesFecha = true;

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

            // Mostrar o esconder la fila según las coincidencias
            if (matchesID && matchesFecha) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
        }
    }
}


function confirmCancel() {
Swal.fire({
    title: '¿Estás seguro?',
    text: "¡No podrás revertir esto!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, cancelar pedido',
    cancelButtonText: 'No, mantener pedido'
}).then((result) => {
    if (result.isConfirmed) {
        document.getElementById('cancelForm').submit();
    }
});
}