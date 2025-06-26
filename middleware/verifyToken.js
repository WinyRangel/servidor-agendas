const jwt = require('jsonwebtoken');
require('dotenv').config(); // << asegúrate de que esté aquí también

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', decoded); // debe aparecer si todo está bien
    req.user = decoded;
    next();
  } catch (error) {
    console.error('❌ Error al verificar token:', error.message);
    return res.status(403).json({ mensaje: 'Token inválido o expirado' });
  }
};


module.exports = verifyToken;
