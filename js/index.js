import { getQuickConfidenceBounds, OBSERVED_FAIL_RATE } from './statisticalCalculator.js';

// Sliders
const entityCountSlider = document.getElementById('entityCount');
const failedEntityCountSlider = document.getElementById('failedEntityCount');

// Displays
const entityCountSliderDisplay = document.getElementById('entityCountDisplay');
const failedEntityCountDisplay = document.getElementById('failedEntityCountDisplay');
const alarmText = document.getElementById('alarm-text');
const confidenceBoundText = document.getElementById('confidence-bounds-text');

// Inputs
const lowerConfidenceInput = document.getElementById('lowerConfidence');
const upperConfidenceInput = document.getElementById('upperConfidence');

function initializeSliders() {
  entityCountSliderDisplay.innerHTML = entityCountSlider.value;
  failedEntityCountDisplay.innerHTML = failedEntityCountSlider.value;
}

entityCountSlider.addEventListener('input', () => {
  entityCountSliderDisplay.innerHTML = entityCountSlider.value;
});

failedEntityCountSlider.addEventListener('input', () => {
  failedEntityCountDisplay.innerHTML = failedEntityCountSlider.value;
});

/**
 * @returns {{ entityCount: number,
 * failedEntityCount: number,
 * lowerConfidence: number,
 * upperConfidence: number }}
 */
function getCalculationValues() {
  return {
    entityCount: entityCountSlider.value,
    failedEntityCount: failedEntityCountSlider.value,
    lowerConfidence: lowerConfidenceInput.value,
    upperConfidence: upperConfidenceInput.value
  };
}

/**
 * @param {number} failedEntityCount 
 * @param {Array<number>} confidenceBounds 
 * @returns {boolean}
 */
function shouldTriggerAlarm(failedEntityCount, confidenceBounds) {
  return failedEntityCount < confidenceBounds.lowerBound
    || failedEntityCount > confidenceBounds.upperBound
}

/**
 * @param {string} text 
 */
function setAlarmText(text) {
  alarmText.innerText = text;
}

/**
 * @param {string} text 
 */
function setConfidenceBoundText(text) {
  confidenceBoundText.innerText = text;
}

function calculate() {
  const calculationValues = getCalculationValues();
  const confidenceBounds = getQuickConfidenceBounds(
    calculationValues.entityCount,
    OBSERVED_FAIL_RATE,
    [calculationValues.lowerConfidence, calculationValues.upperConfidence]
  );

  setAlarmText(shouldTriggerAlarm(calculationValues.failedEntityCount, confidenceBounds) ? 'YES!' : 'NO');
  setConfidenceBoundText(`[${confidenceBounds.lowerBound}, ${confidenceBounds.upperBound}]`);
}

function run() {
  initializeSliders();
  calculate();

  Array.from(document.getElementsByClassName('slider-input')).forEach(slider => {
    slider.addEventListener('input', calculate);
  });

  const confidenceInputContainer = document.getElementsByClassName('confidence-number-container')[0];
  Array.from(confidenceInputContainer.getElementsByTagName('input')).forEach(input => {
    input.addEventListener('input', calculate);
  });
}

run();