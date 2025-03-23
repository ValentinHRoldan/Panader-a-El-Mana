const d = document;
const $main= document.querySelector('#main')
const $formulario = d.getElementById("formulario");
const $divMayorista = d.getElementById("divMayorista")
const $inputMayorista = $divMayorista.childNodes[3].childNodes[1];
function configuracionInicialMayorista(){
    $inputMayorista.required = false;
    $divMayorista.classList.add("desactivado")
}
function ajusteMayorista(){
    if($formulario.tipo_venta.value === "MAYORISTA"){
        $divMayorista.classList.remove("desactivado");
        $divMayorista.childNodes[3].childNodes[1].required = true;
        $formulario.tipo_venta.required = true;
    }
    else{
        $divMayorista.classList.add("desactivado")
        $divMayorista.childNodes[3].childNodes[1].required = false;
    }
}

function getCuitMayorista(){
    let cuitMayoristaSeleccionado = $inputMayorista.value;
    $formulario.cuitMayorista.value = cuitMayoristaSeleccionado;
}


function controlFecha(){
    const $fechaVenta= document.getElementById("fechaVenta");
    const fechaActual = new Date().toISOString().split('T')[0];
    let fechaLimite = new Date();
    $fechaVenta.value = fechaActual;
    fechaLimite.setMonth(fechaLimite.getMonth() - 1)
    fechaLimite = fechaLimite.toISOString().split('T')[0];

    $fechaVenta.setAttribute("min",fechaLimite);
    $fechaVenta.setAttribute("max",fechaActual);
};


function validarCantidades(){
    $spanCantidades = d.querySelectorAll("#spanCantidadInvalida")
    for(let span of $spanCantidades){
        if(span.dataset.valido === "false"){
            return false;
        }
    }
    return true;
}

d.addEventListener("change", function(e){
    if(e.target === $formulario.tipo_venta){
        ajusteMayorista();
    }
    if(e.target === $inputMayorista){
        getCuitMayorista();
    }
});

d.addEventListener("submit", function(e){
    e.preventDefault();
    if(validarCantidades()) $formulario.submit();
});


d.addEventListener("DOMContentLoaded", function(e){
    controlFecha();
    configuracionInicialMayorista();
})


