import { Area } from "react-easy-crop";

// utils/cropImage.ts
export const getCroppedImg = (imageSrc: string, cropArea: Area): Promise<Blob | null> => {
    const image = new Image();
    image.src = imageSrc;
  
    return new Promise<Blob | null>((resolve, reject) => {
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        if (!ctx) {
          return reject('Canvas context not available');
        }
  
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;
  
        ctx.drawImage(
          image,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          cropArea.width,
          cropArea.height
        );
  
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject('Blob generation failed');
          }
        }, 'image/jpeg');
      };
  
      image.onerror = reject;
    });
  };