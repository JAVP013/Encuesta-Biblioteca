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

/* PARA LAS PREGUNTAS 13,14 Y 15 */
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar las opciones de las preguntas
    let pregunta13_no = document.getElementById('p13_no');
    let pregunta13_no_enterado = document.getElementById('p13_no_enterado');
    
    let pregunta14_si = document.getElementById('p14_si');
    let pregunta15_si = document.getElementById('p15_si');
    
    let pregunta14_no = document.getElementById('p14_no');
    let pregunta15_no = document.getElementById('p15_no');
  
    // Escuchar el cambio en la Pregunta 13
    document.getElementsByName('pregunta13').forEach((element) => {
      element.addEventListener('change', function() {
        if (pregunta13_no.checked || pregunta13_no_enterado.checked) {
          // Si selecciona "No" o "No enterado" en Pregunta 13, marcar las respuestas en Pregunta 14 y 15
          pregunta14_no.checked = true;
          pregunta15_no.checked = true;
  
          // Deshabilitar las opciones de Pregunta 14 y 15
          pregunta14_si.disabled = true;
          pregunta14_no.disabled = true;
          pregunta15_si.disabled = true;
          pregunta15_no.disabled = true;
        } else {
          // Habilitar las opciones de Pregunta 14 y 15 si no se selecciona "No" o "No enterado"
          pregunta14_si.disabled = false;
          pregunta14_no.disabled = false;
          pregunta15_si.disabled = false;
          pregunta15_no.disabled = false;
        }
      });
    });
  });