async function fetchQuestions() {
    const API_KEY = 'AIzaSyD_1OHIUxyQpIcyLgUY0y-NZKo09jmm0mo'; // Tu API key
    const SPREADSHEET_ID = '1SSGrHG9VwXRXX5QlxuXzRVZh5iuzY6WYzSXQopm_e6g'; // Tu Spreadsheet ID
    const RANGE = 'Preguntas!A2:F15'; // Tu rango

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    const questions = data.values;

    if (questions.length > 0) {
        displayQuestions(questions);
    }
}
    
function displayQuestions(questions) {
    const container = document.getElementById('preguntas-container');

    questions.forEach((row, index) => {
        const questionLabel = document.createElement('label');
        questionLabel.innerText = row[0]; // Primera columna es la pregunta
        container.appendChild(questionLabel);

        const optionsDiv = document.createElement('div');
        
        // Verificar si todas las opciones están vacías (celda combinada)
        const isTextBoxQuestion = row.slice(1).every(option => option === "");
        
        if (isTextBoxQuestion) {
            // Agregar un campo de texto si la celda está combinada
            const textBox = document.createElement('input');
            textBox.type = 'textbox';
            textBox.name = `preg${index + 1}`;
            textBox.placeholder = 'Observaciones';
            textBox.className = 'optional'; // Marcamos las preguntas abiertas como opcionales
            optionsDiv.appendChild(textBox);
            container.appendChild(optionsDiv);
            container.appendChild(document.createElement('br'));
        } else {
            // Verificar si la pregunta es sobre satisfacción
            if (row[1].toLowerCase().includes('satisfecho')) {
                optionsDiv.className = 'emoji-options';
                const emojis = {
                    "5": "😀",
                    "4": "😊",
                    "3": "😐",
                    "2": "☹️",
                    "1": "😠"
                };

                // Crear las opciones con emojis
                Object.keys(emojis).forEach(option => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `preg${index + 1}`; // Agrupando las respuestas por pregunta
                    input.value = option;

                    label.appendChild(input);
                    const emojiSpan = document.createElement('span'); // Crear el span para el emoji
                    emojiSpan.textContent = emojis[option]; // Añadir el emoji al span
                    label.appendChild(emojiSpan); // Añadir el span al label
                    optionsDiv.appendChild(label);
                });
                container.appendChild(optionsDiv);
                container.appendChild(document.createElement('br'));
        
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error';
                errorSpan.style.color = 'red'; // Para el color del error
                container.appendChild(errorSpan); // Añadir espacio para errores
            } else {
                optionsDiv.className = 'letras-options';
                // Las opciones de respuesta están en columnas posteriores
                const options = row.slice(1); // Suponiendo que las opciones empiezan en la segunda columna

                options.forEach((option) => {
                    if (option !== "") { // Evitar opciones vacías
                        const label = document.createElement('label');
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `preg${index + 1}`; // Agrupando las respuestas por pregunta
                        input.value = option;

                        label.appendChild(input);
                        const textSpan = document.createElement('span'); // Crear el span para el texto
                        textSpan.textContent = option; // Añadir el texto al span
                        label.appendChild(textSpan); // Añadir el span al label
                        optionsDiv.appendChild(label);
                    }
                });
                container.appendChild(optionsDiv);
                container.appendChild(document.createElement('br'));
        
                const errorSpan = document.createElement('span');
                errorSpan.className = 'error';
                errorSpan.style.color = 'red'; // Para el color del error
                container.appendChild(errorSpan); // Añadir espacio para errores
            }
        }

    });
}


// Validar el número de control
const numeroControl = document.getElementById('nocontrol');
const formulario = document.getElementById('formEncuesta');
const errorMensaje = document.getElementById('error');
const semestreInput = document.getElementById('semestre');

// Expresión regular para validar el número de control
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

// Calcular el semestre automáticamente
function calcularSemestre(nocontrol) {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    let cleanControlNumber = nocontrol;
    if (nocontrol.startsWith('C') || nocontrol.startsWith('D')) {
        cleanControlNumber = nocontrol.substring(1);
    }

    let yearEntered = parseInt(cleanControlNumber.substring(0, 2), 10);
    let yearFull = (yearEntered < 50) ? 2000 + yearEntered : 1900 + yearEntered;

    let yearsSinceEntry = currentYear - yearFull;
    let semestresTranscurridos = yearsSinceEntry * 2;

    if (currentMonth >= 8) {
        semestresTranscurridos += 1;
    } else if (yearsSinceEntry >= 1) {
        semestresTranscurridos += 2;
    }

    semestreInput.value = semestresTranscurridos;
}

formulario.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío inmediato del formulario
    let valid = true; // Inicializa valid en true
    
    // Validar el número de control
    if (!regex.test(numeroControl.value)) {
        alert("Por favor, ingresa un número de control válido con el formato adecuado.");
        return; // Salir si el número de control es inválido
    }
    
    // Limpiar mensajes de error previos
    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = ""); 
    
    // Validar preguntas
    const totalPreguntas = document.querySelectorAll('#preguntas-container > div'); // Grupos de opciones
    for (let i = 0; i < totalPreguntas.length; i++) {
        const questionGroup = totalPreguntas[i];
        const radioInputs = questionGroup.querySelectorAll('input[type="radio"]');
        const textInput = questionGroup.querySelector('input[type="textbox"]');

        // Si es una pregunta con opciones (radio buttons)
        if (radioInputs.length > 0) {
            let answered = Array.from(radioInputs).some(input => input.checked); // Revisar si alguna respuesta fue seleccionada
        
            if (!answered) {
                valid = false; // Cambiar valid a false si no se ha respondido
                errorElements[i].textContent = "Por favor, conteste esta pregunta.";
            }
        }

        // Si es una pregunta abierta (opcional)
        if (textInput && !textInput.classList.contains('optional')) {
            if (textInput.value.trim() === "") {
                valid = false;
                errorElements[i].textContent = "Por favor, complete este campo.";
            }
        }
    }

    // Si todas las validaciones son correctas
    if (valid) {
        formulario.submit(); // Enviar el formulario si es válido
    } else {
        document.getElementById('error_preg').textContent = "Por favor, complete todas las preguntas obligatorias.";
    }
});
    

// Carga las preguntas al cargar la página
document.addEventListener('DOMContentLoaded', fetchQuestions);