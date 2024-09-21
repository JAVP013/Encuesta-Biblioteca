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
