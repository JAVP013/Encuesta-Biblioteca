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
    let preg13_si = document.getElementById('preg13_si');
    let preg13_no = document.getElementById('preg13_no');
    let preg13_no_enterado = document.getElementById('preg13_noenterado');
    
    let preg14_siempre = document.getElementById('preg14_siempre');
    let preg14_23veces = document.getElementById('preg14_23veces');
    let preg14_1vez = document.getElementById('preg14_1vez');
    let preg14_nunca = document.getElementById('preg14_nunca');

    let preg15_no = document.getElementById('preg15_no');
    let preg15_si = document.getElementById('preg15_si');
  
    // Escuchar el cambio en la Pregunta 13
    document.getElementsByName('preg13').forEach((element) => {
      element.addEventListener('change', function() {
        if (preg13_no.checked || preg13_no_enterado.checked) {
          // Si selecciona "No" o "No enterado" en Pregunta 13, marcar las respuestas en Pregunta 14 y 15
          preg14_nunca.checked = true;
          preg15_no.checked = true;
  
          // Deshabilitar las opciones de Pregunta 14 y 15
          preg14_siempre.disabled = true;
          preg14_23veces.disabled = true;
          preg14_1vez.disabled = true;
          preg15_si.disabled = true;
          preg15_no.disabled = true;
        } else {
          // Habilitar las opciones de Pregunta 14 y 15 si no se selecciona "No" o "No enterado"
          preg14_siempre.disabled = false;
          preg14_23veces.disabled = false;
          preg14_1vez.disabled = false;
          preg15_si.disabled = false;
          preg15_no.disabled = false;
        }
        if(preg13_si.checked){
            // Si selecciona "si" en Pregunta 13 deshabilita la opcion de nunca de la pregunta 14
            preg14_nunca.disabled = true;
        }
      });
    });
  });