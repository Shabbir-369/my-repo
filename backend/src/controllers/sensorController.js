const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

exports.registerSensor = async (req, res) => {
  try {
    const { esp32_mac_address } = req.body;

    // 1️⃣ Validate input
    if (!esp32_mac_address) {
      return res.status(400).json({ message: "MAC address required" });
    }

    // 2️⃣ Check if sensor already exists
    const [existing] = await db.query(
      "SELECT * FROM sensors WHERE esp32_mac_address = ?",
      [esp32_mac_address]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: "Sensor already registered" });
    }

    // 3️⃣ Insert sensor linked to logged-in farmer
    await db.query(
      "INSERT INTO sensors (id, esp32_mac_address, farmer_id) VALUES (?, ?, ?)",
      [uuidv4(), esp32_mac_address, req.user.id]
    );

    res.status(201).json({ message: "Sensor registered successfully 🛰️" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.addSensorData = async (req, res) => {
  try {
    const {
      esp32_mac_address,
      moisture_level,
      temperature,
      ph_level,
      nitrogen,
      phosphorus,
      potassium
    } = req.body;

    // 1️⃣ Validate required fields
    if (!esp32_mac_address || !moisture_level || !temperature || !ph_level) {
      return res.status(400).json({ message: "Missing required sensor data" });
    }

    // 2️⃣ Find sensor by MAC address
    const [sensors] = await db.query(
      "SELECT id FROM sensors WHERE esp32_mac_address = ?",
      [esp32_mac_address]
    );

    if (sensors.length === 0) {
      return res.status(404).json({ message: "Sensor not registered" });
    }

    const sensor_id = sensors[0].id;

    // 3️⃣ Insert sensor reading
    await db.query(
      `INSERT INTO sensor_readings 
      (sensor_id, moisture_level, temperature, ph_level, nitrogen, phosphorus, potassium) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        sensor_id,
        moisture_level,
        temperature,
        ph_level,
        nitrogen || null,
        phosphorus || null,
        potassium || null
      ]
    );

    res.status(201).json({ message: "Sensor data saved 📡" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// exports.getFarmerSensorData = async (req, res) => {

//   try {
//     const farmerId = req.user.id;

//     // Get all sensors for this farmer
//     const [sensors] = await db.query(
//       "SELECT id, esp32_mac_address FROM sensors WHERE farmer_id = ?",
//       [farmerId]
//     );

//     if (sensors.length === 0) {
//       return res.status(404).json({ message: "No sensors found" });
//     }

//     // For each sensor, get latest reading
//     const results = [];

//     for (const sensor of sensors) {
//       const [readings] = await db.query(
//         `SELECT * FROM sensor_readings 
//          WHERE sensor_id = ? 
//          ORDER BY recorded_at ASC 
//          LIMIT 1`,
//         [sensor.id]
//       );

//       results.push({
//         sensor: sensor.esp32_mac_address,
//         latest_reading: readings[0] || null
//       });
//     }

//     res.status(200).json(results);

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error" });
//   }
// };


exports.getFarmerSensorData = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // Find the sensors owned by this specific farmer
    const [sensors] = await db.query(
      "SELECT id, esp32_mac_address FROM sensors WHERE farmer_id = ?",
      [farmerId]
    );

    // console.log("Logged-in Farmer ID:", farmerId);
    // console.log("Sensors found for this farmer:", sensors);

    if (sensors.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404 so UI knows to show "No Sensors"
    }

    const results = [];

    // Get the latest 10 readings for each sensor
    for (const sensor of sensors) {
      const [readings] = await db.query(
        `SELECT moisture_level, temperature, ph_level,
                nitrogen, phosphorus, potassium, recorded_at
         FROM sensor_readings
         WHERE sensor_id = ?
         ORDER BY recorded_at ASC
         LIMIT 10`,
        [sensor.id]
      );

      results.push({
        sensor: sensor.esp32_mac_address,
        graph_data: readings.map(r => ({
          time: new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          moisture: Number(r.moisture_level) || 0,
          temperature: Number(r.temperature) || 0,
          ph: Number(r.ph_level) || 0,
          nitrogen: Number(r.nitrogen) || 0,     // Fixed: Added missing NPK
          phosphorus: Number(r.phosphorus) || 0, // Fixed: Added missing NPK
          potassium: Number(r.potassium) || 0    // Fixed: Added missing NPK
        }))
      });
    }

    res.status(200).json(results);

  } catch (error) {
    console.error("Error in getFarmerSensorData:", error);
    res.status(500).json({ message: "Server error" });
  }
};



exports.getDailyAverage = async (req, res) => {
  try {
    const farmerId = req.user.id;

    const [sensors] = await db.query(
      "SELECT id FROM sensors WHERE farmer_id = ?",
      [farmerId]
    );

    if (sensors.length === 0) {
      return res.status(404).json({ message: "No sensors found" });
    }

    const sensorId = sensors[0].id;

    const [averages] = await db.query(
      `SELECT DATE(recorded_at) as date,
              AVG(moisture_level) as avg_moisture
       FROM sensor_readings
       WHERE sensor_id = ?
       GROUP BY DATE(recorded_at)
       ORDER BY DATE(recorded_at) ASC`,
      [sensorId]
    );

   res.status(200).json(
  averages.map(a => ({
    date: a.date.toISOString().split("T")[0],
    avg_moisture: Number(a.avg_moisture)
  }))
);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};