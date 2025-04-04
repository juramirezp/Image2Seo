import chalk from "chalk";

/**
 * Función logger simple con control de nivel de debug
 * @param {string|any} message - Mensaje a mostrar
 * @param {string} level - Nivel del mensaje ('debug', 'info', 'warn', 'error', 'always')
 * @param {boolean} debug - Indica si se deben mostrar mensajes de debug
 * @param  {...any} args - Argumentos adicionales a mostrar
 */
const logger = (message, level = "info", debug = false, ...args) => {
	// Si el nivel es 'always', siempre mostrarlo
	if (level === "always") {
		console.log(message, ...args);
		return;
	}

	// Si es un mensaje de debug y debug está desactivado, no mostrar
	if (level === "debug" && !debug) {
		return;
	}

	// Colores para cada nivel
	const colors = {
		debug: "blue",
		info: "green",
		warn: "yellow",
		error: "red",
	};

	// Usar el color correspondiente al nivel, o el predeterminado si no existe
	const color = colors[level] || "white";

	// Mostrar el mensaje con el prefijo del nivel
	console.log(chalk[color](`[${level.toUpperCase()}]`), message, ...args);
};

/**
 * Función para crear un separador en la consola
 * @param {string} char - Carácter a usar como separador
 * @param {number} length - Longitud del separador
 * @param {string} color - Color del separador
 */
export const separator = (char = "-", length = 60, color = "yellow") => {
	const line = char.repeat(length);
	console.log(chalk[color](line));
};

export default logger;
