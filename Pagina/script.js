/* VALIDAR EL NUMERO DE CONTROL */
const numeroControl = document.getElementById('nocontrol');
const formulario = document.getElementById('formEncuesta');
const errorMensaje = document.getElementById('error');

/* PENDIENTE LA PRIMERA LETRA, ESPECIFICAR CON QUE LETRA PUEDEN EMPEZAR */
let regex = /^[A-Z]?0[89]40[0-9]{4}$|^[A-Z]?1[0-9]40[0-9]{4}$|^[A-Z]?2[103]40[0-9]{4}$/;

numeroControl.addEventListener('input', function() {
    if (regex.test(numeroControl.value)) {
        errorMensaje.style.display = 'none';
        numeroControl.style.borderColor = 'green';
    } else {
        errorMensaje.style.display = 'inline';
        numeroControl.style.borderColor = 'red';
    }
});

formulario.addEventListener('submit', function(event) {
    if (!regex.test(numeroControl.value)) {
        event.preventDefault();
        alert("Por favor, ingresa un número de control válido con el formato adecuado.");
        location.reload();
    }
});

