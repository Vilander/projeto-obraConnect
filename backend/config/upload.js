/**
 * Configuração do Multer para upload de imagens
 * Salva as fotos na pasta /uploads
 */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Criar pasta uploads se não existir
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gerar nome único com timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// Filtro de arquivos (apenas imagens)
const fileFilter = (req, file, cb) => {
  const extensoesPermitidas = /jpeg|jpg|png|gif/;
  const tiposPermitidos = /image\/jpeg|image\/png|image\/gif/;

  const extname = extensoesPermitidas.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = tiposPermitidos.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Apenas imagens (jpeg, jpg, png, gif) são permitidas!"));
  }
};

// Configurar multer
module.exports = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB
  },
});
