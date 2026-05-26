require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── MongoDB Schema ───────────────────────────────────────────
const lecturaSchema = new mongoose.Schema({
  sessionId: String,
  timestamp: { type: Date, default: Date.now },
  gps: {
    lat: Number,
    lng: Number,
    alt: Number,
    accuracy: Number,
    speed: Number
  },
  acelerometro: {
    x: Number,
    y: Number,
    z: Number
  },
  luz: {
    lux: Number,
    clasificacion: String,
    simulada: Boolean
  },
  orientacion: {
    alpha: Number,
    beta: Number,
    gamma: Number
  },
  dispositivo: {
    userAgent: String,
    plataforma: String,
    pantalla: String
  }
});

const Lectura = mongoose.model('Lectura', lecturaSchema, 'lecturas');

// ─── Rutas API ────────────────────────────────────────────────

// Guardar una lectura
app.post('/api/lecturas', async (req, res) => {
  try {
    const lectura = new Lectura(req.body);
    const saved = await lectura.save();
    res.json({ success: true, id: saved._id, mensaje: 'Lectura guardada en MongoDB Atlas ✓' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Guardar múltiples lecturas (batch)
app.post('/api/lecturas/batch', async (req, res) => {
  try {
    const { lecturas } = req.body;
    if (!lecturas || !Array.isArray(lecturas)) {
      return res.status(400).json({ success: false, error: 'Se esperaba un array en "lecturas"' });
    }
    const result = await Lectura.insertMany(lecturas);
    res.json({ success: true, insertados: result.length, mensaje: `${result.length} lecturas guardadas ✓` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Obtener últimas lecturas
app.get('/api/lecturas', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const lecturas = await Lectura.find().sort({ timestamp: -1 }).limit(limit);
    res.json({ success: true, total: lecturas.length, lecturas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Estado de la conexión
app.get('/api/status', (req, res) => {
  const estado = mongoose.connection.readyState;
  const estados = { 0: 'desconectado', 1: 'conectado', 2: 'conectando', 3: 'desconectando' };
  res.json({ 
    success: true, 
    mongodb: estados[estado] || 'desconocido',
    readyState: estado,
    base_datos: mongoose.connection.db?.databaseName || 'N/A'
  });
});

// ─── Conexión MongoDB ─────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'sensorlog'
})
.then(() => {
  console.log('✅ MongoDB Atlas conectado — DB: sensorlog');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error('❌ Error conectando a MongoDB:', err.message);
  process.exit(1);
});
