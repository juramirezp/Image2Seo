import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import convertToWebp from "./scripts/convertToWebp.js";
import sendImageToAI from "./scripts/seoForImages.js";
import logger from "./scripts/utils/logger.js";
import { CONSTANTES } from "./scripts/utils/constantes.js";

const app = express();
const port = 3000;

// Construir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar carpeta pública
app.use(express.static(path.join(__dirname, "../public")));

// Configurar multer para subir archivos
const upload = multer({
	dest: path.join(__dirname, "../uploads"), // Carpeta temporal para subidas
});

// Ruta para subir imágenes
app.post("/upload", upload.single("image"), async (req, res) => {
	try {
		// Verificar si el archivo fue subido correctamente
		if (!req.file || !req.file.path) {
			return res.status(400).json({ message: "No se recibió ningún archivo." });
		}

		const inputPath = req.file.path; // Ruta del archivo subido
		console.log("🚀 ~ Ruta del archivo subido:", inputPath);

		// Optimizar la imagen
		const optimizedImagePath = await convertToWebp(inputPath);
		if (!optimizedImagePath) {
			return res.status(400).json({ message: "No se pudo optimizar la imagen." });
		}
		console.log("🚀 ~ Ruta de la imagen optimizada:", optimizedImagePath);

		// Procesar la imagen optimizada con Gemini
		const aiResponse = await sendImageToAI(optimizedImagePath, CONSTANTES.SEO_FOR_IMAGES.PROMPT);
		logger(`Respuesta de Gemini para ${optimizedImagePath}: ${aiResponse}`, "info", true);

		// Procesar la respuesta de Gemini
		const [altText, imagePath] = aiResponse.split("|||").map((text) => text.trim());
		logger(`Texto ALT generado: ${altText}`, "info", true);
		logger(`imagePath generado: ${imagePath}`, "info", true);
		if (!imagePath) {
			return res.status(500).json({ message: "Error al procesar la imagen con Gemini." });
		}
		console.log("🚀 ~ Ruta de la imagen procesada:", imagePath);

		// Renombrar la imagen con el slug generado
		const newFileName = `${imagePath}${path.extname(optimizedImagePath)}`;
		const newFilePath = path.join(path.dirname(optimizedImagePath), newFileName);

		fs.renameSync(optimizedImagePath, newFilePath);
		logger(`Imagen renombrada: ${optimizedImagePath} -> ${newFilePath}`, "info", true);

		// Devolver la ruta pública y el texto ALT al frontend
		res.status(200).json({
			message: "Imagen procesada exitosamente.",
			imageUrl: `/results/${path.basename(imagePath)}.webp`,
			altText: altText,
		});
	} catch (error) {
		logger(`Error al procesar la imagen: ${error.message}`, "error", true);
		res.status(500).json({ message: "Error al procesar la imagen." });
	}
});

// Ruta para eliminar imágenes
app.delete("/delete-images", async (req, res) => {
	try {
		// Carpetas a limpiar
		const uploadsDir = path.join(__dirname, "../uploads");
		console.log("🚀 ~ app.delete ~ uploadsDir:", uploadsDir);
		const resultsDir = path.join(__dirname, "../public/results");
		console.log("🚀 ~ app.delete ~ resultsDir:", resultsDir);

		// Función para eliminar archivos en una carpeta
		const deleteFilesInDirectory = (directory) => {
			if (fs.existsSync(directory)) {
				fs.readdirSync(directory).forEach((file) => {
					const filePath = path.join(directory, file);
					if (fs.statSync(filePath).isFile()) {
						fs.unlinkSync(filePath); // Eliminar archivo
					}
				});
			}
		};

		// Eliminar archivos en ambas carpetas
		deleteFilesInDirectory(uploadsDir);
		deleteFilesInDirectory(resultsDir);

		// res.status(200).json({ message: "Imágenes eliminadas exitosamente." });
		res.status(200).json({ message: "" });
	} catch (error) {
		logger(`Error al eliminar imágenes: ${error.message}`, "error", true);
		res.status(500).json({ message: "Error al eliminar imágenes." });
	}
});

// Iniciar el servidor
app.listen(port, () => {
	console.log(`Servidor corriendo en http://localhost:${port}`);
});
