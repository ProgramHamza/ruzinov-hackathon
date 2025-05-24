"use client"; 

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'; 
import { OrbitControls, Text, Box, Sphere, Html, Line, Points } from '@react-three/drei';
import * as THREE from 'three';

// Constants for simulation
const ROOM_WIDTH = 10;
const ROOM_HEIGHT = 3;
const ROOM_DEPTH = 7;
const WALL_THICKNESS = 0.1;

const SENSOR_POSITIONS = [
  new THREE.Vector3(-ROOM_WIDTH / 4, ROOM_HEIGHT / 2 - 0.2, -ROOM_DEPTH / 4),
  new THREE.Vector3(0, ROOM_HEIGHT / 2 - 0.2, 0),
  new THREE.Vector3(ROOM_WIDTH / 4, ROOM_HEIGHT / 2 - 0.2, ROOM_DEPTH / 4),
];

const HEATER_POSITION = new THREE.Vector3(0, -ROOM_HEIGHT / 2 + 0.25, ROOM_DEPTH / 2 - 0.5);
const AC_POSITION = new THREE.Vector3(ROOM_WIDTH / 2 - 0.5, ROOM_HEIGHT / 2 - 0.5, 0);
const WINDOW_POSITION = new THREE.Vector3(0, 0, ROOM_DEPTH / 2 - WALL_THICKNESS / 2);
const WINDOW_SIZE = { width: ROOM_WIDTH / 2, height: ROOM_HEIGHT / 1.5 };
const LIGHT_POSITION = new THREE.Vector3(0, ROOM_HEIGHT / 2 - 0.15, 0); 

const CO2_PER_PERSON_PER_HOUR = 0.02; 
const HEAT_PER_PERSON_WATTS = 80; 
const SIMULATION_TICK_MS = 1000; 
const ANOMALY_CHECK_INTERVAL_MS = 5000; 
const HEATER_COLD_ROOM_DURATION_THRESHOLD_MS = 15000; 

// --- Helper Functions ---
const getTemperatureColor = (temp, minTemp = 0, maxTemp = 40) => {
  const normalizedTemp = Math.max(0, Math.min(1, (temp - minTemp) / (maxTemp - minTemp)));
  const color = new THREE.Color();
  color.setHSL(0.7 * (1 - normalizedTemp), 1, 0.5); 
  return color;
};

// --- 3D Components ---
function Sensor({ position, temperature, co2, humidity, lightLevel }) {
  const tempColor = useMemo(() => getTemperatureColor(temperature), [temperature]);
  const tempText = typeof temperature === 'number' ? temperature.toFixed(1) : 'N/A';
  const co2Text = typeof co2 === 'number' ? co2.toFixed(0) : 'N/A';
  const humidityText = typeof humidity === 'number' ? humidity.toFixed(0) : 'N/A';
  const lightText = typeof lightLevel === 'number' ? lightLevel.toFixed(2) : 'N/A';

  return (
    <group position={position}>
      <Sphere args={[0.1, 16, 16]} material-color={tempColor} />
      <Text position={[0, 0.3, 0]} fontSize={0.12} color="white" anchorX="center" anchorY="bottom">
        {tempText}°C, {humidityText}% Hum
      </Text>
      <Text position={[0, -0.2, 0]} fontSize={0.12} color="lightgray" anchorX="center" anchorY="top">
        CO2: {co2Text}ppm, Light: {lightText}
      </Text>
    </group>
  );
}

function Heater({ position, isOn, power }) {
  const heaterColor = useMemo(() => {
    if (!isOn) return new THREE.Color('gray');
    return power > 0.5 ? new THREE.Color('red') : new THREE.Color('orange');
  }, [isOn, power]);
  return <Box args={[0.5, 0.5, 0.2]} position={position} material-color={heaterColor} />;
}

function AC({ position, isOn }) {
  const acColor = useMemo(() => isOn ? new THREE.Color('lightblue') : new THREE.Color('darkgray'), [isOn]);
  return <Box args={[0.8, 0.4, 0.3]} position={position} material-color={acColor} />;
}

function Window({ position, size, openness }) {
  const windowPaneZOffset = openness * 0.1;
  const frameColor = useMemo(() => new THREE.Color("saddlebrown"), []);
  return (
    <group position={position}>
      <Box args={[size.width + 0.1, size.height + 0.1, WALL_THICKNESS]} material-color={frameColor} />
      <Box args={[size.width, size.height, WALL_THICKNESS / 2]} position={[0,0, windowPaneZOffset]}>
        <meshStandardMaterial color="skyblue" transparent opacity={0.3 + (1-openness) * 0.3} />
      </Box>
    </group>
  );
}

function AirflowArrow({ start, direction, active, color = "rgba(255,255,255,0.5)" }) {
  if (!active) return null;
  const points = useMemo(() => {
    const s = start.clone(); 
    const d = direction.clone(); 
    const end = new THREE.Vector3().addVectors(s, d.multiplyScalar(1.5));
    return [s, end]; 
  }, [start, direction]); 
  const lineColor = useMemo(() => new THREE.Color(color), [color]);
  return <Line points={points} color={lineColor} lineWidth={3} dashed dashSize={0.1} gapSize={0.05} />;
}

function WindowAirflowParticles({ active, openness, roomDepth, windowPos, windowSize }) {
  const count = 100;
  const particlesRef = useRef();

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = windowPos.x + (Math.random() - 0.5) * windowSize.width; 
      positions[i * 3 + 1] = windowPos.y + (Math.random() - 0.5) * windowSize.height; 
      positions[i * 3 + 2] = windowPos.z - Math.random() * 0.1; 
    }
    return positions;
  }, [windowPos.x, windowPos.y, windowPos.z, windowSize.width, windowSize.height]); 

  useFrame((state, delta) => {
    if (!active || !particlesRef.current) return;
    const positions = particlesRef.current.geometry.attributes.position.array;
    const speed = openness * 2 * delta;

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 2] -= speed * (1 + Math.random() * 0.5); 
      positions[i * 3 + 1] += (Math.random() - 0.5) * speed * 0.3; 

      if (positions[i * 3 + 2] < -roomDepth / 2 + WALL_THICKNESS * 2) {
        positions[i * 3 + 0] = windowPos.x + (Math.random() - 0.5) * windowSize.width;
        positions[i * 3 + 1] = windowPos.y + (Math.random() - 0.5) * windowSize.height;
        positions[i * 3 + 2] = windowPos.z - Math.random() * 0.1;
      }
    }
    particlesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  if (!active) return null;

  return (
    <Points ref={particlesRef} positions={particlePositions} stride={3} frustumCulled={false}>
      <pointsMaterial color="lightcyan" size={0.05} transparent opacity={0.7} depthWrite={false} />
    </Points>
  );
}

function InternalLight({ position, isOn }) {
    return (
        <mesh position={position}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial color={isOn ? "yellow" : "darkgrey"} emissive={isOn ? "yellow" : "black"} emissiveIntensity={isOn ? 1.5 : 0} /> 
        </mesh>
    );
}


// --- Main Simulation Component ---
function RoomModel({ roomState, outsideConditions }) {
  const {
    heaterOn, heaterPower, acOn, windowOpenness, numPeople, lightsOn,
    sensorData, roomAverageTemp, roomCO2, roomAverageHumidity, roomAverageLightLevel
  } = roomState;

  const { outsideTemp, outsideHumidity, outsideWindSpeed, outsideWindDir, timeOfDay } = outsideConditions;

  const wallMaterialColor = useMemo(() => new THREE.Color("#6c757d"), []); 
  const personMaterialColor = useMemo(() => new THREE.Color("purple"), []);
  const transparentMaterial = useMemo(() => new THREE.MeshStandardMaterial({ color: "#6c757d", transparent: true, opacity: 0.2, side: THREE.DoubleSide }), []); 


  const walls = useMemo(() => [
    { position: [0, 0, -ROOM_DEPTH / 2], args: [ROOM_WIDTH + WALL_THICKNESS * 2, ROOM_HEIGHT, WALL_THICKNESS], material: wallMaterialColor },
    { position: [-ROOM_WIDTH / 2, 0, 0], args: [WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH], material: wallMaterialColor }, 
    { position: [ROOM_WIDTH / 2, 0, 0], args: [WALL_THICKNESS, ROOM_HEIGHT, ROOM_DEPTH], material: wallMaterialColor }, 
    { position: [0, -ROOM_HEIGHT / 2, 0], args: [ROOM_WIDTH + WALL_THICKNESS * 2, WALL_THICKNESS, ROOM_DEPTH], material: wallMaterialColor },
    { position: [0, ROOM_HEIGHT / 2, 0], args: [ROOM_WIDTH + WALL_THICKNESS * 2, WALL_THICKNESS, ROOM_DEPTH], material: wallMaterialColor }, 
  ], [wallMaterialColor]);

  const frontWallPieces = useMemo(() => [
    { args:[(ROOM_WIDTH - WINDOW_SIZE.width)/2, ROOM_HEIGHT, WALL_THICKNESS], position:[- (WINDOW_SIZE.width + (ROOM_WIDTH - WINDOW_SIZE.width)/2)/2 , 0, ROOM_DEPTH/2] },
    { args:[(ROOM_WIDTH - WINDOW_SIZE.width)/2, ROOM_HEIGHT, WALL_THICKNESS], position:[ (WINDOW_SIZE.width + (ROOM_WIDTH - WINDOW_SIZE.width)/2)/2 , 0, ROOM_DEPTH/2] },
    { args:[WINDOW_SIZE.width, (ROOM_HEIGHT - WINDOW_SIZE.height)/2, WALL_THICKNESS], position:[0, ROOM_HEIGHT/2 - (ROOM_HEIGHT - WINDOW_SIZE.height)/4, ROOM_DEPTH/2] },
    { args:[WINDOW_SIZE.width, (ROOM_HEIGHT - WINDOW_SIZE.height)/2, WALL_THICKNESS], position:[0, -ROOM_HEIGHT/2 + (ROOM_HEIGHT - WINDOW_SIZE.height)/4, ROOM_DEPTH/2] },
  ], []);


  const heaterAirflowDir = useMemo(() => new THREE.Vector3(0, 1, -0.5), []); 
  const acAirflowDir = useMemo(() => new THREE.Vector3(-1, -0.2, 0), []); 
  const windowAirflowDir = useMemo(() => new THREE.Vector3(0,0,-1), []);

  const windowFlowUpperStart = useMemo(() => new THREE.Vector3(WINDOW_POSITION.x, WINDOW_POSITION.y + WINDOW_SIZE.height/3, WINDOW_POSITION.z), []);
  const windowFlowLowerStart = useMemo(() => new THREE.Vector3(WINDOW_POSITION.x, WINDOW_POSITION.y - WINDOW_SIZE.height/3, WINDOW_POSITION.z), []);

  const avgTempText = typeof roomAverageTemp === 'number' ? roomAverageTemp.toFixed(1) : 'N/A';
  const co2Text = typeof roomCO2 === 'number' ? roomCO2.toFixed(0) : 'N/A';
  const humidityText = typeof roomAverageHumidity === 'number' ? roomAverageHumidity.toFixed(0) : 'N/A';
  const lightText = typeof roomAverageLightLevel === 'number' ? roomAverageLightLevel.toFixed(2) : 'N/A';

  const localOutsideTempText = typeof outsideTemp === 'number' ? outsideTemp.toFixed(1) : 'N/A';
  const localOutsideHumidityText = typeof outsideHumidity === 'number' ? outsideHumidity.toFixed(0) : 'N/A';
  const localOutsideWindText = typeof outsideWindSpeed === 'number' ? `${outsideWindSpeed.toFixed(1)} m/s ${outsideWindDir || ''}` : 'N/A';

  return (
    <>
      {walls.map((wall, i) => (
        <Box key={`wall-solid-${i}`} args={wall.args} position={wall.position} material={wall.material} />
      ))}
      
      {frontWallPieces.map((piece, i) => (
        <Box key={`wall-front-${i}`} args={piece.args} position={piece.position} material={transparentMaterial} />
      ))}


      <Window position={WINDOW_POSITION} size={WINDOW_SIZE} openness={windowOpenness} />
      <Heater position={HEATER_POSITION} isOn={heaterOn} power={heaterPower} />
      <AC position={AC_POSITION} isOn={acOn} />
      <InternalLight position={LIGHT_POSITION} isOn={lightsOn} />

      {SENSOR_POSITIONS.map((pos, i) => {
        const data = sensorData[i] || {};
        if (typeof data.temperature === 'number' && typeof data.co2 === 'number' && 
            typeof data.humidity === 'number' && typeof data.lightLevel === 'number') {
          return (
            <Sensor
              key={`sensor-${i}`}
              position={pos}
              temperature={data.temperature}
              co2={data.co2}
              humidity={data.humidity}
              lightLevel={data.lightLevel}
            />
          );
        }
        return null; 
      })}

      <AirflowArrow start={HEATER_POSITION} direction={heaterAirflowDir} active={heaterOn && heaterPower > 0.1} color="orange" />
      <AirflowArrow start={AC_POSITION} direction={acAirflowDir} active={acOn} color="lightblue" />
      <WindowAirflowParticles active={windowOpenness > 0.05} openness={windowOpenness} roomDepth={ROOM_DEPTH} windowPos={WINDOW_POSITION} windowSize={WINDOW_SIZE} />

      {Array.from({ length: numPeople }).map((_, i) => (
        <Sphere
          key={`person-${i}`}
          args={[0.3, 16, 16]}
          position={[ (Math.random() - 0.5) * (ROOM_WIDTH - 2), -ROOM_HEIGHT / 2 + 0.3, (Math.random() - 0.5) * (ROOM_DEPTH - 2) ]}
          material-color={personMaterialColor}
        />
      ))}

      <Text position={[0, ROOM_HEIGHT / 2 + 0.6, 0]} fontSize={0.25} color="white" anchorX="center">
        Room: {avgTempText}°C | {co2Text}ppm | {humidityText}% | Light: {lightText}
      </Text>
      <Text position={[0, ROOM_HEIGHT / 2 + 0.9, -ROOM_DEPTH/2]} fontSize={0.25} color="cyan" anchorX="center">
        Bratislava ({timeOfDay}): {localOutsideTempText}°C | {localOutsideHumidityText}% Hum | Wind: {localOutsideWindText}
      </Text>
    </>
  );
}

// --- Main App Component ---
export default function App() {
  // --- Core Room State ---
  const [numPeople, setNumPeople] = useState(1);
  const [heaterOn, setHeaterOn] = useState(false);
  const [heaterPower, setHeaterPower] = useState(0.5); 
  const [acOn, setAcOn] = useState(false);
  const [windowOpenness, setWindowOpenness] = useState(0); 
  const [lightsOn, setLightsOn] = useState(false);

  // --- Outside Conditions ---
  const [outsideTemp, setOutsideTemp] = useState(15); 
  const [outsideHumidity, setOutsideHumidity] = useState(60); 
  const [outsideWindSpeed, setOutsideWindSpeed] = useState(2.5); 
  const [outsideWindDir, setOutsideWindDir] = useState("NW");
  const [timeOfDay, setTimeOfDay] = useState("Day"); 

  // --- Ideal Conditions (Rules) ---
  const [idealTemperature, setIdealTemperature] = useState(22);
  const [idealHumidity, setIdealHumidity] = useState(50);
  const [idealCO2, setIdealCO2] = useState(600); 
  const [idealLightLevel, setIdealLightLevel] = useState(0.7); 

  // --- Simulated Internal Room Conditions ---
  const initialSensorData = useMemo(() => SENSOR_POSITIONS.map(() => ({
    temperature: outsideTemp,
    humidity: outsideHumidity,
    co2: 400,
    lightLevel: timeOfDay === "Day" ? 0.8 : 0.1,
  })), [outsideTemp, outsideHumidity, timeOfDay]);

  const [sensorData, setSensorData] = useState(initialSensorData);
  const [roomAverageTemp, setRoomAverageTemp] = useState(() => outsideTemp);
  const [roomCO2, setRoomCO2] = useState(400); 
  const [roomAverageHumidity, setRoomAverageHumidity] = useState(() => outsideHumidity); 
  const [roomAverageLightLevel, setRoomAverageLightLevel] = useState(() => timeOfDay === "Day" ? 0.8 : 0.1);

  // --- Anomaly Detection ---
  const [alerts, setAlerts] = useState([]);
  const heaterOnTimestampRef = useRef(null);


  // --- Simulated Weather Fetch ---
  const fetchBratislavaWeather = () => {
    console.log("Fetching new weather data for Bratislava (simulated)...");
    setTimeout(() => {
      const newTemp = 10 + Math.random() * 15; 
      const newHumidity = 40 + Math.random() * 40; 
      const newWindSpeed = 1 + Math.random() * 5; 
      const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
      const newWindDir = dirs[Math.floor(Math.random() * dirs.length)];
      
      setOutsideTemp(newTemp);
      setOutsideHumidity(newHumidity);
      setOutsideWindSpeed(newWindSpeed);
      setOutsideWindDir(newWindDir);
      console.log(`Weather updated: ${newTemp.toFixed(1)}°C, ${newHumidity.toFixed(0)}% Hum, Wind ${newWindSpeed.toFixed(1)}m/s ${newWindDir}`);
    }, 500);
  };
  useEffect(() => { fetchBratislavaWeather(); }, []); 

  // --- Reset internal conditions if outside conditions change ---
  useEffect(() => {
    setSensorData(SENSOR_POSITIONS.map(() => ({ 
        temperature: outsideTemp, 
        humidity: outsideHumidity,
        co2: 400, 
        lightLevel: timeOfDay === "Day" ? (0.5 + windowOpenness * 0.5) : (0.05 + windowOpenness * 0.1) 
    })));
    setRoomAverageTemp(outsideTemp);
    setRoomAverageHumidity(outsideHumidity);
    setRoomAverageLightLevel(timeOfDay === "Day" ? (0.5 + windowOpenness * 0.5) : (0.05 + windowOpenness * 0.1));

  }, [outsideTemp, outsideHumidity, timeOfDay, windowOpenness]); 

  // --- Main Simulation Loop ---
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSensorData(prevSensorData => {
        if (!Array.isArray(prevSensorData) || prevSensorData.length !== SENSOR_POSITIONS.length) {
             console.error("Sensor data array is invalid in simulation loop:", prevSensorData);
             return initialSensorData; 
        }
        let totalTemp = 0;
        const nextSensorData = prevSensorData.map(sensor => {
          let currentTemp = sensor.temperature;
          currentTemp += (numPeople * HEAT_PER_PERSON_WATTS * 0.00005) / SENSOR_POSITIONS.length; 
          if (heaterOn) currentTemp += heaterPower * 0.2; 
          if (acOn) currentTemp -= 0.15; 
          currentTemp += (outsideTemp - currentTemp) * windowOpenness * 0.05;
          const overallAverage = prevSensorData.reduce((sum, s) => sum + s.temperature, 0) / prevSensorData.length;
          currentTemp = currentTemp * 0.95 + overallAverage * 0.05;
          totalTemp += currentTemp;
          return { ...sensor, temperature: Math.max(-10, Math.min(50, currentTemp)) };
        });
        if (nextSensorData.length > 0) {
            setRoomAverageTemp(totalTemp / nextSensorData.length);
        } else {
            setRoomAverageTemp(outsideTemp); 
        }
        return nextSensorData;
      });

      setRoomCO2(prevCO2 => {
        let newCO2 = typeof prevCO2 === 'number' ? prevCO2 : 400;
        newCO2 += (numPeople * CO2_PER_PERSON_PER_HOUR / 3600) * 100000; 
        newCO2 -= (newCO2 - 400) * windowOpenness * 0.15; 
        newCO2 = Math.max(400, Math.min(5000, newCO2));
        setSensorData(prev => prev.map(s => ({ ...s, co2: newCO2 }))); 
        return newCO2;
      });

      setRoomAverageHumidity(prevHumidity => {
        let newHumidity = typeof prevHumidity === 'number' ? prevHumidity : outsideHumidity;
        newHumidity += (outsideHumidity - newHumidity) * windowOpenness * 0.05;
        newHumidity += numPeople * 0.01 * (1 - windowOpenness); 
        newHumidity = Math.max(10, Math.min(90, newHumidity));
        setSensorData(prev => prev.map(s => ({ ...s, humidity: newHumidity }))); 
        return newHumidity;
      });
      
      setRoomAverageLightLevel(() => { 
          let newLight = 0;
          if (timeOfDay === "Day") newLight = 0.5 + windowOpenness * 0.5; 
          else newLight = 0.05 + windowOpenness * 0.1; 
          if (lightsOn) newLight += 0.5; 
          newLight = Math.max(0.01, Math.min(1, newLight)); 
          setSensorData(prev => prev.map(s => ({ ...s, lightLevel: newLight }))); 
          return newLight;
      });

    }, SIMULATION_TICK_MS);

    return () => clearInterval(intervalId);
  }, [heaterOn, heaterPower, acOn, windowOpenness, numPeople, outsideTemp, outsideHumidity, lightsOn, timeOfDay, initialSensorData]); 

  // --- Anomaly Detection ---
  useEffect(() => {
    if (heaterOn) {
      if (heaterOnTimestampRef.current === null) {
        heaterOnTimestampRef.current = Date.now();
      }
    } else {
      heaterOnTimestampRef.current = null; 
    }

    const anomalyIntervalId = setInterval(() => {
      const newAlerts = [];
      if (heaterOn && heaterOnTimestampRef.current && windowOpenness < 0.1) {
        const timeHeaterOn = Date.now() - heaterOnTimestampRef.current;
        if (timeHeaterOn > HEATER_COLD_ROOM_DURATION_THRESHOLD_MS && roomAverageTemp < (idealTemperature - 3)) {
          newAlerts.push(`ALERT: Heater on for ${Math.round(timeHeaterOn/1000)}s, window closed, but room is still cold (${roomAverageTemp.toFixed(1)}°C)! Check insulation or heater power.`);
        }
      }
      
      let statusText = "System nominal.";
      if (typeof roomAverageTemp === 'number' && roomAverageTemp > idealTemperature + 2) statusText = "Room is warmer than ideal.";
      else if (typeof roomAverageTemp === 'number' && roomAverageTemp < idealTemperature - 2) statusText = "Room is colder than ideal.";
      
      if (typeof roomCO2 === 'number' && roomCO2 > idealCO2 + 200) statusText += " CO2 levels are elevated.";
      
      if (typeof roomAverageLightLevel === 'number' && roomAverageLightLevel < idealLightLevel - 0.2 && timeOfDay === "Day" && !lightsOn) statusText += " Consider turning on lights or opening window for more daylight.";

      if (statusText !== "System nominal." || newAlerts.length > 0) {
           const existingStatusIndex = newAlerts.findIndex(a => a.startsWith("STATUS:"));
           if (existingStatusIndex !== -1) {
               if (statusText !== "System nominal.") newAlerts[existingStatusIndex] = `STATUS: ${statusText}`;
               else newAlerts.splice(existingStatusIndex, 1); 
           } else if (statusText !== "System nominal.") {
              newAlerts.unshift(`STATUS: ${statusText}`);
           }
      }

      setAlerts(currentAlerts => {
          if (JSON.stringify(currentAlerts) !== JSON.stringify(newAlerts)) {
              return newAlerts;
          }
          return currentAlerts;
      });

    }, ANOMALY_CHECK_INTERVAL_MS);
    
    return () => {
        clearInterval(anomalyIntervalId);
        heaterOnTimestampRef.current = null;
    };
  }, [heaterOn, windowOpenness, roomAverageTemp, idealTemperature, roomCO2, idealCO2, roomAverageLightLevel, idealLightLevel, timeOfDay, lightsOn]);


  // --- UI Styles & Layout (Light Theme) ---
  const controlPanelStyle = { 
    width: '480px', // Increased width for more space
    padding: '30px', 
    overflowY: 'auto', 
    background: '#f8f9fa', // Very light gray, almost white
    borderRight: '1px solid #dee2e6', // Softer border
    color: '#212529', // Dark text
    display: 'flex',
    flexDirection: 'column',
    gap: '25px' 
  };
  const controlBoxStyle = { 
    padding: '25px', 
    border: '1px solid #ced4da', 
    borderRadius: '10px', // Slightly more rounded
    background: '#ffffff', // White background for components
    boxShadow: '0 3px 10px rgba(0,0,0,0.08)' // Softer shadow
  };
  const labelStyle = { 
    marginRight: '10px', 
    minWidth: '140px', // Adjusted for new layout
    display: 'inline-block', 
    fontSize: '0.9em', 
    color: '#495057', // Standard dark gray for labels
    fontWeight: '500'
  };
  const valueStyle = { 
    fontWeight: '600', 
    color: '#007bff', // Primary blue for values
    padding: '3px 7px',
    backgroundColor: '#e9ecef', // Light gray background for values
    borderRadius: '4px',
    display: 'inline-block' // Ensure background fits content
  };
  const buttonStyle = { 
    padding: '10px 18px', 
    borderRadius: '6px', // Standard rounding
    border: '1px solid transparent', 
    cursor: 'pointer', 
    fontWeight: '500', // Medium weight
    minWidth: '100px', 
    margin: '5px', 
    transition: 'all 0.2s ease-in-out',
    fontSize: '0.9em',
    letterSpacing: '0.3px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#007bff',
    color: 'white',
    border: '1px solid #007bff',
  };
   const primaryButtonHoverStyle = {
    backgroundColor: '#0056b3',
    borderColor: '#0056b3',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6c757d',
    color: 'white',
    border: '1px solid #6c757d',
  };
  const secondaryButtonHoverStyle = {
    backgroundColor: '#545b62',
    borderColor: '#545b62',
  };

  const toggleButtonStyle = (isOn) => ({
    ...buttonStyle,
    backgroundColor: isOn ? '#28a745' : '#dc3545', // Green for ON, Red for OFF
    color: 'white',
    border: `1px solid ${isOn ? '#28a745' : '#dc3545'}`,
  });
   const toggleButtonHoverStyle = (isOn) => ({
    backgroundColor: isOn ? '#1e7e34' : '#bd2130',
    borderColor: isOn ? '#1e7e34' : '#bd2130',
  });


  const inputStyle = { 
    flexGrow: 1, // Allow slider to take remaining space
    background: '#e9ecef', 
    borderRadius: '6px',
    padding: '0px' // Default browser slider usually handles this
  };
  const sectionTitleStyle = { 
    textAlign: 'center', 
    borderBottom: '1px solid #dee2e6', 
    paddingBottom: '15px', 
    marginTop: '0px', // Remove top margin if box has padding
    marginBottom: '25px', 
    color: '#343a40', // Darker title
    fontSize: '1.15em', // Slightly larger
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.8px'
  };
  const sliderContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px', // Increased spacing
    gap: '15px' 
  };
  const infoRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '8px 0',
    borderBottom: '1px solid #e9ecef', // Separator for info items
    fontSize: '0.9em'
  };
   const lastInfoRowStyle = { ...infoRowStyle, borderBottom: 'none' };


  // Define formatted text variables for the App component's JSX
  const outsideTempText = typeof outsideTemp === 'number' ? outsideTemp.toFixed(1) : 'N/A';
  const outsideHumidityText = typeof outsideHumidity === 'number' ? outsideHumidity.toFixed(0) : 'N/A';
  const outsideWindText = typeof outsideWindSpeed === 'number' ? `${outsideWindSpeed.toFixed(1)} m/s ${outsideWindDir || ''}` : 'N/A';

  const roomAvgTempText = typeof roomAverageTemp === 'number' ? roomAverageTemp.toFixed(1) : 'N/A';
  const roomCO2Text = typeof roomCO2 === 'number' ? roomCO2.toFixed(0) : 'N/A';
  const roomAvgHumidityText = typeof roomAverageHumidity === 'number' ? roomAverageHumidity.toFixed(0) : 'N/A';
  const roomAvgLightText = typeof roomAverageLightLevel === 'number' ? roomAverageLightLevel.toFixed(2) : 'N/A';


  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif', background: '#e9ecef', color: '#212529' }}> 
      <div style={controlPanelStyle}>
        <h2 style={{textAlign: 'center', color: '#007bff', marginBottom: '30px', fontSize: '1.6em', fontWeight: '700'}}>Smart Room Dashboard</h2>

        {/* Current Indoor Conditions */}
        <div style={controlBoxStyle}>
            <h3 style={sectionTitleStyle}>Current Indoor Conditions</h3>
            <div style={infoRowStyle}><label style={labelStyle}>Avg. Temperature:</label> <span style={valueStyle}>{roomAvgTempText}°C</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>CO2 Level:</label> <span style={valueStyle}>{roomCO2Text} ppm</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>Avg. Humidity:</label> <span style={valueStyle}>{roomAvgHumidityText}%</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>Avg. Light Level:</label> <span style={valueStyle}>{roomAvgLightText}</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>People in Room:</label> <span style={valueStyle}>{numPeople}</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>Heater:</label> <span style={valueStyle}>{heaterOn ? `ON (${(heaterPower * 100).toFixed(0)}%)` : 'OFF'}</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>AC:</label> <span style={valueStyle}>{acOn ? 'ON' : 'OFF'}</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>Window:</label> <span style={valueStyle}>{(windowOpenness * 100).toFixed(0)}% Open</span></div>
            <div style={lastInfoRowStyle}><label style={labelStyle}>Lights:</label> <span style={valueStyle}>{lightsOn ? 'ON' : 'OFF'}</span></div>
        </div>


        <div style={controlBoxStyle}>
            <h3 style={sectionTitleStyle}>Bratislava Weather</h3>
            <div style={infoRowStyle}><label style={labelStyle}>Temperature:</label> <span style={valueStyle}>{outsideTempText}°C</span></div>
            <div style={infoRowStyle}><label style={labelStyle}>Humidity:</label> <span style={valueStyle}>{outsideHumidityText}%</span></div>
            <div style={lastInfoRowStyle}><label style={labelStyle}>Wind:</label> <span style={valueStyle}>{outsideWindText}</span></div>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #e9ecef'}}>
                <label style={{...labelStyle, minWidth: 'auto', fontWeight: '500'}}>Time of Day:</label> <span style={valueStyle}>{timeOfDay}</span>
                <button 
                    onClick={() => setTimeOfDay(timeOfDay === "Day" ? "Night" : "Day")} 
                    style={secondaryButtonStyle}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = secondaryButtonHoverStyle.backgroundColor}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = secondaryButtonStyle.backgroundColor}
                >Toggle</button>
            </div>
            <button 
                onClick={fetchBratislavaWeather} 
                style={{...primaryButtonStyle, display: 'block', width: '100%', marginTop: '20px'}}
                onMouseOver={e => e.currentTarget.style.backgroundColor = primaryButtonHoverStyle.backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = primaryButtonStyle.backgroundColor}
            >Refresh Weather</button>
        </div>

        <div style={controlBoxStyle}>
            <h3 style={sectionTitleStyle}>Target Conditions</h3>
            <div style={sliderContainerStyle}><label style={labelStyle}>Temperature: <span style={valueStyle}>{idealTemperature}°C</span></label> <input type="range" min="15" max="30" value={idealTemperature} onChange={(e) => setIdealTemperature(parseInt(e.target.value))} style={inputStyle}/></div>
            <div style={sliderContainerStyle}><label style={labelStyle}>Humidity: <span style={valueStyle}>{idealHumidity}%</span></label> <input type="range" min="30" max="70" value={idealHumidity} onChange={(e) => setIdealHumidity(parseInt(e.target.value))} style={inputStyle}/></div>
            <div style={sliderContainerStyle}><label style={labelStyle}>CO2 Level: <span style={valueStyle}>{idealCO2}ppm</span></label> <input type="range" min="400" max="1200" step="50" value={idealCO2} onChange={(e) => setIdealCO2(parseInt(e.target.value))} style={inputStyle}/></div>
            <div style={sliderContainerStyle}><label style={labelStyle}>Light Level: <span style={valueStyle}>{idealLightLevel.toFixed(1)}</span></label> <input type="range" min="0.1" max="1" step="0.1" value={idealLightLevel} onChange={(e) => setIdealLightLevel(parseFloat(e.target.value))} style={inputStyle}/></div>
        </div>
        
        <div style={controlBoxStyle}>
          <h3 style={sectionTitleStyle}>Device Controls</h3>
          <div style={sliderContainerStyle}><label style={labelStyle}>People Count: <span style={valueStyle}>{numPeople}</span></label> <input type="range" min="0" max="10" value={numPeople} onChange={(e) => setNumPeople(parseInt(e.target.value))} style={inputStyle}/></div>
          
          <div style={{...sliderContainerStyle, justifyContent: 'space-between', marginTop: '15px'}}>
            <label style={labelStyle}>Heater:</label>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <button 
                    onClick={() => setHeaterOn(!heaterOn)} 
                    style={toggleButtonStyle(heaterOn)}
                    onMouseOver={e => e.currentTarget.style.backgroundColor = toggleButtonHoverStyle(heaterOn).backgroundColor}
                    onMouseOut={e => e.currentTarget.style.backgroundColor = toggleButtonStyle(heaterOn).backgroundColor}
                >{heaterOn ? 'ON' : 'OFF'}</button>
                {heaterOn && (<input type="range" min="0.1" max="1" step="0.1" value={heaterPower} onChange={(e) => setHeaterPower(parseFloat(e.target.value))} title={`Power: ${(heaterPower * 100).toFixed(0)}%`} style={{...inputStyle, width: '120px', marginLeft: '10px'}}/>)}
            </div>
          </div>

          <div style={{...sliderContainerStyle, justifyContent: 'space-between'}}><label style={labelStyle}>Air Conditioner:</label>
           <button 
                onClick={() => setAcOn(!acOn)} 
                style={toggleButtonStyle(acOn)}
                onMouseOver={e => e.currentTarget.style.backgroundColor = toggleButtonHoverStyle(acOn).backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = toggleButtonStyle(acOn).backgroundColor}
            >{acOn ? 'ON' : 'OFF'}</button>
          </div>

          <div style={sliderContainerStyle}><label style={labelStyle}>Window Openness: <span style={valueStyle}>{(windowOpenness * 100).toFixed(0)}%</span></label>
            <input type="range" min="0" max="1" step="0.05" value={windowOpenness} onChange={(e) => setWindowOpenness(parseFloat(e.target.value))} style={inputStyle}/>
          </div>
          <div style={{...sliderContainerStyle, justifyContent: 'space-between'}}><label style={labelStyle}>Internal Lights:</label>
            <button 
                onClick={() => setLightsOn(!lightsOn)} 
                style={toggleButtonStyle(lightsOn)}
                onMouseOver={e => e.currentTarget.style.backgroundColor = toggleButtonHoverStyle(lightsOn).backgroundColor}
                onMouseOut={e => e.currentTarget.style.backgroundColor = toggleButtonStyle(lightsOn).backgroundColor}
            >{lightsOn ? 'ON' : 'OFF'}</button>
          </div>
        </div>

        <div style={{...controlBoxStyle, background: alerts.some(a => a.startsWith("ALERT:")) ? '#f8d7da' : '#ffffff', borderColor: alerts.some(a => a.startsWith("ALERT:")) ? '#f5c6cb' : '#ced4da' }}> 
            <h3 style={{...sectionTitleStyle, color: alerts.some(a => a.startsWith("ALERT:")) ? '#721c24' : '#343a40'}}>System Status & Alerts</h3>
            {alerts.length === 0 && <p style={{fontSize: '0.9em', textAlign: 'center', color: '#6c757d'}}>All systems nominal.</p>}
            {alerts.map((alert, index) => (
                <p key={index} style={{
                    fontSize: '0.85em', 
                    margin: '10px 0', 
                    padding: '12px 15px',
                    borderRadius: '6px',
                    color: alert.startsWith("ALERT:") ? '#721c24' : '#004085', // Darker text for better readability on light backgrounds
                    background: alert.startsWith("ALERT:") ? '#f8d7da' : '#cce5ff', // Light red for alert, light blue for status
                    borderLeft: `5px solid ${alert.startsWith("ALERT:") ? '#f5c6cb' : '#b8daff'}`
                }}>{alert}</p>
            ))}
             <p style={{fontSize: '0.8em', color: '#6c757d', marginTop: '15px', textAlign: 'center'}}>Heatmap: Sensor colors indicate local temperature.</p>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', backgroundColor: '#343a40' }}> {/* Darker background for 3D view contrast */}
        <Canvas camera={{ position: [0, ROOM_HEIGHT * 0.7, ROOM_DEPTH * 2.0], fov: 60 }}> 
          <ambientLight intensity={0.4} /> {/* Slightly more ambient light */}
          <directionalLight position={[8, 8, 8]} intensity={1.0} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048}/> {/* Stronger main light */}
          <directionalLight position={[-8, 8, -8]} intensity={0.4} />
          <pointLight 
            position={LIGHT_POSITION} 
            intensity={lightsOn ? 1.5 : 0} // Increased intensity
            distance={ROOM_WIDTH * 1.2} // Adjusted distance
            decay={1.5} // Adjusted decay
            color="white" 
            castShadow={lightsOn} // Cast shadow only when on
          />
          
          <RoomModel 
            roomState={{
              heaterOn, heaterPower, acOn, windowOpenness, numPeople, lightsOn,
              sensorData, roomAverageTemp, roomCO2, roomAverageHumidity, roomAverageLightLevel
            }}
            outsideConditions={{ outsideTemp, outsideHumidity, outsideWindSpeed, outsideWindDir, timeOfDay }}
          />
          
          <OrbitControls minDistance={ROOM_DEPTH * 0.4} maxDistance={ROOM_DEPTH * 3.5} target={[0, ROOM_HEIGHT * 0.1, 0]} /> 
          <gridHelper args={[ROOM_WIDTH*2, 20, useMemo(() => new THREE.Color('#555'), []), useMemo(() => new THREE.Color('#666'), [])]} /> {/* Darker grid */}
        </Canvas>
      </div>
    </div>
  );
}
