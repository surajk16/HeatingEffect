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
var voltageRegulator;
var water;
var prism1,prism2;

/* Object geometry variables */
/* Container */
var contWidth;
var contHeight;
var contTLX;
var contTLY;

/*********************/

/* Parameter variables */
var resistance;
var voltage;
var flag;
var temperature;
var initialTemperature;
var time;
var electricEnergy;
var heatEnergy;
var waterLevel;
var startTime;

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
    resistance = 2;
    voltage = 220;
    flag = 0;
    temperature = initialTemperature = 36;
    time = 0;
    electricEnergy = 0;
    heatEnergy = 0;
    waterLevel = 3;

    contWidth = mySceneW/6;
    contHeight = mySceneH/3;
    contTLX = myCenterX - contWidth/2;
    contTLY = myCenterY - contHeight/2;
}

function addSwitchPrism(x,y,z,ang,color){
    var PrismGeometry = function ( vertices, height ) {
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

var base;
function addSwitch(){
    var baseGeom = new THREE.BoxGeometry( 2, 0.01, 1 );
    base = new THREE.Mesh(baseGeom, new THREE.MeshBasicMaterial( {/*color: 0xd3d3d3*/color: "gray"} ));

    var edges = new THREE.EdgesGeometry( baseGeom );
    var line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0x000 } ) );

    base.add(line);

    base.rotation.x -= Math.PI/6 - Math.PI/2  ;
    base.rotation.y -=  0;
    base.rotation.z -= Math.PI/6 ;
    base.position.x -=4;
    base.position.z += 10;
    base.position.y += 6;
    PIEaddElement(base);
    addSwitchPrism(0.5,-0.8,-0.3,0,0xff0000);
}
function addContainer() {
    var containerGeo = new THREE.BoxGeometry (contWidth, contHeight, contWidth);
    container = new THREE.Mesh( containerGeo, new THREE.MeshBasicMaterial( {color: "#b6b6b6", side: THREE.DoubleSide} ));
    container.rotation.x -= Math.PI/6;
    container.rotation.y -= Math.PI/6;
    container.position.y += 4;
    container.position.z += 5;
    container.position.x += 3;

    var edges = new THREE.EdgesGeometry (containerGeo);
    var line = new THREE.LineSegments (edges, new THREE.LineBasicMaterial( {color: 0x00}));
    container.add(line);

    PIEaddElement(container);

    var waterGeo = new THREE.BoxGeometry (contWidth+0.05, 3*contHeight/10, contWidth+0.1);
    water = new THREE.Mesh (waterGeo, new THREE.MeshBasicMaterial({color: "#266bff"} ));
    edges = new  THREE.EdgesGeometry(waterGeo);
    line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( {color: 0x00}));
    water.add(line);
    water.position.y -= (contHeight - 3*contHeight/10)/2;

    container.add(water);

}

function addWires () {

    var curve4 = new THREE.CubicBezierCurve3(
        new THREE.Vector3( -5.6, 5.6, 7 ),
        new THREE.Vector3( -4, 13, 7 ),
        new THREE.Vector3( 1.2, 13, 9 ),
        new THREE.Vector3( 1.6, 4.4, 9 )
    );

    var tube4 = new THREE.TubeGeometry(curve4, 40, 0.05, 20, false);
    var mesh4 = new THREE.Mesh(tube4, new THREE.MeshBasicMaterial({color: "black"}));
    PIEaddElement(mesh4);

    var curve3 = new THREE.CubicBezierCurve3(
        new THREE.Vector3( -4.1, 5.6, 7 ),
        new THREE.Vector3( -2, 11, 7 ),
        new THREE.Vector3( 0.2, 11, 8 ),
        new THREE.Vector3( 0.3, 3.48, 8 )
    );

    var tube3 = new THREE.TubeGeometry(curve3, 40, 0.05, 20, false);
    var mesh3 = new THREE.Mesh(tube3, new THREE.MeshBasicMaterial({color: "black"}));
    PIEaddElement(mesh3);

    var curve5 = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-2.5, 4.2, 0),
        new THREE.Vector3(-2.4, 3.8, 0),
        new THREE.Vector3(-2.3, 3.8, 0),
        new THREE.Vector3(-2.1, 4.2, 0)
    );

    var tube5 = new THREE.TubeGeometry(curve5, 40, 0.05, 20, false);
    var mesh5 = new THREE.Mesh(tube5, new THREE.MeshBasicMaterial({color: "black"}));
    mesh5.position.y -= 0.5;
    mesh5.position.z += 8;
    mesh5.position.x += 2.78;
    PIEaddElement(mesh5);

    var curve6 = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-2.5, 5, 1),
        new THREE.Vector3(-2.4, 4.6, 1),
        new THREE.Vector3(-2.3, 4.6, 1),
        new THREE.Vector3(-2.1, 5,1)
    );

    var tube6 = new THREE.TubeGeometry(curve6, 40, 0.05, 20, false);
    var mesh6 = new THREE.Mesh(tube6, new THREE.MeshBasicMaterial({color: "black"}));
    mesh6.position.y -= 0.58;
    mesh6.position.z += 8;
    mesh6.position.x += 3.7;
    PIEaddElement(mesh6);


}

function addVoltageSupply() {
    var voltageGeo = new THREE.BoxGeometry(3.5,2.5,2.5);
    var voltageMaterial = new THREE.MeshBasicMaterial({color: "#e8ff2c"});
    voltageRegulator = new THREE.Mesh (voltageGeo, voltageMaterial);
    voltageRegulator.rotation.x -= Math.PI/6;
    voltageRegulator.rotation.y += Math.PI/6;
    voltageRegulator.position.x -= 5;
    voltageRegulator.position.y += 4;
    voltageRegulator.position.z += 7;
    var edges = new THREE.EdgesGeometry(voltageGeo);
    var lines = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: "black"}));
    voltageRegulator.add(lines);

    var cylinderGeo = new THREE.CylinderGeometry(0.2,0.2,0.5,32);

    var positiveEnd = new THREE.Mesh(cylinderGeo, new THREE.MeshBasicMaterial({color: "#000000"}));
    voltageRegulator.add(positiveEnd);
    positiveEnd.position.y += 1.2;
    positiveEnd.position.x += 0.8;

    var negativeEnd = new THREE.Mesh(cylinderGeo, new THREE.MeshBasicMaterial({color: "#af0b13"}));
    voltageRegulator.add(negativeEnd);
    negativeEnd.position.x -= 0.8;
    negativeEnd.position.y += 1.2;

    PIEaddElement(voltageRegulator);
}

function addResistor () {
    var resistorGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.8, 16);
    resistor = new THREE.Mesh(resistorGeo, new THREE.MeshBasicMaterial({color: "#f90cba"}));
    resistor.position.x += 0.85;
    resistor.position.y += 3.65;
    resistor.position.z += 8.2;
    resistor.rotation.x -= Math.PI/6;
    resistor.rotation.z += Math.PI/2;

    var edges = new THREE.EdgesGeometry(resistorGeo);
    var lines = new THREE.LineSegments(edges, new THREE.LineDashedMaterial({color: "#000000"}));
    resistor.add(lines);

    PIEaddElement(resistor);
}

function  addThermometer() {
    var whiteThermoGeo = new THREE.CylinderGeometry(0.08, 0.08, 5.2, 32);
    var whiteThermo = new THREE.Mesh(whiteThermoGeo, new THREE.MeshBasicMaterial({color: "#ffffff"}));
    whiteThermo.position.z += 8;
    whiteThermo.position.y += 6.2;
    whiteThermo.position.x += 3.5;
    whiteThermo.rotation.x -= Math.PI/6;
    whiteThermo.rotation.y += Math.PI/6;

    var redThermoGeo = new THREE.CylinderGeometry(0.04, 0.04, 5.2, 32);
    var redThermo = new THREE.Mesh(redThermoGeo, new THREE.MeshBasicMaterial({color: "#af0b13"}));
    redThermo.rotation.x -= Math.PI/6;
    redThermo.rotation.y += Math.PI/6;
    redThermo.position.x += 3.49;
    redThermo.position.y += 6.2;
    redThermo.position.z += 8.05;

    PIEaddElement(whiteThermo);
    PIEaddElement(redThermo);
}

function addTable () {
    var tableGeom = new THREE.CubeGeometry( 20, 0.5, 20, 4, 4, 1 );
    var tableTop =  new THREE.Mesh( tableGeom,new THREE.MeshBasicMaterial({color: 0x8B4513}));
    tableTop.position.y -=0.8;
    tableTop.rotation.x -= Math.PI/6;
    tableTop.position.z += 3.2;
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

var flag = 0 ;
function PIEmouseMove( event ) {
    var intersects;     // to hold return array of ray intersects

    event.defaultPrevented = true;

    PIEmouseP.x = ( event.clientX / PIEcanvasW ) * 2 - 1;
    PIEmouseP.y = - ( event.clientY / PIEcanvasH ) * 2 + 1;

    /* Cast the ray to find intersecting objects */
    PIEraycaster.setFromCamera(PIEmouseP, PIEcamera);

    if (PIEselectedDrag != null)
    {   /* Drag the element */
        PIEraycaster.ray.intersectPlane(PIEdragPlane, PIEdragIntersect);
        PIEdefaultDrag(PIEselectedDrag, PIEdragIntersect.sub(PIEdragOffset));
    }
    else
    {   /* If possible Call hoveron method of the nearest element */
        intersects = PIEraycaster.intersectObjects([prism2,prism1]);
        if (intersects.length > 0)
        {
            PIEdragPlane.setFromNormalAndCoplanarPoint(PIEcamera.getWorldDirection(PIEdragPlane.normal), intersects[0].object.position);
            if (PIEselectedHover != intersects[0].object)
            {
                PIEdefaultHoverOFF(PIEselectedHover);
                PIEselectedHover = intersects[0].object;
                PIEdefaultHoverON(PIEselectedHover);
            }
            PIEscreenElem.style.cursor = 'pointer';
        }
        else if (PIEselectedHover != null)
        {
            PIEdefaultHoverOFF(PIEselectedHover);
            PIEselectedHover = null;
            PIEscreenElem.style.cursor = 'auto';
        }
    }
}

function PIEmouseDown( event ) {

    var intersects;     // to hold return array of ray intersects

    // console.log("Mouse Down at ", PIEmouseP);
    event.defaultPrevented = true;
    var PIEselectedDrag = null;

    PIEmouseP.x = ( event.clientX / PIEcanvasW ) * 2 - 1;
    PIEmouseP.y = - ( event.clientY / PIEcanvasH ) * 2 + 1;

    PIEraycaster.setFromCamera(PIEmouseP, PIEcamera);
    intersects = PIEraycaster.intersectObjects(PIEdragElements);
    if (intersects.length > 0) {
        PIEselectedDrag = intersects[0].object;
        if (PIEraycaster.ray.intersectPlane(PIEdragPlane, PIEdragIntersect))
        {
            PIEdragOffset.copy(PIEdragIntersect).sub(PIEselectedDrag.position);
        }
        PIEscreenElem.style.cursor = 'move';
        PIEdefaultDragStart(PIEselectedDrag);
    }

    intersects = PIEraycaster.intersectObjects( [prism2,prism1] );
    if ( intersects.length > 0 ) {
        if(flag == 0){
            startAnimation();
        } else {
            stopAnimation();
        }
    }
    PIErender();
}

function addElementsToScene () {
    addSwitch();
    addContainer();
    addWires();
    addVoltageSupply();
    addResistor();
    addThermometer();
    addTable();
}

function  startAnimation () {
    flag = 1;
    temperature = initialTemperature;
    prism1.rotation.z += Math.PI/8;
    prism1.position.y += -0.25;
    prism2.rotation.z += -Math.PI/8;
    prism2.position.y += +0.25;

    startTime = new Date();
    PIEstartAnimation();
}

function stopAnimation () {
    flag = 0;
    PIEchangeDisplayCommand("Temperature : " + temperature + " °C",
                            "Temperature : " + initialTemperature + " °C",
                            test);
    temperature = initialTemperature;
    prism1.rotation.z += -Math.PI/8;
    prism1.position.y += +0.25;
    prism2.rotation.z += +Math.PI/8;
    prism2.position.y += -0.25;
    PIEstopAnimation();
}

function  test() {
}

function voltageChange (volt) {
    PIEchangeDisplayCommand("Voltage : " + voltage + " V", "Voltage : " + volt + " V", test);
    voltage = volt;
}

function waterLevelChange (level) {
    PIEchangeDisplayCommand("Water level : " + waterLevel + " L", "Water level : " + level + " L", test);
    waterLevel = level;

    container.remove(water);
    var waterGeo = new THREE.BoxGeometry (contWidth+0.05, level*contHeight/10, contWidth+0.1);
    water = new THREE.Mesh (waterGeo, new THREE.MeshBasicMaterial({color: "#266bff"} ));
    var edges = new  THREE.EdgesGeometry(waterGeo);
    var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( {color: 0x00}));
    water.add(line);
    water.position.y -= (contHeight - level*contHeight/10)/2;
    container.add(water);
    PIEremoveElement(container);
    PIEaddElement(container);
}

function resistanceChange (resistanceValue) {
    PIEchangeDisplayCommand("Resistance : " + resistance + " ohm", "Resistance : " + resistanceValue + " ohm", test);
    resistance = resistanceValue;
}

function temperatureChange (temp) {
    PIEchangeDisplayCommand("Temperature : " + initialTemperature + " °C", "Temperature : " + temp + " °C", test);
    initialTemperature = temp;
    temperature = temp;
}

function loadExperimentElements () {

    PIEsetExperimentTitle("Heating Calculations of Electric Current");
    PIEsetDeveloperName("Sudharsan K A");

    initializeScene();
    initializeOtherVariables();
    addElementsToScene();

    PIEsetAreaOfInterest(mySceneTLX, mySceneTLY, mySceneBRX, mySceneBRY);
    startOrbitalControls();

    document.getElementById("start").addEventListener("click", startAnimation);
    document.getElementById("stop").addEventListener("click", stopAnimation  );

    PIEaddInputSlider("Voltage: ", 220, voltageChange, 100, 400, 10);
    PIEaddInputSlider("Water level: ", 3, waterLevelChange, 2, 9, 1);
    PIEaddInputSlider("Resistance: ", 2, resistanceChange, 1, 10, 1);
    PIEaddInputSlider("Room temp: ", 36, temperatureChange, 30, 46, 1);
    PIEinputGUI.width = 280;

    var a = "Voltage : " + voltage + " V";
    var b = "Time : " + time + " secs";
    var c = "Electric energy : " + electricEnergy/1000 + " kJ";
    var d = "Heat energy : " + heatEnergy/1000 + " kJ";
    var e = "Temperature : " + temperature + " °C";
    var f = "Water level : " + waterLevel + " L";
    var g = "Resistance : " + resistance + " ohm";
    PIEaddDisplayCommand(a, test);
    PIEaddDisplayCommand(f, test);
    PIEaddDisplayCommand(g, test);
    PIEaddDisplayCommand(b, test);
    PIEaddDisplayCommand(c, test);
    PIEaddDisplayCommand(d, test);
    PIEaddDisplayCommand(e, test);
    PIEdisplayGUI.width = 400;
    PIErender();
}


function  updateExperimentElements () {
    var currentTime = new Date();
    if (flag === 1) {
        var difference = currentTime.getTime() - startTime.getTime();
        difference /= 1000;
        difference = Math.round(difference);
        if (difference !== time) {
            var tempElectricEnergy = voltage*voltage*difference/resistance;
            if (tempElectricEnergy !== electricEnergy) {
                PIEchangeDisplayCommand("Time : " + time + " secs", "Time : " + difference + " secs", test);
                PIEchangeDisplayCommand("Electric energy : " + electricEnergy/1000 + " kJ",
                    "Electric energy : " + tempElectricEnergy/1000 + " kJ",
                    test);
                PIEchangeDisplayCommand("Heat energy : " + heatEnergy/1000 + " kJ",
                    "Heat energy : " + tempElectricEnergy/1000 + " kJ",
                    test);
            }
            time = difference;
            electricEnergy = tempElectricEnergy;
            heatEnergy = tempElectricEnergy;

            var tempDiff = heatEnergy/(waterLevel*1000*4.18);
            var newTemp = initialTemperature + tempDiff;
            newTemp = newTemp.toFixed(2);
            console.log(temperature, newTemp);
            /*PIEchangeDisplayCommand("Temperature : " + initialTemperature + " °C",
                                    "Temperature : " + newTemp + " °C",
                                    test);*/
            PIEchangeDisplayCommand("Temperature : " + temperature + " °C",
                                    "Temperature : " + newTemp + " °C",
                                    test);
            temperature = newTemp;
        }
    }
}

function resetExperiment() {

    if (flag === 1)
        stopAnimation();

    PIEchangeDisplayCommand("Voltage : " + voltage + " V",
                            "Voltage : " + 220 + " V",
                            test);
    PIEchangeDisplayCommand("Water level : " + waterLevel + " L",
                            "Water level : " + 3 + " L",
                            test);
    PIEchangeDisplayCommand("Resistance : " + resistance + " ohm",
                            "Resistance : " + 2 + " ohm",
                            test);
    PIEchangeDisplayCommand("Time : " + time + " secs",
                            "Time : " + 0 + " secs",
                            test);
    PIEchangeDisplayCommand("Electric energy : " + electricEnergy/1000 + " kJ",
                            "Electric energy : " + 0 + " kJ",
                            test);
    PIEchangeDisplayCommand("Heat energy : " + heatEnergy + " kJ",
                            "Heat energy : " + 0 + " kJ",
                            test);
    PIEchangeDisplayCommand("Temperature : " + temperature + " °C",
                            "Temperature : " + 36 + " °C",
                            test);
    initializeOtherVariables();
    PIEchangeInputSlider("Voltage: ",220);
    PIEchangeInputSlider("Water level: ",3);
    PIEchangeInputSlider("Resistance: ",2);
    PIEchangeInputSlider("Room temp: ",36);

    waterLevelChange(3);
}