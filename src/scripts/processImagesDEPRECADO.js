import fs from "fs";
import path from "path";
import convertToWebp from "./convertToWebp.js";
import sendImageToAI from "./seoForImages.js";
import logger from "./utils/logger.js";

const processImages = async (inputFolder) => {
	const results = []; // Array para almacenar los resultados de las imágenes procesadas

	try {
		// Leer todas las imágenes en la carpeta de entrada
		const files = fs.readdirSync(inputFolder);

		for (const file of files) {
			const filePath = path.join(inputFolder, file);
			const stats = fs.statSync(filePath);

			if (stats.isFile() && /\.(jpg|jpeg|png|gif|webp)$/i.test(file)) {
				// Convertir la imagen a WebP
				const optimizedImagePath = await convertToWebp(filePath);

				if (optimizedImagePath) {
					// Enviar la imagen optimizada a Gemini (OpenAI)
					const prompt =
						"Analiza esta imagen y proporciona dos elementos separados por '|||': \n" +
						"1. Un texto ALT descriptivo y optimizado para SEO, adecuado para una página web comercial. \n" +
						"2. Un nombre de archivo en formato slug optimizado para SEO. \n" +
						"Formato de respuesta: 'texto_alt|||nombre-archivo-slug'.";

					try {
						const aiResponse = await sendImageToAI(optimizedImagePath, prompt);
						logger(`Respuesta de Gemini para ${optimizedImagePath}: ${aiResponse}`, "info", true);

						// Procesar la respuesta de Gemini
						const [altText, slugText] = aiResponse.split("|||").map((text) => text.trim());
						logger(`Texto ALT generado: ${altText}`, "info", true);
						logger(`Slug generado: ${slugText}`, "info", true);

						// Renombrar la imagen con el slug generado
						const newFileName = `${slugText}${path.extname(optimizedImagePath)}`;
						const newFilePath = path.join(path.dirname(optimizedImagePath), newFileName);

						fs.renameSync(optimizedImagePath, newFilePath);
						logger(`Imagen renombrada: ${optimizedImagePath} -> ${newFilePath}`, "info", true);

						// Agregar el resultado al array
						results.push({
							url: `/results/${newFileName}`, // Ruta pública de la imagen
							alt: altText, // Texto ALT generado
						});
					} catch (error) {
						logger(`Error al procesar la imagen con Gemini: ${error.message}`, "error", true);
					}
				}
			}
		}
	} catch (error) {
		logger(`Error al procesar imágenes en ${inputFolder}: ${error.message}`, "error", true);
	}

	return results; // Devolver los resultados
};

export default processImages;
