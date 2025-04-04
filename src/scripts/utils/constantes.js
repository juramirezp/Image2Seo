export const CONSTANTES = {
	SEO_FOR_IMAGES: {
		OPENAI_MODEL: "gpt-4o", // Modelo de OpenAI con capacidad de visión
		DEBUG: false,
		PROMPT: `Analiza la imagen adjunta y genera dos elementos separados estrictamente por '|||':

1.  **Texto ALT:** Crea un texto alternativo que describa el **contenido y función** de la imagen de forma clara y concisa. Optimízalo para accesibilidad (WCAG) y SEO, usando términos descriptivos y comunes para Chile. Evita frases como "imagen de" o "foto de".
2.  **Nombre de archivo:** Genera un nombre de archivo descriptivo en formato slug (todo en minúsculas, palabras separadas por guiones, sin acentos ni caracteres especiales como ñ, ?, !, etc.). Debe reflejar el contenido de la imagen y ser útil para SEO.

Formato de respuesta requerido (sin texto adicional): texto alt accesible para la imagen|||nombre-archivo-slug`,
	},
	CONVERT_TO_WEBP: {
		DEBUG: true,
		QUALITY: 85, // Calidad de las imágenes WebP (0-100)
		DELETE_FILES: false, // Eliminar archivos originales después de la conversión
	},
};
