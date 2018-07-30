const FRAME_RATE = 1;
const STROKE_WEIGHT = .1;
const STROKE_COLOR = '255, 255, 255';
const localization = {
    numberOfIteration: 'Number of iteration',
    delaySpeed: 'Delay (speed)',
    generate: 'Generate',
    snapshot: 'Snapshot (NThan)',
    arcIterationStep: 'Arc iteration step'
}

let sequence = [];
let points = [];
let counter = 1;
let index = 0;
let delay = 0;
let delayStep = 0;
let maxOfSequence = 0;
let arcIterationStep = 0.5;

let canvas;
let sequenceNumberInput;
let delayInput;
let arcIterationStepInput;
let generateButton;

let timeouts = [];

function setup() {
    // canvas
    canvas = createCanvas(
        window.innerWidth * .75,
        window.innerHeight
    );
    canvas.position(0, 0);
    background(0);
    
    // inputs, html
    sequenceNumberInput = createInput('120', 'number');
    sequenceNumberInput.elt.step = '20';
    let labelNumberInput = createSpan(localization.numberOfIteration);
    labelNumberInput.position(canvas.width, 0);
    sequenceNumberInput.position(canvas.width + 150, 0);

    delayInput = createInput('0.5', 'number');
    delayInput.elt.step = '0.5';
    let labelDelayInput = createSpan(localization.delaySpeed);
    labelDelayInput.position(canvas.width, sequenceNumberInput.height + 5);
    delayInput.position(canvas.width + 150, sequenceNumberInput.height + 5);

    arcIterationStepInput = createInput('0.5', 'number');
    arcIterationStepInput.elt.step = '0.5';
    let labelArcIterationStepInput = createSpan(localization.arcIterationStep);
    labelArcIterationStepInput.position(canvas.width, sequenceNumberInput.height + delayInput.height + 10);
    arcIterationStepInput.position(canvas.width + 150, sequenceNumberInput.height + delayInput.height + 10);

    generateButton = createButton(localization.generate);
    generateButton.mousePressed(generateRecamanSequence);
    generateButton.position(canvas.width, sequenceNumberInput.height + delayInput.height + arcIterationStepInput.height + 15);

    snapshotButton = createButton(localization.snapshot);
    snapshotButton.mousePressed(() => {
        saveCanvas(canvas, 'recaman_sequence', 'jpg');
    });
    snapshotButton.position(canvas.width + generateButton.width + 10, sequenceNumberInput.height + delayInput.height + arcIterationStepInput.height + 15)
}

function generateRecamanSequence() {
    let inputNumber = sequenceNumberInput.value();
    let inputDelay = delayInput.value();
    let arcIterationStepValue = arcIterationStepInput.value();
    console.log(arcIterationStepValue);

    if(!isNaN(inputNumber) && !isNaN(inputDelay) && !isNaN(arcIterationStepValue)) {
        resetGlobalVars();
        delayStep = parseInt(inputDelay);
        arcIterationStep = parseFloat(arcIterationStepValue);

        sequence.push(index);
        for(let i = 0; i < parseInt(Math.floor(inputNumber)); i++) {
            nextSequenceNumber();
        }
    } else alert('inputs must be numbers');
}

function draw() {
    frameRate(FRAME_RATE);
    translate(0, height / 2);
    scale(canvas.width / maxOfSequence);

    if(points.length) {
        points
        .map((point, index) => {
            drawEllipse(point.x, point.y);
            points = points.filter(value => value == point);
            delay += delayStep;
        });
    }
}

function nextSequenceNumber() {
    let next = index - counter;
    if(next <= 0 || sequence.includes(next)) {
        next = index + counter;
    }
    sequence.push(next);

    let arc = new Arc(index, next, counter % 2, next < index);
    arc.generatePoints().map((point) => {
        points.push(point);
    });

    if(index > maxOfSequence) 
        maxOfSequence = index;

    index = next;
    counter++;
}

function drawEllipse(x, y, r = .1) {
    stroke(STROKE_COLOR);
    strokeWeight(STROKE_WEIGHT);
    let timeout = setTimeout(() => {
        ellipse(x, y, r, r);
    }, delay);
    timeouts.push(timeout);
}

function resetGlobalVars() {
    sequence = [];
    points = [];
    counter = 1;
    index = 0;
    delay = 0;
    delayStep = 0;
    maxOfSequence = 0;
    background(0);
    timeouts.map(timeout => clearTimeout(timeout));
}
