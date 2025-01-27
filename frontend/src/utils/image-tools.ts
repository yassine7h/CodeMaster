export function makeImageSquare(file: File, maxSize: number): Promise<File> {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
         const img = new Image();
         img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            if (!ctx) {
               reject(new Error('Failed to get canvas context'));
               return;
            }

            // Make the image square with the largest dimension
            const size = Math.max(img.width, img.height);
            const scaleFactor = maxSize / size;
            const finalSize = Math.min(size, maxSize);

            // Set canvas to final square size
            canvas.width = finalSize;
            canvas.height = finalSize;

            // Fill with black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, finalSize, finalSize);

            // Calculate scaled dimensions
            const newWidth = img.width * scaleFactor;
            const newHeight = img.height * scaleFactor;

            // Center the image
            const offsetX = (finalSize - newWidth) / 2;
            const offsetY = (finalSize - newHeight) / 2;

            // Draw the image
            ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

            // Convert canvas to blob
            canvas.toBlob((blob) => {
               if (!blob) {
                  reject(new Error('Failed to create blob'));
                  return;
               }

               // Create new file with original name
               const newFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
               });

               resolve(newFile);
            }, 'image/jpeg');
         };

         img.onerror = reject;
         img.src = reader.result as string;
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
   });
}
