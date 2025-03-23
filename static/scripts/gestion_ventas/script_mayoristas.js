const $formulario = document.getElementById("formulario")
const $campoCuit = document.getElementById("cuit");
const $campoTelefono = document.getElementById("telefono")

function validarTeclas(key){
    return !((key >= 48 && key <= 57) || key === 66);
}

function validarLongitudCuit(cantChars){
    return cantChars >= 10;
}

function validarTelefono(key){
    return !((key >= 48 && key <= 57) || key === 66);
}


document.addEventListener("keydown", function(tecla){
    if(tecla.target === $formulario.cuit){
        if(validarTeclas(tecla.key.charCodeAt(0))) tecla.preventDefault();
        if(validarLongitudCuit(tecla.target.value.length)) $campoCuit.classList.add("is-invalid")
    }
    if(tecla.target === $formulario.telefono){
        if(validarTeclas(tecla.key.charCodeAt(0))) tecla.preventDefault();
    }
});

function validacionNumeros(cadena){
    let expresionReg = /^\d+$/;
    return expresionReg.test(cadena);
}


document.addEventListener("submit", function(e){
    e.preventDefault();
    if(validacionNumeros($formulario.cuit.value) && $formulario.telefono.value){
        $formulario.submit()
    }
})