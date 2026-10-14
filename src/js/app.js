import { morseMap, reverseMorseMap } from './morseDictionary.js';
import '../css/styles.css';

document.addEventListener('DOMContentLoaded', () => {
  const inputTextArea = document.getElementById('input-text');
  const outputTextArea = document.getElementById('output-text');
  const convertBtn = document.getElementById('convert-btn');
  const modeSelector = document.getElementById('mode-selector');
  const inputLabel = document.getElementById('input-label');
  const outputLabel = document.getElementById('output-label');
  const statusLog = document.getElementById('status-log');

  modeSelector.addEventListener('change', (e) => {
    if (e.target.value === 'text-to-morse') {
      inputLabel.textContent = 'TEXTO COMÚN (MENSAJE OFICIAL):';
      outputLabel.textContent = 'CÓDIGO MORSE INTERCEPTADO:';
      inputTextArea.placeholder = 'Escriba su mensaje en texto plano...';
    } else {
      inputLabel.textContent = 'CÓDIGO MORSE (PUNTOS Y RAYAS):';
      outputLabel.textContent = 'TEXTO TRADUCIDO:';
      inputTextArea.placeholder = 'Ej: .-.. --- -- ... .';
    }
    inputTextArea.value = '';
    outputTextArea.value = '';
    statusLog.textContent = 'ESTADO: SISTEMA EN ESPERA DE COMANDO.';
  });

  const handleConversion = () => {
    const rawInput = inputTextArea.value.trim();
    const mode = modeSelector.value;

    if (!rawInput) {
      statusLog.textContent = '¡ADVERTENCIA! EL REGISTRO DE ENTRADA ESTÁ VACÍO.';
      statusLog.style.color = '#ff3333';
      outputTextArea.value = '';
      return;
    }

    if (mode === 'text-to-morse') {
      const sanitizedInput = rawInput.toUpperCase();
      let morseResult = '';
      
      for (let i = 0; i < sanitizedInput.length; i++) {
        const char = sanitizedInput[i];
        if (morseMap[char] !== undefined) {
          morseResult += morseMap[char] + ' ';
        } else if (char === '\n') {
          morseResult += '\n';
        } else {
          statusLog.textContent = `¡ERROR! CARÁCTER NO RECONOCIDO EN EL ARCHIVO: "${char}"`;
          statusLog.style.color = '#ff3333';
          return;
        }
      }
      outputTextArea.value = morseResult.trim();
      statusLog.textContent = 'ESTADO: TRANSMISIÓN A MORSE EXITOSA. CCCP.';
      statusLog.style.color = '#33ff33';

    } else {
      const morseRegex = /^[.\-\/\s]+$/;
      if (!morseRegex.test(rawInput)) {
        statusLog.textContent = '¡ERROR! EL CÓDIGO MORSE CONTIENE SÍMBOLOS INVÁLIDOS.';
        statusLog.style.color = '#ff3333';
        return;
      }
      const words = rawInput.split(' / ');
      let textResult = '';

      try {
        textResult = words.map(word => {
          return word.split(' ').map(code => {
            if (code === '') return '';
            const translatedChar = reverseMorseMap[code];
            if (translatedChar === undefined) {
              throw new Error(`Secuencia desconocida: ${code}`);
            }
            return translatedChar;
          }).join('');
        }).join(' ');

        outputTextArea.value = textResult;
        statusLog.textContent = 'ESTADO: DECODIFICACIÓN COMPLETADA CON ÉXITO.';
        statusLog.style.color = '#33ff33';
      } catch (err) {
        statusLog.textContent = `¡ERROR DE DECODIFICACIÓN! ${err.message}`;
        statusLog.style.color = '#ff3333';
      }
    }
  };

  convertBtn.addEventListener('click', handleConversion);
});