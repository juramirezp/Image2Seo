import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { CONSTANTES } from "./utils/constantes.js";
import logger, { separator } from "./utils/logger.js";

// Cargar variables de entorno
dotenv.config();

// Obtener el flag de debug de las constantes
const DEBUG = CONSTANTES.SEO_FOR_IMAGES.DEBUG || false;

// Construir __dirname manualmente
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).split("/scripts")[0];

// Configuración del cliente de OpenAI
const openai = new OpenAI({
	apiKey: process.env.OPENAI_API_KEY,
});

// Función para enviar la imagen a OpenAI y obtener el texto ALT y el nombre SEO
const sendImageToAI = async (imagePath, prompt) => {
	console.log("🚀 ~ sendImageToAI ~ prompt:", prompt);
	console.log("🚀 ~ sendImageToAI ~ imagePath:", imagePath);
	try {
		// Verificar si el archivo existe
		if (!fs.existsSync(imagePath)) {
			throw new Error(`El archivo ${imagePath} no existe.`);
		}

		// Leer la imagen como base64
		const fileBuffer = fs.readFileSync(imagePath);
		const base64Image = fileBuffer.toString("base64");

		// Determinar el tipo MIME basado en la extensión del archivo
		const extension = path.extname(imagePath).toLowerCase();
		console.log("🚀 ~ sendImageToAI ~ extension:", extension);
		let mimeType = "image/webp"; // Por defecto para imágenes WebP

		// Si necesitas agregar soporte para más tipos MIME, puedes agregar lógica aquí
		if (extension === ".jpg" || extension === ".jpeg") {
			mimeType = "image/jpeg";
		} else if (extension === ".png") {
			mimeType = "image/png";
		}

		// Crear la solicitud de chat completion a OpenAI
		// console.log("🚀 ~ sendImageToAI ~ prompt:", prompt);
		// console.log("🚀 ~ sendImageToAI ~ base64Image:", `data:${mimeType};base64,${base64Image}`);
		const completion = await openai.responses.create({
			model: CONSTANTES.SEO_FOR_IMAGES.OPENAI_MODEL,
			input: [
				{
					role: "system",
					content: [
						{
							type: "input_text",
							text: "Eres un experto en SEO, optimización de imágenes y accesibilidad. Tu tarea es analizar imágenes y generar texto ALT y nombres de archivo optimizados para SEO.",
						},
					],
				},
				{
					role: "user",
					content: [
						{
							type: "input_text",
							text: prompt,
						},
						{
							type: "input_image",
							image_url: `data:${mimeType};base64,${base64Image}`,
						},
					],
				},
			],
			text: {
				format: {
					type: "text",
				},
			},
			reasoning: {},
			tools: [],
			temperature: 1,
			max_output_tokens: 2048,
			top_p: 1,
			store: true,
		});

		// Retornar la respuesta del API
		console.log("🚀 ~ sendImageToAI ~ completion.choices[0].message.content:", completion.output_text);
		return completion.output_text;
	} catch (error) {
		logger(`Error al enviar la imagen al API de OpenAI: ${error.message}`, "error", true);
		throw error;
	}
};

export default sendImageToAI;
