/* Scene Dimensions (in meters: at z = 0) */
var mySceneTLX;        /* Top Left corner X coordinate */
var mySceneTLY;        /* Top Left corner Y coordinate */
var mySceneBRX;        /* Bottom Right corner X coordinate */
var mySceneBRY;        /* Bottom Right corner Y coordinate */
var mySceneW;          /* Scene Width */
var mySceneH;          /* Scene Height */
var myCenterX;         /* Scene Center X coordinate */
var myCenterY;         /* Scene Center Y coordinate */

/* Object Variables */
var container;
var resistor;
var voltage_source;
var thermometer;
var stopwatch;
var water;

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

var controls;
function startOrbitalControls() {
    controls = new THREE.OrbitControls(PIEcamera, PIErenderer.domElement);
    controls.enabled = false;
}

function initializeScene () {
    /* Initialise Scene Variables */
    mySceneTLX = -16;
    mySceneTLY = 27;
    mySceneBRX = 16;
    mySceneBRY = 12;
    mySceneW   = (mySceneBRX - mySceneTLX);
    mySceneH   = (mySceneTLY - mySceneBRY);
    myCenterX  = (mySceneTLX + mySceneBRX) / 2.0;
    myCenterY  = (mySceneTLY + mySceneBRY) / 2.0;

    var light = new THREE.PointLight( 0xff0000, 7, 200 );
    PIEaddElement( light );
    light.position.set(-50,50,50);

    PIEscene.background = new THREE.Color( 0x9cb798 );
    //PIEscene.background = new THREE.Color( 0xFCEDB2 );
    var ambient = new THREE.AmbientLight( 0x555555 );
    PIEaddElement(ambient);

    var light = new THREE.DirectionalLight( 0x123456 );
    light.position = PIEcamera.position;
    PIEaddElement(light);

    var ambient = new THREE.AmbientLight( 0x555555 );
    PIEaddElement(ambient);

    var light = new THREE.DirectionalLight( 0x123456 );
    light.position = PIEcamera.position;
    PIEaddElement(light);

    /*var groundMaterial = new THREE.MeshPhongMaterial( { color: 0x024406, specular: 0x111111} );
    var mesh233 = new THREE.Mesh( new THREE.PlaneBufferGeometry( 2000, 2000 ), groundMaterial );
    mesh233.position.y = -25;
    mesh233.rotation.x = - Math.PI / 2;
    PIEaddElement( mesh233 );*/

    //PIEadjustDisplayScene();
    PIErenderer.shadowMapEnabled = false;
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

    contWidth = mySceneW/6;
    contHeight = mySceneH/2;
    contTLX = myCenterX - contWidth/2;
    contTLY = myCenterY - contHeight/2;
}

function addSwitchPrism(x,y,z,ang,color){
    PrismGeometry = function ( vertices, height ) {
        var Shape = new THREE.Shape();

        ( function f( ctx ) {

            ctx.moveTo( vertices[0].x, vertices[0].y );
            for (var i=1; i < vertices.length; i++) {
                ctx.lineTo( vertices[i].x, vertices[i].y );
            }

            ctx.lineTo( vertices[0].x, vertices[0].y );

        } )( Shape );

        var settings = { };
        settings.amount = height;
        settings.bevelEnabled = false;
        THREE.ExtrudeGeometry.call( this, Shape, settings );

    };

    //Object of Prism Class
    PrismGeometry.prototype = Object.create( THREE.ExtrudeGeometry.prototype );


    /*-----------------First Prism starts----------*/

    //Coordinates of first prism
    var A = new THREE.Vector2(  0, 0 );
    var B = new THREE.Vector2(  0.7, 0 );
    var C = new THREE.Vector2(  0, 0.3 );

    //height of first prism
    var height1 = 0.5;

    //geometry for prism prism
    var geometry1 = new PrismGeometry( [ A, B, C ], height1 );

    var geometry2 = new PrismGeometry( [ A, B, C ], height1 );

    var material1 = new THREE.MeshPhongMaterial( { color: color} );

    var material2 = new THREE.MeshPhongMaterial( { color: 0x000} );

    prism1 = new THREE.Mesh( geometry1, material1 );
    prism1.position.y += x;
    prism1.position.x += y;
    prism1.position.z += z;
    prism1.rotation.y += ang;

    base.add(prism1);

    prism2 = new THREE.Mesh( geometry2, material2 );
    prism2.position.y += x-0.25;
    prism2.position.x += y+1.3;
    prism2.position.z += z+0.5;
    prism2.rotation.y += Math.PI;
    prism2.rotation.z += Math.PI/8;

    base.add(prism2 );
}

function addSwitch () {
    var baseGeom = new THREE.BoxGeometry( 3, 1, 2 );
    base = new THREE.Mesh(baseGeom, new THREE.MeshBasicMaterial( {/*color: 0xd3d3d3*/color: "gray"} ));

    var edges = new THREE.EdgesGeometry( baseGeom );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000 } ) );

    base.add(line);

    base.rotation.y += Math.PI / 6;
    base.position.x +=6;
    PIEaddElement(base);
    addSwitchPrism(0.5,-0.8,-0.3,0,0xff0000);

    cylgeom = new THREE.CylinderGeometry( 0.1, 0.1, 0.5, 32 );
    cylgeom.translate(1.2,0.5,0);
    var cylinder1 = new THREE.Mesh( cylgeom, new THREE.MeshBasicMaterial( {color: 0xff0000} ) );

    cylgeom2 = new THREE.CylinderGeometry( 0.1, 0.1, 0.5, 32 );
    cylgeom2.translate(-1.2,0.5,0);
    var cylinder2 = new THREE.Mesh( cylgeom2, new THREE.MeshBasicMaterial( {color: 0x000000} ) );

    base.add(cylinder1);
    base.add(cylinder2);
}

function addContainer() {
    var containerGeo = new THREE.BoxGeometry (contWidth, contHeight, contWidth);
    var containerBox = new THREE.Mesh( containerGeo, new THREE.MeshBasicMaterial( {color: 0x9cb798, side: THREE.DoubleSide} ));
    containerBox.rotation.x -= Math.PI/6;
    containerBox.rotation.y -= Math.PI/6;
    containerBox.position.y += 2.5;
    containerBox.position.z += 2;
    var edges = new THREE.EdgesGeometry (containerGeo);
    var line = new THREE.LineSegments (edges, new THREE.LineBasicMaterial( {color: 0x00}));
    containerBox.add(line);
    PIEaddElement(containerBox);
    console.log(containerBox);

    var waterGeo = new THREE.BoxGeometry (contWidth+0.1, 4, contWidth+0.1);
    var waterBox = new THREE.Mesh (waterGeo, new THREE.MeshLambertMaterial( {color: "#00BFFF"} ));
    /*waterBox.rotation.x -= Math.PI/6;
    waterBox.rotation.y -= Math.PI/6;*/
    //waterBox.position.y = containerBox.position.y + 4/2 + 0.3 ;

    containerBox.add(waterBox);
    console.log(waterBox);

}

function addWires () {

    var curve4 = new THREE.CubicBezierCurve3(
        new THREE.Vector3( -9.2, -6.5, -4 ),
        new THREE.Vector3( -4, 8, -4 ),
        new THREE.Vector3( 3, 6, 4 ),
        new THREE.Vector3( 1, -5.6, 4 )
    );

    var tube4 = new THREE.TubeGeometry(curve4, 40, 0.05, 20, false);
    var mesh4 = new THREE.Mesh(tube4, new THREE.MeshBasicMaterial({color: "black"}));
    mesh4.position.x -= 2;
    mesh4.position.y += 1;
    PIEaddElement(mesh4);

    var curve3 = new THREE.CubicBezierCurve3(
        new THREE.Vector3( -6, -6.5, -4 ),
        new THREE.Vector3( -2, 4, -4 ),
        new THREE.Vector3( 3, 4, 4 ),
        new THREE.Vector3( 1, -5.6, 4 )
    );

    var tube3 = new THREE.TubeGeometry(curve3, 40, 0.05, 20, false);
    var mesh3 = new THREE.Mesh(tube3, new THREE.MeshBasicMaterial({color: "black"}));
    mesh3.position.x -= 3.5;
    mesh3.position.y += 1;
    PIEaddElement(mesh3);

    var curve5 = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-2.5, 4.6, 0),
        new THREE.Vector3(-2.4, 4.2, 0),
        new THREE.Vector3(-2.3, 4.2, 0),
        new THREE.Vector3(-2.1, 4.56, 0)
    );

    var tube5 = new THREE.TubeGeometry(curve5, 40, 0.05, 20, false);
    var mesh5 = new THREE.Mesh(tube5, new THREE.MeshBasicMaterial({color: "black"}));
    mesh5.position.y -= 9.2;
    mesh5.position.z += 4;
    mesh5.position.x -= 0.005;
    PIEaddElement(mesh5);

    var curve6 = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-2.5, 4.6, 0),
        new THREE.Vector3(-2.4, 4.2, 0),
        new THREE.Vector3(-2.3, 4.2, 0),
        new THREE.Vector3(-2.1, 4.56, 0)
    );

    var tube6 = new THREE.TubeGeometry(curve6, 40, 0.05, 20, false);
    var mesh6 = new THREE.Mesh(tube6, new THREE.MeshBasicMaterial({color: "black"}));
    mesh6.position.y -= 9.16;
    mesh6.position.z += 4;
    mesh6.position.x += 1.1;
    PIEaddElement(mesh6);


}

function addVoltageSupply() {
    var voltageGeo = new THREE.BoxGeometry(3.5,2.5,2.5);
    var voltageMaterial = new THREE.MeshBasicMaterial({color: "#e8ff2c"});
    var voltageRegulator = new THREE.Mesh (voltageGeo, voltageMaterial);
    voltageRegulator.rotation.x -= Math.PI/6;
    voltageRegulator.rotation.y += Math.PI/6;
    voltageRegulator.position.x -= 9;
    voltageRegulator.position.y -= 4;
    var edges = new THREE.EdgesGeometry(voltageGeo);
    var lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: "black"}));
    voltageRegulator.add(lines);

    var cylinderGeo = new THREE.CylinderGeometry(0.2,0.2,0.5,32);

    var positiveEnd = new THREE.Mesh(cylinderGeo, new THREE.MeshBasicMaterial({color: "#000000"}));
    voltageRegulator.add(positiveEnd);
    positiveEnd.position.y = voltageRegulator.position.y + 5.3;
    positiveEnd.position.x += 0.6;

    var negativeEnd = new THREE.Mesh(cylinderGeo, new THREE.MeshBasicMaterial({color: "#af0b13"}));
    voltageRegulator.add(negativeEnd);
    negativeEnd.position.y = voltageRegulator.position.y + 5.3;
    negativeEnd.position.x -= 0.92;

    PIEaddElement(voltageRegulator);
}

function addResistor () {
    var resistorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    var resistor = new THREE.Mesh(resistorGeo, new THREE.MeshBasicMaterial({color: "#5001a1"}));
    resistor.position.y -= 3.7;
    resistor.position.x -= 1.65;
    resistor.position.z += 5;
    resistor.rotation.x -= Math.PI/6;
    resistor.rotation.z += Math.PI/2;

    var edges = new THREE.EdgesGeometry(resistorGeo);
    var lines = new THREE.LineSegments(edges, new THREE.LineDashedMaterial({color: "#000000"}));
    resistor.add(lines);

    PIEaddElement(resistor);
}

function  addThermometer() {
    var thermoGeo = new THREE.CylinderGeometry(0.04, 0.04, 7.5, 32);
    var thermometer = new THREE.Mesh(thermoGeo, new THREE.MeshBasicMaterial({color: "#af0b13"}));
    thermometer.position.z += 4;
    thermometer.position.x += 1.6;
    thermometer.rotation.x -= Math.PI/6;
    thermometer.rotation.y += Math.PI/6;
    PIEaddElement(thermometer);
}

function addTable () {
    var tableGeom = new THREE.CubeGeometry( 20, 0.5, 20, 4, 4, 1 );
    var tableTop =  new THREE.Mesh( tableGeom,new THREE.MeshBasicMaterial({color: 0x8B4513}));
    tableTop.position.y -=0.8;
    tableTop.rotation.x -= Math.PI/6;
    tableTop.position.z += 5.2;
    PIEaddElement(tableTop);

    var edges = new THREE.EdgesGeometry( tableGeom );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000 } ) );

    tableTop.add(line);

    var tablelegGeom = new THREE.CubeGeometry( 0.5, 10, 0.5, 4, 4, 1 );
    var tableleg =  new THREE.Mesh( tablelegGeom,new THREE.MeshBasicMaterial({color: 0x8B4513}));
    tableleg.position.set(-9.5,-5,9.5);

    var edges2 = new THREE.EdgesGeometry( tablelegGeom );
    var line2 = new THREE.LineSegments( edges2, new THREE.LineBasicMaterial( { color: 0x000 } ) );

    tableleg.add(line2);
    tableTop.add(tableleg);


    var tablelegGeom2 = new THREE.CubeGeometry( 0.5, 10, 0.5, 4, 4, 1 );
    var tableleg2 =  new THREE.Mesh( tablelegGeom2,new THREE.MeshBasicMaterial({color: 0x8B4513}));
    tableleg2.position.set(9.5,-5,9.5);

    var edges3 = new THREE.EdgesGeometry( tablelegGeom2 );
    var line3 = new THREE.LineSegments( edges3, new THREE.LineBasicMaterial( { color: 0x000 } ) );

    tableleg2.add(line3);
    tableTop.add(tableleg2);


    var tablelegGeom3 = new THREE.CubeGeometry( 0.5, 10, 0.5, 4, 4, 1 );
    var tableleg3 =  new THREE.Mesh( tablelegGeom3,new THREE.MeshBasicMaterial({color: 0x8B4513}));
    tableleg3.position.set(-9.5,-5,-9.5);

    var edges4 = new THREE.EdgesGeometry( tablelegGeom3 );
    var line4 = new THREE.LineSegments( edges4, new THREE.LineBasicMaterial( { color: 0x000 } ) );

    tableleg3.add(line4);
    tableTop.add(tableleg3);


    var tablelegGeom4 = new THREE.CubeGeometry( 0.5, 10, 0.5, 4, 4, 1 );
    var tableleg4 =  new THREE.Mesh( tablelegGeom4,new THREE.MeshBasicMaterial({color: 0x8B4513}));
    tableleg4.position.set(9.5,-5,-9.5);

    var edges5 = new THREE.EdgesGeometry( tablelegGeom4 );
    var line5 = new THREE.LineSegments( edges5, new THREE.LineBasicMaterial( { color: 0x000 } ) );

    tableleg4.add(line5);
    tableTop.add(tableleg4);
}

function addElementsToScene () {
    //addSwitch();
    addContainer();
    addWires();
    addVoltageSupply();
    addResistor();
    addThermometer();
    addTable();
}

function loadExperimentElements () {
    var geometry, material;

    PIEsetExperimentTitle("Heating Calculations of Electric Current");
    PIEsetDeveloperName("Sudharsan K A");

    initializeScene();
    initializeOtherVariables();
    addElementsToScene();

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
    startOrbitalControls();

    PIErender();

}

function  updateExperimentElements () {

}

function resetExperiment() {

}