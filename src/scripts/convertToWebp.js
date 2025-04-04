import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { CONSTANTES } from "./utils/constantes.js";
import logger, { separator } from "./utils/logger.js";

// Obtener las flags de configuración
const DEBUG = CONSTANTES.CONVERT_TO_WEBP?.DEBUG || false;
const DELETE_FILES = CONSTANTES.CONVERT_TO_WEBP?.DELETE_FILES || false;

// Construir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).split("/scripts")[0];

// Contadores para estadísticas
let imagesFound = 0;
let imagesConverted = 0;
let imagesSkipped = 0;
let imagesDeleted = 0;
let conversionErrors = 0;
let totalOriginalSize = 0;
let totalWebpSize = 0;

// Configuración de la calidad WebP
const WEBP_QUALITY = CONSTANTES.CONVERT_TO_WEBP?.QUALITY || 80;

// Función para obtener el tamaño de un archivo en KB
const getFileSizeInKB = (filePath) => {
	try {
		const stats = fs.statSync(filePath);
		return (stats.size / 1024).toFixed(2); // Tamaño en KB con 2 decimales
	} catch (error) {
		logger(`Error al obtener el tamaño del archivo ${filePath}:`, "error", DEBUG, error);
		return 0;
	}
};

// Función para convertir una imagen a WebP usando Sharp
const convertToWebp = async (imagePath) => {
	try {
		const fileName = path.basename(imagePath, path.extname(imagePath));
		const outputDir = path.join(__dirname, "../public/results");
		const outputPath = path.join(outputDir, `${fileName}.webp`);

		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		if (fs.existsSync(outputPath)) {
			logger(`Ya existe un archivo WebP para: ${outputPath}`, "warn", DEBUG);
			imagesSkipped++;
			return outputPath;
		}

		await sharp(imagePath).webp({ quality: WEBP_QUALITY }).toFile(outputPath);

		logger(`Imagen convertida: ${imagePath} -> ${outputPath}`, "info", DEBUG);
		imagesConverted++;

		return outputPath; // Devolver la ruta del archivo convertido
	} catch (error) {
		logger(`Error al convertir la imagen ${imagePath}:`, "error", DEBUG, error);
		conversionErrors++;
		return null;
	}
};

export default convertToWebp;

// Función para buscar y procesar imágenes
const processImages = async (folder) => {
	logger(`Buscando imágenes en: ${folder}`, "debug", DEBUG);

	try {
		const files = fs.readdirSync(folder);

		for (const file of files) {
			const filePath = path.join(folder, file);
			const stats = fs.statSync(filePath);

			if (stats.isDirectory()) {
				// Si es una carpeta, procesarla recursivamente
				await processImages(filePath);
			} else if (stats.isFile()) {
				const ext = path.extname(file).toLowerCase();

				// Procesar solo si es una imagen soportada y no es webp
				if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext) && ext !== ".webp") {
					imagesFound++;
					await convertToWebp(filePath);
				}
			}
		}
	} catch (error) {
		logger(`Error al procesar el directorio ${folder}:`, "error", DEBUG, error);
	}
};

// Función principal
const main = async () => {
	// Ruta a la carpeta de imágenes
	const imagesFolder = path.join(__dirname, "../public/results");

	separator();
	logger("=== INICIANDO CONVERSIÓN DE IMÁGENES A WEBP ===", "always", DEBUG);
	if (DELETE_FILES) {
		logger("¡ADVERTENCIA! El modo de eliminación de archivos originales está ACTIVADO", "always", DEBUG);
	}
	separator();

	// Verificar que el directorio existe
	if (!fs.existsSync(imagesFolder)) {
		logger(`La carpeta ${imagesFolder} no existe.`, "error", DEBUG);
		return;
	}

	// Procesar imágenes
	await processImages(imagesFolder);

	// Calcular la reducción total en porcentaje
	const totalReductionPercent =
		totalOriginalSize > 0 ? (((totalOriginalSize - totalWebpSize) / totalOriginalSize) * 100).toFixed(2) : 0;

	separator();
	logger("\n=== CONVERSIÓN FINALIZADA ===", "always", DEBUG);
	logger(`Imágenes encontradas: ${imagesFound}`, "always", DEBUG);
	logger(`Imágenes convertidas: ${imagesConverted}`, "always", DEBUG);
	logger(`Imágenes omitidas: ${imagesSkipped}`, "always", DEBUG);
	if (DELETE_FILES) {
		logger(`Imágenes originales eliminadas: ${imagesDeleted}`, "always", DEBUG);
	}
	logger(`Errores de conversión: ${conversionErrors}`, "always", DEBUG);
	logger(`Tamaño total original: ${totalOriginalSize.toFixed(2)} KB`, "always", DEBUG);
	logger(`Tamaño total WebP: ${totalWebpSize.toFixed(2)} KB`, "always", DEBUG);
	logger(`Reducción total: ${totalReductionPercent}%`, "always", DEBUG);
	separator();
};

// Ejecutar la función principal
// main().catch((error) => {
// 	logger("Error en la ejecución principal:", "error", DEBUG, error);
// });
