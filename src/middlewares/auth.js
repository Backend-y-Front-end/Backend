
const jwt = require("jsonwebtoken");

/**
 * Middleware para validar el Token de acceso
 */
const verificarToken = (req, res, next) => {
  // 1. Obtener el token del header
  const token = req.header("x-auth-token");
  
  // DEBUG
  console.log("-----------------------------------------");
  console.log("📨 Header recibido x-auth-token:", token ? "Sí" : "No");
  console.log("🔑 JWT_SECRET configurado:", process.env.JWT_SECRET ? "Sí" : "No (usando default)");

  // 2. Revisar si no hay token
  if (!token) {
    console.log("❌ No hay token en la petición");
    console.log("-----------------------------------------");
    return res.status(401).json({
      message: "No hay token, permiso denegado. Por favor inicia sesión.",
    });
  }

  try {
    // 3. Verificar el token
    const secretKey = process.env.JWT_SECRET || "TU_FIRMA_SECRETA_SUPER_SEGURA";
    const cifrado = jwt.verify(token, secretKey);

    // 4. Guardamos los datos del usuario en el objeto 'req'
    req.user = cifrado;

    console.log("✅ Token verificado con éxito");
    console.log("👤 Usuario:", req.user);
    console.log("-----------------------------------------");
    
    next();
  } catch (error) {
    console.log("❌ Error al verificar token:", error.message);
    console.log("-----------------------------------------");
    res.status(401).json({ message: "Token no válido o expirado" });
  }
};

/**
 * Middleware para validar si el usuario es Administrador
 */
const verificarAdmin = (req, res, next) => {
  console.log("🎭 Verificando rol admin...");
  console.log("👤 Usuario actual:", req.user);
  
  if (req.user && req.user.rol === "admin") {
    console.log("✅ Es admin, permitiendo acceso");
    next();
  } else {
    console.log("❌ No es admin, denegando acceso");
    res.status(403).json({
      message: "Acceso denegado. Esta acción requiere rol de Administrador.",
    });
  }
};

module.exports = { verificarToken, verificarAdmin };