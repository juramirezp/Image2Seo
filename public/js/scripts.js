const app = Vue.createApp({
	data() {
		return {
			responseMessage: "",
			imageUrl: "",
			altText: "",
			showToast: false, // Controla la visibilidad del toast
			isLoading: false, // Controla el estado de carga del botón
		};
	},
	methods: {
		async uploadImage() {
			const imageInput = this.$refs.imageInput;
			if (!imageInput.files.length) {
				this.responseMessage = "Por favor, selecciona una imagen.";
				return;
			}

			const formData = new FormData();
			formData.append("image", imageInput.files[0]);

			this.isLoading = true; // Activar el estado de carga

			try {
				const response = await fetch("/upload", {
					method: "POST",
					body: formData,
				});

				const result = await response.json();

				if (response.ok) {
					this.responseMessage = result.message;
					this.imageUrl = result.imageUrl;
					this.altText = result.altText;
				} else {
					this.responseMessage = result.message;
					this.imageUrl = "";
					this.altText = "";
				}
			} catch (error) {
				console.error("Error al subir la imagen:", error);
				this.responseMessage = "Error al subir la imagen.";
				this.imageUrl = "";
				this.altText = "";
			} finally {
				this.isLoading = false; // Desactivar el estado de carga
			}
		},
		async deleteImages() {
			try {
				const response = await fetch("/delete-images", {
					method: "DELETE",
				});

				const result = await response.json();

				if (response.ok) {
					this.responseMessage = result.message;
					this.imageUrl = "";
					this.altText = "";
					this.responseMessage = null;
				} else {
					this.responseMessage = result.message;
				}
			} catch (error) {
				console.error("Error al eliminar las imágenes:", error);
				this.responseMessage = "Error al eliminar las imágenes.";
			}
		},
		copyToClipboard(text) {
			// Copiar el texto al portapapeles
			navigator.clipboard.writeText(text).then(() => {
				// Mostrar el toast de confirmación
				this.showToast = true;

				// Ocultar el toast después de 2 segundos
				setTimeout(() => {
					this.showToast = false;
				}, 2000);
			});
		},
		getFileName(url) {
			// Extraer el nombre del archivo desde la URL
			return url.split("/").pop();
		},
	},
});

app.mount("#app");
