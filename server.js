import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta principal de prueba
app.get('/', (req, res) => {
  res.send('Servidor activo y listo para procesar registros.');
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

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});
