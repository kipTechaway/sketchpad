import logo from './logo.svg';

import './App.css';

import { useEffect, useRef, useState } from "react";

import Menu from "./components/Menu";

function App() {

  const canvasRef = useRef(null);

  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(5);
  const [lineColor, setLineColor] = useState("black");
  const [lineOpacity, setLineOpacity] = useState(0.1);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const backgroundCanvasRef = useRef(null);
  const backgroundCtxRef = useRef(null);
  // Initialization when the component
  // mounts for the first time
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = `${lineColor}${Math.floor(lineOpacity * 255).toString(16).padStart(2, '0')}`;
      ctx.lineWidth = lineWidth;
      ctxRef.current = ctx;
    }

    const backgroundCanvas = backgroundCanvasRef.current;
    if (backgroundCanvas) {
      const backgroundCtx = backgroundCanvas.getContext("2d");
      backgroundCtxRef.current = backgroundCtx;
    }

    if (backgroundImage) {
      const image = new Image();
      image.src = backgroundImage;
      image.onload = () => {
        if (ctxRef.current) {
          ctxRef.current.drawImage(image, 0, 0);
        }
      };
    }
  }, [backgroundImage, lineColor, lineOpacity, lineWidth]);



  // Function for starting the drawing

  const startDrawing = (e) => {

    ctxRef.current.beginPath();

    ctxRef.current.moveTo(

      e.nativeEvent.offsetX,

      e.nativeEvent.offsetY

    );

    setIsDrawing(true);

  };



  // Function for ending the drawing

  const endDrawing = () => {

    ctxRef.current.closePath();

    setIsDrawing(false);

  };



  const draw = (e) => {

    if (!isDrawing) {

      return;

    }

    ctxRef.current.lineTo(

      e.nativeEvent.offsetX,

      e.nativeEvent.offsetY

    );

    ctxRef.current.stroke();

  };


  const handleImageUpload = (e) => {

    const file = e.target.files[0];

    const reader = new FileReader();

    reader.onload = (event) => {

      const image = new Image();

      image.src = event.target.result;

      image.onload = () => {

        const canvas = canvasRef.current;

        const ctx = ctxRef.current;

        const imageAspectRatio = image.width / image.height;

        const canvasAspectRatio = canvas.width / canvas.height;

        let drawWidth, drawHeight, drawX, drawY;

        if (imageAspectRatio > canvasAspectRatio) {

          drawWidth = canvas.width;

          drawHeight = canvas.width / imageAspectRatio;

          drawX = 0;

          drawY = (canvas.height - drawHeight) / 2;

        } else {

          drawWidth = canvas.height * imageAspectRatio;

          drawHeight = canvas.height;

          drawX = (canvas.width - drawWidth) / 2;

          drawY = 0;

        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(image, drawX, drawY, drawWidth, drawHeight);

        setBackgroundImage(canvas.toDataURL());

      };

    };

    reader.readAsDataURL(file);

  };

  const handleSaveSketch = () => {

    const link = document.createElement("a");

    link.href = canvasRef.current.toDataURL("image/png");

    link.download = "sketch.png";

    link.click();

  };

  return (

    <div className="App">

      <h1>Sketchpad</h1>

      <div className="draw-area">

        <Menu

          setLineColor={setLineColor}

          setLineWidth={setLineWidth}

          setLineOpacity={setLineOpacity}

          onImageUpload={handleImageUpload}

          onSaveSketch={handleSaveSketch}

        />

    <canvas
      onMouseDown={startDrawing}
      onMouseUp={endDrawing}
      onMouseMove={draw}
      ref={canvasRef}
      width={1280}
      height={720}
    />

      </div>

    </div>

  );

}

export default App;