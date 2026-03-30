/**
 * Recology Waste Sorter - Teachable Machine Integration
 * SF Bins: Green (Compost), Blue (Recycle), Black (Landfill)
 */

const MODEL_URL = 'https://teachablemachine.withgoogle.com/models/q1teqiLvb/';
const CONFIDENCE_THRESHOLD = 0.8;

// Bin mapping: class name keywords -> bin type
const BIN_KEYWORDS = {
  green: ['compost', 'food', 'plant', 'green', 'organic', 'fruit', 'vegetable', 'apple', 'banana', 'leaf'],
  blue: ['paper', 'plastic', 'glass', 'metal', 'blue', 'recycle', 'bottle', 'can', 'cardboard'],
  black: ['black', 'landfill', 'trash', 'garbage', 'other', 'waste']
};

const BIN_DISPLAY = {
  green: {
    emoji: '🍎',
    text: 'Put it in the GREEN BIN!',
    bgClass: 'bin-green'
  },
  blue: {
    emoji: '♻️',
    text: 'Put it in the BLUE BIN!',
    bgClass: 'bin-blue'
  },
  black: {
    emoji: '🗑️',
    text: 'Put it in the BLACK BIN!',
    bgClass: 'bin-black'
  }
};

let model = null;
let webcam = null;
let isRunning = false;

const startBtn = document.getElementById('startBtn');
const cameraPlaceholder = document.getElementById('cameraPlaceholder');
const webcamEl = document.getElementById('webcam');
const emojiDisplay = document.getElementById('emojiDisplay');
const instructionEl = document.getElementById('instruction');

/**
 * Map a class name from the model to a bin type (green, blue, or black)
 */
function getBinFromClass(className) {
  const lower = className.toLowerCase();
  
  for (const [bin, keywords] of Object.entries(BIN_KEYWORDS)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return bin;
    }
  }
  
  // Fallback: use index for 3-class models (Green=0, Blue=1, Black=2)
  // Or default to black for unknown
  return 'black';
}

/**
 * Map model prediction to bin - supports both class names and indices
 */
function getBinFromPrediction(prediction, classIndex, allClasses) {
  const bin = getBinFromClass(prediction.className);
  
  // If class name didn't match keywords, try index-based mapping for standard 3-bin setups
  if (bin === 'black' && allClasses && allClasses.length === 3) {
    const idxMap = ['green', 'blue', 'black'];
    return idxMap[classIndex] || 'black';
  }
  
  return bin;
}

async function loadModel() {
  const modelURL = MODEL_URL + 'model.json';
  const metadataURL = MODEL_URL + 'metadata.json';
  model = await tmImage.load(modelURL, metadataURL);
}

async function initCamera() {
  const videoOpts = { width: { ideal: 640 }, height: { ideal: 480 } };
  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    videoOpts.facingMode = { ideal: 'environment' };
  }
  const stream = await navigator.mediaDevices.getUserMedia({
    video: videoOpts,
    audio: false
  });
  webcamEl.srcObject = stream;
  webcamEl.classList.add('active');
  cameraPlaceholder.classList.add('hidden');
}

async function startSorting() {
  if (isRunning) return;
  
  startBtn.disabled = true;
  startBtn.textContent = 'Loading... ⏳';
  
  try {
    await loadModel();
    await initCamera();
    
    startBtn.textContent = 'Sorting! 📸';
    isRunning = true;
    
    // Wait for video to be ready
    webcamEl.onloadedmetadata = () => {
      webcamEl.play();
    };
    
    if (webcamEl.readyState >= 2) {
      webcamEl.play();
    }
    
    loop();
  } catch (err) {
    console.error(err);
    alert('Oops! We need camera permission to sort. Please allow camera access and try again.');
    startBtn.disabled = false;
    startBtn.textContent = 'Start Sorting! 🚀';
  }
}

async function loop() {
  if (!isRunning || !model) return;
  
  if (webcamEl.readyState >= 2) {
    const predictions = await model.predict(webcamEl, true);
    const classes = model.getClassLabels ? model.getClassLabels() : [];
    
    let topPrediction = null;
    let topIdx = 0;
    
    for (let i = 0; i < predictions.length; i++) {
      if (!topPrediction || predictions[i].probability > topPrediction.probability) {
        topPrediction = predictions[i];
        topIdx = i;
      }
    }
    
    if (topPrediction && topPrediction.probability > CONFIDENCE_THRESHOLD) {
      const bin = getBinFromPrediction(topPrediction, topIdx, classes);
      const display = BIN_DISPLAY[bin];
      
      document.body.classList.remove('bin-green', 'bin-blue', 'bin-black');
      document.body.classList.add(display.bgClass);
      emojiDisplay.textContent = display.emoji;
      instructionEl.textContent = display.text;
    } else {
      document.body.classList.remove('bin-green', 'bin-blue', 'bin-black');
      emojiDisplay.textContent = '🔍';
      instructionEl.textContent = 'Point your camera at something to sort!';
    }
  }
  
  requestAnimationFrame(loop);
}

startBtn.addEventListener('click', startSorting);
