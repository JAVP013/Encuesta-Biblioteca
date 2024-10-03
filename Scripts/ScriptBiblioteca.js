const numeroControl = document.getElementById('nocontrol');
const formulario = document.getElementById('formEncuesta');
const errorMensaje = document.getElementById('error');
const semestreInput = document.getElementById('semestre');

//************************************ Expresión regular para validar el número de control ************************************
const regex = /^[CD]?0[89]40[0-9]{4}$|^[CD]?1[0-9]40[0-9]{4}$|^[CD]?2[103]40[0-9]{4}$/;

// ************************************Carga las preguntas desde Google Sheets al cargar la página************************************
document.addEventListener('DOMContentLoaded', fetchQuestions);

// ************************************ Función para obtener preguntas desde Google Sheets ************************************
async function fetchQuestions() {
    const API_KEY = 'AIzaSyD_1OHIUxyQpIcyLgUY0y-NZKo09jmm0mo'; // Tu API key
    const SPREADSHEET_ID = '1YAF_8hFmUGA7GatIRKFnJdHhWR9ZNKJwp6_cSMkv4KE'; // Tu Spreadsheet ID
    const RANGE = 'Preguntas!A2:F30'; // Tu rango

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    const questions = data.values;

    if (questions.length > 0) {
        displayQuestions(questions);
        setupEventListeners();
    }
}
function setupEventListeners() {
    // Pregunta 11 y 12
    const preg11Elements = document.querySelectorAll('input[name="preg11"]');
    const preg12_manana = document.getElementById('preg12_1');
    const preg12_tarde = document.getElementById('preg12_2');
    const preg12_mixto = document.getElementById('preg12_3');
    const preg12_nouso = document.getElementById('preg12_4');

    console.log("preg11Elements:", preg11Elements);
    console.log("preg12_manana:", preg12_manana);

    preg11Elements.forEach((element) => {
        element.addEventListener('change', function() {
            if (document.getElementById('preg11_5').checked) { // Si se selecciona "NUNCA" en pregunta 11
                preg12_nouso.checked = true;
                preg12_nouso.disabled = false;

                // Deshabilitar otras opciones de pregunta 12
                preg12_manana.disabled = true;
                preg12_tarde.disabled = true;
                preg12_mixto.disabled = true;
                preg12_manana.checked = false;
                preg12_tarde.checked = false;
                preg12_mixto.checked = false;
            } else {
                // Habilitar las opciones de pregunta 12
                preg12_manana.disabled = false;
                preg12_tarde.disabled = false;
                preg12_mixto.disabled = false;
                preg12_nouso.disabled = true;
                preg12_nouso.checked = false; // Desmarcar la opción "NO LO USO"
            }
        });
    });

    // Pregunta 13, 14 y 15
    const preg13Elements = document.querySelectorAll('input[name="preg13"]');
    const preg14_siempre = document.getElementById('preg14_1');
    const preg14_23veces = document.getElementById('preg14_2');
    const preg14_1vez = document.getElementById('preg14_3');
    const preg14_nunca = document.getElementById('preg14_4');
    const preg15_si = document.getElementById('preg15_1');
    const preg15_no = document.getElementById('preg15_2');

    preg13Elements.forEach((element) => {
        element.addEventListener('change', function() {
            if (document.getElementById('preg13_2').checked || document.getElementById('preg13_3').checked) { 
                // Si se selecciona "NO" o "NO ESTOY ENTERADO(A)" en pregunta 13
                preg14_nunca.checked = true;
                preg15_no.checked = true;

                // Deshabilitar opciones de pregunta 14
                preg14_siempre.disabled = true;
                preg14_23veces.disabled = true;
                preg14_1vez.disabled = true;
                preg14_siempre.checked = false;
                preg14_23veces.checked = false;
                preg14_1vez.checked = false;

                // Deshabilitar opción "SI" en pregunta 15
                preg15_si.disabled = true;
                preg15_si.checked = false;
            } else {
                // Habilitar opciones de pregunta 14
                preg14_siempre.disabled = false;
                preg14_23veces.disabled = false;
                preg14_1vez.disabled = false;
                preg15_si.disabled = false;

                // Deshabilitar "NUNCA" en pregunta 14 si se selecciona "SI" en pregunta 13
                preg14_nunca.disabled = true;
                preg14_nunca.checked = false; // Desmarcar la opción "NUNCA"
            }
        });
    });
}

//******************************** Función para mostrar las preguntas en el formulario ************************************
function displayQuestions(questions) {
    const container = document.getElementById('preguntas-container');

    questions.forEach((row, index) => {
        const questionLabel = document.createElement('label');
        questionLabel.innerText = row[0]; // Primera columna es la pregunta
        container.appendChild(questionLabel);

        const optionsDiv = document.createElement('div');
        const options = row.slice(1).filter(option => option !== ""); // Filtramos las opciones vacías
        
        // Si no hay opciones, asumimos que es una pregunta de texto
        if (options.length === 0) {
            const textBox = document.createElement('input');
            textBox.type = 'textbox';
            textBox.name = `preg${index + 1}`;
            textBox.placeholder = 'Observaciones';
            textBox.className = 'optional'; // Marcamos las preguntas abiertas como opcionales
            optionsDiv.appendChild(textBox);
        } else {
            // Si todas las opciones son valores de satisfacción ("EXCELENTE", "BUENO", etc.)
            const isEmojiQuestion = options.every(option => ["EXCELENTE", "BUENO", "REGULAR", "MALO", "MUY MALO"].includes(option));
            if (isEmojiQuestion) {
                optionsDiv.className = 'emoji-options';
                const emojis = {
                    "5": "😀",
                    "4": "😊",
                    "3": "😐",
                    "2": "☹️",
                    "1": "😠"
                };

                // Asignar IDs en el formato "preg#_#"
                Object.keys(emojis).forEach((option, optionIndex) => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `preg${index + 1}`; // Agrupando las respuestas por pregunta
                    input.value = option;
                    input.id = `preg${index + 1}_${optionIndex + 1}`; // ID numérico en el formato "preg#_#"

                    label.appendChild(input);
                    const emojiSpan = document.createElement('span');
                    emojiSpan.textContent = emojis[option];
                    label.appendChild(emojiSpan);
                    optionsDiv.appendChild(label);
                });
            } else {
                // Caso general para las opciones de texto
                optionsDiv.className = 'letras-options';
                
                options.forEach((option, optionIndex) => {
                    if (option !== "") {
                        const label = document.createElement('label');
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `preg${index + 1}`; // Agrupando las respuestas por pregunta
                        input.value = option;
                        input.id = `preg${index + 1}_${optionIndex + 1}`; // ID numérico en el formato "preg#_#"

                        label.appendChild(input);
                        const textSpan = document.createElement('span');
                        textSpan.textContent = option;
                        label.appendChild(textSpan);
                        optionsDiv.appendChild(label);
                    }
                });
            }
        }

        // Agregar las opciones y los campos de error al contenedor
        container.appendChild(optionsDiv);
        container.appendChild(document.createElement('br'));

        const errorSpan = document.createElement('span');
        errorSpan.className = 'error';
        errorSpan.style.color = 'red'; 
        container.appendChild(errorSpan); 
    });
}

// ************************************ Validar el número de control ************************************
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

// *********************************** Calcular el semestre automáticamente ********************************
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
// ************************************ PREGUNTAS ************************************

// ************************************ Validar el formulario al enviarlo ************************************
formulario.addEventListener('submit', function(event) {
    event.preventDefault(); 
    let valid = true; 

    if (!regex.test(numeroControl.value)) {
        alert("Por favor, ingresa un número de control válido con el formato adecuado.");
        return; 
    }

    const errorElements = document.querySelectorAll('.error');
    errorElements.forEach(el => el.textContent = ""); 

    const totalPreguntas = document.querySelectorAll('#preguntas-container > div'); 
    totalPreguntas.forEach((questionGroup, i) => {
        const radioInputs = questionGroup.querySelectorAll('input[type="radio"]');
        const textInput = questionGroup.querySelector('input[type="text"]');

        if (radioInputs.length > 0) {
            let answered = Array.from(radioInputs).some(input => input.checked); 
        
            if (!answered) {
                valid = false; 
                errorElements[i].textContent = "Por favor, conteste esta pregunta.";
            }
        }

        if (textInput && textInput.classList.contains('optional') && textInput.value.trim() === "") {
            valid = false;
            errorElements[i].textContent = "Por favor, complete este campo.";
        }
    });

    if (valid) {
        formulario.submit(); 
    } else {
        document.getElementById('error_preg').textContent = "Por favor, complete todas las preguntas obligatorias.";
    }
});