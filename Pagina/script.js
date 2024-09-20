/* VALIDAR EL NUMERO DE CONTROL */
const numeroControl = document.getElementById('nocontrol');
const formulario = document.getElementById('formEncuesta');
const errorMensaje = document.getElementById('error');

/* PENDIENTE LA PRIMERA LETRA, ESPECIFICAR CON QUE LETRA PUEDEN EMPEZAR */
let regex = /^[CD]?0[89]40[0-9]{4}$|^[CD]?1[0-9]40[0-9]{4}$|^[CD]?2[103]40[0-9]{4}$/;

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
/* ----------------------------------------------------------------------------------------- */
/* PARA LAS PREGUNTAS 13,14 Y 15 */
document.addEventListener('DOMContentLoaded', function() {

    let preg13_si = document.getElementById('preg13_si');
    let preg13_no = document.getElementById('preg13_no');
    let preg13_no_enterado = document.getElementById('preg13_noenterado');
    
    let preg14_siempre = document.getElementById('preg14_siempre');
    let preg14_23veces = document.getElementById('preg14_23veces');
    let preg14_1vez = document.getElementById('preg14_1vez');
    let preg14_nunca = document.getElementById('preg14_nunca');

    let preg15_no = document.getElementById('preg15_no');
    let preg15_si = document.getElementById('preg15_si');

    document.getElementsByName('preg13').forEach((element) => {
      element.addEventListener('change', function() {
        if (preg13_no.checked || preg13_no_enterado.checked) {
          // Si selecciona "No" o "No enterado" en Pregunta 13, marcar las respuestas en Pregunta 14 y 15
          preg14_nunca.checked = true;
          preg15_no.checked = true;
  
          // Deshabilitar las opciones de las Pregunta 14 y 15
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
            // Si selecciona "Si" en Pregunta 13 deshabilita la opcion de nunca de la Pregunta 14
            preg14_nunca.disabled = true;
        }
      });
    });
});
/* ----------------------------------------------------------------------------------------- */
/* PARA LAS PREGUNTAS 11 Y 12 */
document.addEventListener('DOMContentLoaded', function() {

  let preg11_diario = document.getElementById('preg11_diario');
  let preg11_examenes = document.getElementById('preg11_examenes');
  let preg11_23veces = document.getElementById('preg11_23veces');
  let preg11_1vez = document.getElementById('preg11_1vez');
  let preg11_nunca = document.getElementById('preg11_nunca');
  
  let preg12_manana = document.getElementById('preg12_manana');
  let preg12_tarde = document.getElementById('preg12_tarde');
  let preg12_mixto = document.getElementById('preg12_mixto');
  let preg12_nouso = document.getElementById('preg12_nouso');

  document.getElementsByName('preg11').forEach((element) => {
    element.addEventListener('change', function() {
      if (preg11_nunca.checked) {
        // Si selecciona "Nunca" en Pregunta 11, marcar las respuestas en Pregunta 12
        preg12_nouso.checked = true;

        // Deshabilitar las opciones de las Pregunta 11 y 12
        preg12_manana.disabled = true;
        preg12_tarde.disabled = true;
        preg12_mixto.disabled = true;
      } else {
        // Habilitar las opciones de Pregunta 14 y 15 si no se selecciona "No" o "No enterado"
        preg11_diario.disabled = false;
        preg11_examenes.disabled = false;
        preg11_23veces.disabled = false;
        preg11_1vez.disabled = false;
        preg12_manana.disabled = false;
        preg12_tarde.disabled = false;
        preg12_mixto.disabled = false;
        preg12_nouso.disabled = true;
      }
    });
  });
});
/* ----------------------------------------------------------------------------------------- */
/* PARA LO DE LA HORA Y RESPONDER PREGUNTAS  */
document.getElementById('formEncuesta').addEventListener('submit', function(event) {
  event.preventDefault(); // Evita el envío automático del formulario

  let valid = true; // Debe empezar como true y cambiar a false si falta alguna pregunta
  function checkQuestion(questionName, errorElementId) {
      let pregunta = document.getElementsByName(questionName);
      let answered = false;
      for (let i = 0; i < pregunta.length; i++) {
          if (pregunta[i].checked) {
              answered = true;
              break;
          }
      }
      if (!answered) {
          document.getElementById(errorElementId).textContent = "Por favor, conteste esta pregunta.";
          valid = false; // Si no está respondida, ponemos valid en false
      } else {
          document.getElementById(errorElementId).textContent = ""; // Limpia el error si ya está contestado
      }
  }

  // Valida cada pregunta
  checkQuestion('preg1', 'error_preg1',1);
  checkQuestion('preg2', 'error_preg2');
  checkQuestion('preg3', 'error_preg3');
  checkQuestion('preg4', 'error_preg4');
  checkQuestion('preg5', 'error_preg5');
  checkQuestion('preg6', 'error_preg6');
  checkQuestion('preg7', 'error_preg7');
  checkQuestion('preg8', 'error_preg8');
  checkQuestion('preg9', 'error_preg9');
  checkQuestion('preg10', 'error_preg10');
  checkQuestion('preg11', 'error_preg11');
  checkQuestion('preg12', 'error_preg12');
  checkQuestion('preg13', 'error_preg13');
  checkQuestion('preg14', 'error_preg14');
  checkQuestion('preg15', 'error_preg15');
  checkQuestion('pregI', 'error_pregI');
  checkQuestion('pregII', 'error_pregII');
  checkQuestion('pregIII', 'error_pregIII');
  checkQuestion('pregIV', 'error_pregIV');
  checkQuestion('pregV', 'error_pregV',);
  
  // Si todas las preguntas están respondidas, envía el formulario
  if (valid) {
      document.getElementById('error_preg').textContent = "";
      var fechaHoraActual = new Date().toLocaleString();
      // Asignar la fecha y hora al campo oculto
      document.getElementById('fechaHora').value = fechaHoraActual;
      this.submit(); // Envía el formulario si es válido
  } else {
      document.getElementById('error_preg').textContent = "Por favor, complete todas las preguntas.";
  }
});
