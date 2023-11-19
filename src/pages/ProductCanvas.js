import React, { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import html2canvas from 'html2canvas';
import '../styles/productcanvas.css';

function App(props) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [hueRotation, setHueRotation] = useState(0);
  const canvasRef = useRef(null);


  useEffect(() => {
    const canvas = new fabric.Canvas('productCanvas', {
      backgroundColor: 'transparent',
    });
    canvasRef.current = canvas;

    const { frontView, backView, sideView, additionalImages } = props.selectedImages;

    const images = [frontView, backView, sideView, ...additionalImages];

    let separation = 50;
    let leftPosition = 40;
    let scaleToWidth = 300;
    let topPositon =200

    // Load images onto the canvas with separation
    images.forEach((image, index) => {
      const imageUrlPromise = convertImageToFileURL(image);

      imageUrlPromise.then((imageUrl) => {
        fabric.Image.fromURL(imageUrl, (productImage) => {
          productImage.scaleToWidth(scaleToWidth);
          productImage.set({
            selectable: true,
            evented: true,
            top: topPositon,
            left: leftPosition ,
          });
          if (index > 2) {
            scaleToWidth= 70
            leftPosition += scaleToWidth + separation;
          }else if(index == 2){
            leftPosition =40
            separation =25
            topPositon =75
          }else {
            leftPosition += scaleToWidth + separation;
          }
          canvas.add(productImage);
        });
      }).catch((error) => {
        console.error('Error converting image to URL:', error);
      });
    });

    // Event listener for when an object (image) is selected
    canvas.on('mouse:up', (event) => {
      const target = event.target;
      if (target && target.type === 'image') {
        setSelectedObject(target);

        const hueFilter = new fabric.Image.filters.HueRotation({
          rotation: 350,
        });

        // Apply the hue filter to the target image
        target.filters.push(hueFilter);
        target.applyFilters();
        canvas.renderAll();
      }
    });

    // console.log(canvas)
    document.getElementById("save_btn").addEventListener('mouseup', () => {
      if (canvasRef.current) {

        const activeObject = canvasRef.current.getActiveObject();
        // console.log("actibve" + activeObject)
        if (activeObject) {
          activeObject.set({
            selectable: false,
            evented: false,
          });
        }

        // Use HTML2Canvas to capture the entire content
        html2canvas(canvasRef.current.wrapperEl, { useCORS: true }).then((canvas) => {
          // Create a temporary link element to trigger the download
          const downloadLink = document.createElement('a');

          // Convert canvas to data URL
          const dataURL = canvas.toDataURL('image/png');
          downloadLink.href = dataURL;
          downloadLink.download = 'canvas_image.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        });
      }
    });



    canvas.setDimensions({
      width: window.innerWidth * 0.98,
      height: window.innerHeight * 0.75,
    });



  }, []);




  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setHueRotation(value);

    if (selectedObject) {
      // Clone the selected object
      const clonedObject = fabric.util.object.clone(selectedObject);

      // Remove any previously added cloned object
      canvasRef.current.getObjects().forEach((object) => {
        if (object.type === 'image' && object !== selectedObject) {
          canvasRef.current.remove(object);
        }
      });

      // Remove the original object from the canvas
      canvasRef.current.remove(selectedObject);

      // Draw the image on an off-screen canvas to manipulate pixel data
      const offScreenCanvas = document.createElement('canvas');
      const offScreenCtx = offScreenCanvas.getContext('2d');
      offScreenCanvas.width = clonedObject.width;
      offScreenCanvas.height = clonedObject.height;
      offScreenCtx.drawImage(clonedObject._element, 0, 0, clonedObject.width, clonedObject.height);

      // Get the image data from the off-screen canvas
      const imageData = offScreenCtx.getImageData(0, 0, clonedObject.width, clonedObject.height);
      const data = imageData.data;

      // Adjust the hue
      for (let i = 0; i < data.length; i += 4) {
        const rgb = [data[i], data[i + 1], data[i + 2]];
        const hsl = rgbToHsl(rgb);
        hsl[0] = (hsl[0] + value) % 360;
        const newRgb = hslToRgb(hsl);
        data[i] = newRgb[0];
        data[i + 1] = newRgb[1];
        data[i + 2] = newRgb[2];
      }

      // Put the modified image data back on the off-screen canvas
      offScreenCtx.putImageData(imageData, 0, 0);

      // Update the cloned object with the modified image
      clonedObject.setElement(offScreenCanvas);

      // Set the position of the cloned object to match the selected object
      clonedObject.set({
        top: selectedObject.top,
        left: selectedObject.left,
      });

      // Add the cloned object with the modified image to the canvas
      canvasRef.current.add(clonedObject);
      canvasRef.current.setActiveObject(clonedObject);
      canvasRef.current.requestRenderAll();
    }
  };



  // Helper function to convert RGB to HSL
  function rgbToHsl(rgb) {
    const r = rgb[0] / 255;
    const g = rgb[1] / 255;
    const b = rgb[2] / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }

      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  // Helper function to convert HSL to RGB
  function hslToRgb(hsl) {
    const h = hsl[0] / 360;
    const s = hsl[1] / 100;
    const l = hsl[2] / 100;

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    return [r * 255, g * 255, b * 255];
  }





  function convertImageToFileURL(imageFile) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        resolve(reader.result);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(imageFile);
    });
  }

  return (
    <div className='main-wrapper'>
      <section className='canvas-wrapper'>
        <canvas id="productCanvas" />
      </section>
      <div className='filter-wrapper'>
        <label htmlFor="rotationSlider">Color Rotation:</label>
        <input
          type="range"
          id="rotationSlider"
          min="0"
          max="360"
          step="1"
          value={hueRotation}
          onChange={handleSliderChange}
        />
        <span>{hueRotation} degrees</span>
        <br></br>
      </div>
    </div>
  );
}

export default App;
