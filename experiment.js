/* Scene Dimensions (in meters: at z = 0) */
var mySceneTLX;        /* Top Left corner X coordinate */
var mySceneTLY;        /* Top Left corner Y coordinate */
var mySceneBRX;        /* Bottom Right corner X coordinate */
var mySceneBRY;        /* Bottom Right corner Y coordinate */
var mySceneW;          /* Scene Width */
var mySceneH;          /* Scene Height */
var myCenterX;         /* Scene Center X coordinate */
var myCenterY;         /* Scene Center Y coordinate */

/* Object geometry variables */
/* Container */
var contWidth;
var contHeight;
var contTLX;
var contTLY;

/* Resistor */
var resistorWidth;
var resistorHeight;
var resistorTLX;
var resistorTLY;

/* Voltage source */
var voltageWidth;
var voltageHeight;
var voltageTLX;
var voltageTLY;

/* Thermometer */
var thermWidth;
var thermHeight;
var thermTLX;
var thermTLY;

/* Stopwatch */
var stopwatchWidth;
var stopwatchHeight;
var stopwatchTLX;
var stopwatchTLY;

/* Water */
var waterWidth;
var waterHeight;
var waterTLX;
var waterTLY;
/*********************/

/* Parameter variables */
var resistance;
var voltage;
var switchOn;
var temperature;
var time;
var electricEnergy;
var heatEnergy;
var waterLevel;


function initializeScene () {
    /* Initialise Scene Variables */
    mySceneTLX = 0.0;
    mySceneTLY = 3.0;
    mySceneBRX = 4.0;
    mySceneBRY = 0.0;
    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;
}

function  initializeOtherVariables () {
    resistance = 20;
    voltage = 220;
    switchOn = false;
    temperature = 35;
    time = 0;
    electricEnergy = 0;
    heatEnergy = 0;
    waterLevel = 0.75;
}

function loadExperimentElements () {
    PIEsetExperimentTitle("Heating Calculations of Electric Current");
    PIEsetDeveloperName("Sudharsan K A");

    initializeScene();


}

function  updateExperimentElements () {

}