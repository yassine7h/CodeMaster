export function resizeAndCenterImage(file: File) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
         const img = new Image();
         img.onload = () => {
            // Create a canvas to resize the image
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            // Set the desired dimensions (400x400)
            const targetWidth = 400;
            const targetHeight = 400;

            // Calculate the scaling factor
            let scaleFactor = Math.min(targetWidth / img.width, targetHeight / img.height);

            // Calculate the new image dimensions while maintaining aspect ratio
            const newWidth = img.width * scaleFactor;
            const newHeight = img.height * scaleFactor;

            // Set the canvas size
            canvas.width = targetWidth;
            canvas.height = targetHeight;

            // Calculate the position to center the image
            const offsetX = (targetWidth - newWidth) / 2;
            const offsetY = (targetHeight - newHeight) / 2;

            // Draw the image on the canvas, centered
            ctx?.drawImage(img, offsetX, offsetY, newWidth, newHeight);

            // Get the resized image as a base64 string
            const resizedBase64 = canvas.toDataURL('image/jpeg'); // You can also use 'image/png' if needed
            resolve(resizedBase64);
         };

         img.onerror = reject;
         img.src = reader.result as string; // Set the image source to the base64 data
      };

      reader.onerror = reject;
      reader.readAsDataURL(file); // Convert file to base64
   });
}
