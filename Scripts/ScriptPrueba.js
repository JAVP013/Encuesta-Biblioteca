
    async function fetchQuestions() {
        const API_KEY = 'AIzaSyD_1OHIUxyQpIcyLgUY0y-NZKo09jmm0mo'; // Tu API key
        const SPREADSHEET_ID = '1SSGrHG9VwXRXX5QlxuXzRVZh5iuzY6WYzSXQopm_e6g'; // Tu Spreadsheet ID
        const RANGE = 'Preguntas!A2:F10'; // Tu rango
    
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
    
            // Verificar si la pregunta tiene opciones de emoji o palabras
            if (row[1] && row[1].toLowerCase().includes('emoji')) {
                // Usar emojis para la respuesta
                optionsDiv.className = 'emoji-options';
                const emojis = ['😀', '😊', '😐', '☹️', '😠']; // Emojis correspondientes
                const options = row.slice(2); // Las opciones de respuesta están en columnas posteriores
    
                options.forEach((option, i) => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `preg${index + 1}`; // Agrupando las respuestas por pregunta
                    input.value = option;
    
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(option));
                    label.appendChild(document.createTextNode(emojis[i])); // Añadir el emoji
                    optionsDiv.appendChild(label);
                });
            } else {
                // Usar texto para la respuesta
                optionsDiv.className = 'letras-options';
                const options = row.slice(1); // Las opciones de respuesta están en columnas posteriores
    
                options.forEach((option) => {
                    const label = document.createElement('label');
                    const input = document.createElement('input');
                    input.type = 'radio';
                    input.name = `preg${index + 1}`; // Agrupando las respuestas por pregunta
                    input.value = option;
    
                    label.appendChild(input);
                    label.appendChild(document.createTextNode(option)); // Añadir el texto
                    optionsDiv.appendChild(label);
                });
            }
            container.appendChild(optionsDiv);
            container.appendChild(document.createElement('br'));
            const errorSpan = document.createElement('span');
            errorSpan.className = 'error';
            errorSpan.style.color = 'red'; // Para el color del error
            container.appendChild(errorSpan); // Añadir espacio para errores
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
        if (!regex.test(numeroControl.value)) {
            event.preventDefault();
            alert("Por favor, ingresa un número de control válido con el formato adecuado.");
            location.reload();
        }

        // Validación de preguntas
        const errorElements = document.querySelectorAll('.error');
        errorElements.forEach(el => el.textContent = ""); // Limpiar mensajes de error

        for (let i = 1; i <= errorElements.length; i++) {
            const questionName = `preg${i}`;
            let pregunta = document.getElementsByName(questionName);
            let answered = false;

            for (let j = 0; j < pregunta.length; j++) {
                if (pregunta[j].checked) {
                    answered = true;
                    break;
                }
            }

            if (!answered) {
                valid = false; // Cambiar valid a false si no se ha respondido
                errorElements[i - 1].textContent = "Por favor, conteste esta pregunta.";
            }
        }

        if (!valid) {
            event.preventDefault();
            document.getElementById('error_preg').textContent = "Por favor, complete todas las preguntas.";
        } else {
            document.getElementById('error_preg').textContent = "";
            this.submit();
        }
            });

    // Carga las preguntas al cargar la página
    document.addEventListener('DOMContentLoaded', fetchQuestions);
