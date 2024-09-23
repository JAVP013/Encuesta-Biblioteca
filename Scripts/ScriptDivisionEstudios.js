/* VALIDAR EL NUMERO DE CONTROL */
const numeroControl = document.getElementById('nocontrol');
const formulario = document.getElementById('formEncuesta');
const errorMensaje = document.getElementById('error');
const semestreInput = document.getElementById('semestre');

/* PENDIENTE LA PRIMERA LETRA, ESPECIFICAR CON QUE LETRA PUEDEN EMPEZAR */
let regex = /^[CD]?0[89]40[0-9]{4}$|^[CD]?1[0-9]40[0-9]{4}$|^[CD]?2[103]40[0-9]{4}$/;

numeroControl.addEventListener('input', function() {
    if (regex.test(numeroControl.value)) {
        errorMensaje.style.display = 'none';
        numeroControl.style.borderColor = 'green';
        calcularSemestre(numeroControl.value);         

    } else {
        errorMensaje.style.display = 'inline';
        numeroControl.style.borderColor = 'red';
    }
});

/* PARA CALCULAR EL SEMESTRE AUTOMATICAMENTE */
function calcularSemestre(nocontrol) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;  // Mes actual (1-12)

    // Si el número de control empieza con 'C' o 'D', quitar la primera letra
    let cleanControlNumber = nocontrol;
    if (nocontrol.startsWith('C') || nocontrol.startsWith('D')) {
        cleanControlNumber = nocontrol.substring(1);  // Eliminar la primera letra
    }

    // Extraer el año de ingreso (los primeros 2 dígitos después de la posible letra)
    let yearEntered = parseInt(cleanControlNumber.substring(0, 2), 10);
    let yearFull = (yearEntered < 50) ? 2000 + yearEntered : 1900 + yearEntered;

    // Calcular el semestre basado en la diferencia de años y el mes actual
    let yearsSinceEntry = currentYear - yearFull;
    let semestresTranscurridos = yearsSinceEntry * 2;

    // Si el año actual está entre enero y julio (primer semestre), agregar 1 solo si ya pasamos un semestre del año de entrada
    if (currentMonth >= 8) {
        semestresTranscurridos += 1;  // Estamos en el segundo semestre del año actual
    } else if (yearsSinceEntry >= 1) {
        semestresTranscurridos += 2;  // Primer semestre del año actual
    }

    // Asignar el valor del semestre al campo oculto
    semestreInput.value = semestresTranscurridos;
}

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


