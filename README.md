# SensorLog — App de Sensores con MongoDB Atlas

## Estructura del Proyecto

```
sensorlog/
├── server.js          ← Backend Express + Mongoose
├── .env               ← Tu connection string (ya configurado)
├── package.json
└── public/
    └── index.html     ← Frontend con GPS, Acelerómetro, Luz, Orientación
```

## Tu conexión MongoDB

Ya está configurada en `.env`:
```
MONGODB_URI=mongodb+srv://232410957_db_user:tHmVNJ9ubBea5da0@cluster0.dyyr0cs.mongodb.net/?appName=Cluster0
```
- **Base de datos:** `sensorlog`
- **Colección:** `lecturas`

## Cómo correr la app

### 1. Instalar dependencias
```bash
cd sensorlog
npm install
```

### 2. Iniciar el servidor
```bash
node server.js
```
Verás:
```
✅ MongoDB Atlas conectado — DB: sensorlog
🚀 Servidor corriendo en http://localhost:3000
```

### 3. Abrir en el navegador / móvil
- Local: `http://localhost:3000`
- En móvil (misma red): `http://TU-IP:3000`
  - En Mac: `System Preferences → Network → IP Address`
  - En Windows: `ipconfig` en terminal

## Sensores implementados

| Sensor | API usada | Frecuencia de guardado |
|--------|-----------|----------------------|
| GPS | `navigator.geolocation.watchPosition` | Cada cambio |
| Acelerómetro | `DeviceMotionEvent` | Cada 2 segundos |
| Luz Ambiental | `AmbientLightSensor` (o simulado) | Cada 5 segundos |
| Orientación/Brújula | `DeviceOrientationEvent` | Cada 3 segundos |

## Endpoints del API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/status` | Estado de MongoDB |
| POST | `/api/lecturas` | Guardar 1 lectura |
| POST | `/api/lecturas/batch` | Guardar múltiples lecturas |
| GET | `/api/lecturas?limit=20` | Obtener últimas lecturas |

## Estructura del documento en MongoDB

```json
{
  "_id": "ObjectId generado por Atlas",
  "sessionId": "abc123",
  "timestamp": "2024-01-15T10:30:00Z",
  "tipo": "gps",
  "gps": {
    "lat": 20.6534,
    "lng": -105.2253,
    "alt": 5.2,
    "accuracy": 10,
    "speed": null
  },
  "dispositivo": {
    "userAgent": "Mozilla/5.0...",
    "plataforma": "iPhone",
    "pantalla": "390x844"
  }
}
```

## Notas importantes

- **iOS**: Los sensores de movimiento requieren un gesto del usuario para activarse (ya manejado).
- **HTTPS**: Para GPS en producción necesitas HTTPS. En localhost funciona sin él.
- **Sensor de luz**: Solo disponible en Chrome Android con flag experimental. En otros navegadores usa simulación por hora del día.
- **Auto-guardado**: Cada 15 segundos se guardan automáticamente las lecturas del buffer.

## Ver datos en Atlas

1. Ve a [cloud.mongodb.com](https://cloud.mongodb.com)
2. Tu Cluster → Browse Collections
3. Base de datos: `sensorlog` → Colección: `lecturas`
