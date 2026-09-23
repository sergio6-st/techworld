import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para obtener __dirname usando ES Modules (import)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos (HTML, CSS, JS) desde la carpeta del proyecto
app.use(express.static(__dirname));

// Inicializar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta principal para servir el archivo index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta POST para el registro de usuarios
app.post('/api/registro', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({
      exito: false,
      mensaje: 'Todos los campos son obligatorios.'
    });
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nombre, email, password }])
      .select();

    if (error) {
      return res.status(400).json({
        exito: false,
        mensaje: 'Error en base de datos: ' + error.message
      });
    }

    return res.status(201).json({
      exito: true,
      mensaje: '¡Usuario registrado con éxito!',
      usuario: data[0]
    });

  } catch (err) {
    return res.status(500).json({
      exito: false,
      mensaje: 'Error interno del servidor.'
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
