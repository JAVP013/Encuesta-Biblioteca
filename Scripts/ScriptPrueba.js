// Selección de elementos del DOM
const numeroControl = document.getElementById('nocontrol');
const formulario = document.getElementById('formEncuesta');
const errorMensaje = document.getElementById('error');
const semestreInput = document.getElementById('semestre');

// Expresión regular para validar el número de control
const regex = /^[CD]?0[89]40[0-9]{4}$|^[CD]?1[0-9]40[0-9]{4}$|^[CD]?2[103]40[0-9]{4}$/;

// Carga las preguntas desde Google Sheets al cargar la página
document.addEventListener('DOMContentLoaded', fetchQuestions);

// Función para obtener preguntas desde Google Sheets
async function fetchQuestions() {
    const API_KEY = 'AIzaSyD_1OHIUxyQpIcyLgUY0y-NZKo09jmm0mo'; // Tu API key
    const SPREADSHEET_ID = '1YAF_8hFmUGA7GatIRKFnJdHhWR9ZNKJwp6_cSMkv4KE'; // Tu Spreadsheet ID
    const RANGE = 'Preguntas!A2:F30'; // Tu rango

    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${API_KEY}`);
    const data = await response.json();
    const questions = data.values;

    if (questions.length > 0) {
        displayQuestions(questions);
    }
}

// Función para mostrar las preguntas en el formulario
function displayQuestions(questions) {
    const container = document.getElementById('preguntas-container');

    questions.forEach((row, index) => {
        const questionLabel = document.createElement('label');
        questionLabel.innerText = row[0]; // Primera columna es la pregunta
        container.appendChild(questionLabel);

        const optionsDiv = document.createElement('div');
        const options = row.slice(1).filter(option => option !== ""); 
        //const isEmojiBoxQuestion = row.slice(1).every(option => option === "EXCELENTE");

        if (options.length === 0) {
            const textBox = document.createElement('input');
            textBox.type = 'textbox';
            textBox.name = `preg${index + 1}`;
            textBox.placeholder = 'Observaciones';
            textBox.className = 'optional'; // Marcamos las preguntas abiertas como opcionales
            optionsDiv.appendChild(textBox);
        } else {
            const isEmojiQuestion = options.every(option => ["EXCELENTE", "BUENO", "REGULAR", "MALO", "MUY MALO"].includes(option));
            if (isEmojiQuestion) {
                optionsDiv.className = 'emoji-options';
                const emojis = {
                    "EXCELENTE": "😀",
                    "BUENO": "😊",
                    "REGULAR": "😐",
                    "MALO": "☹️",
                    "MUY MALO": "😠"
                };

                Object.keys(emojis).forEach(option => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `preg${index + 1}`; // Agrupando las respuestas por pregunta
                    input.value = option;
                    input.id = `preg${index + 1}_${option.replace(/\s/g, '_').toLowerCase()}`; // ID formateado

                    label.appendChild(input);
                    const emojiSpan = document.createElement('span'); 
                    emojiSpan.textContent = emojis[option]; 
                    label.appendChild(emojiSpan); 
                    optionsDiv.appendChild(label);
                });
            } else {
                optionsDiv.className = 'letras-options';
                const options = row.slice(1);

                options.forEach(option => {
                    if (option !== "") {
                        const label = document.createElement('label');
                        const input = document.createElement('input');
                        input.type = 'radio';
                        input.name = `preg${index + 1}`; 
                        input.value = option;
                        input.id = `preg${index + 1}_${option.replace(/\s/g, '_').toLowerCase()}`; // ID formateado

                        label.appendChild(input);
                        const textSpan = document.createElement('span'); 
                        textSpan.textContent = option; 
                        label.appendChild(textSpan); 
                        optionsDiv.appendChild(label);
                    }
                });
            }
        }

        container.appendChild(optionsDiv);
        container.appendChild(document.createElement('br'));

        const errorSpan = document.createElement('span');
        errorSpan.className = 'error';
        errorSpan.style.color = 'red'; 
        container.appendChild(errorSpan); 
    });
}

// Validar el número de control
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
document.addEventListener('DOMContentLoaded', function() {
    let preg11_diario = document.getElementById('preg11_diario');
    let preg11_examenes = document.getElementById('preg11_solo_en_examenes');
    let preg11_23veces = document.getElementById('preg11_2_o_3_veces_por_semana');
    let preg11_1vez = document.getElementById('preg11_1_vez_al_mes');
    let preg11_nunca = document.getElementById('preg11_nunca');

    let preg12_manana = document.getElementById('preg12_mañana');
    let preg12_tarde = document.getElementById('preg12_tarde');
    let preg12_mixto = document.getElementById('preg12_ambos/mixto');
    let preg12_nouso = document.getElementById('preg12_no_lo_uso');

    console.log('Pregunta 11:', preg11_diario, preg11_nunca); // Para depuración

    document.getElementsByName('preg11').forEach((element) => {
        element.addEventListener('change', function() {
            if (preg11_nunca.checked) {
                preg12_nouso.checked = true;

                preg12_manana.disabled = true;
                preg12_tarde.disabled = true;
                preg12_mixto.disabled = true;
            } else {
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

    // Para las preguntas 13, 14 y 15
    let preg13_si = document.getElementById('preg13_si');
    let preg13_no = document.getElementById('preg13_no');
    let preg13_no_enterado = document.getElementById('preg13_no_estoy_enterado(a)');
    
    let preg14_siempre = document.getElementById('preg14_siempre');
    let preg14_23veces = document.getElementById('preg14_2_o_3_veces');
    let preg14_1vez = document.getElementById('preg14_1_vez');
    let preg14_nunca = document.getElementById('preg14_nunca');
    
    let preg15_si = document.getElementById('preg15_si');
    let preg15_no = document.getElementById('preg15_no');

    console.log('Pregunta 13:', preg13_si, preg13_no); // Para depuración

    document.getElementsByName('preg13').forEach((element) => {
        element.addEventListener('change', function() {
            if (preg13_no.checked || preg13_no_enterado.checked) {
                preg14_nunca.checked = true;
                preg15_no.checked = true;

                preg14_siempre.disabled = true;
                preg14_23veces.disabled = true;
                preg14_1vez.disabled = true;
                preg15_si.disabled = true;
                preg15_no.disabled = true;
            } else {
                preg14_siempre.disabled = false;
                preg14_23veces.disabled = false;
                preg14_1vez.disabled = false;
                preg15_si.disabled = false;
                preg15_no.disabled = false;
            }
            if (preg13_si.checked) {
                preg14_nunca.disabled = true;
            }
        });
    });
});

/* ----------------------------------------------------------------------------------------- */


// Validar el formulario al enviarlo
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
