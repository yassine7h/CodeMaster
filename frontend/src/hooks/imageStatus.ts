import { useState, useEffect } from 'react';

const useImageStatus = (imageUrl: string) => {
   const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

   useEffect(() => {
      // Return early if no URL
      if (!imageUrl) {
         setStatus('error');
         return;
      }

      const img = new Image();

      const handleLoad = () => {
         setStatus('loaded');
      };

      const handleError = () => {
         setStatus('error');
      };

      // Set handlers before setting src
      img.addEventListener('load', handleLoad);
      img.addEventListener('error', handleError);

      // Start loading
      img.src = imageUrl;

      // Cleanup
      return () => {
         img.removeEventListener('load', handleLoad);
         img.removeEventListener('error', handleError);
      };
   }, [imageUrl]);

   return status;
};

export default useImageStatus;
