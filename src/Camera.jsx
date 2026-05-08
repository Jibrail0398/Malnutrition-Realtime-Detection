import React, { useRef, useState } from 'react';

const Camera = ({ onOpen }) => {
  const videoRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' = back camera, 'user' = front camera
  const streamRef = useRef(null);

  const startCamera = async (mode) => {
    
    try {
      // Request camera access dengan facing mode yang dipilih
      
      if(mode){
        setFacingMode(mode);
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
        },
        audio: false,
      });

      // Set stream ke video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOpen(true);

        // Panggil callback onOpen jika ada
        if (onOpen) {
          onOpen();
        }
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak dapat mengakses kamera. Pastikan Anda memberikan izin akses.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      setIsCameraOpen(false);
    }
  };

  const switchCamera = async () => {
    // Stop camera yang sedang aktif
    stopCamera();

    // Toggle between front dan back camera
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);

    // Start camera dengan facing mode baru
    setTimeout(() => {
      startCamera(newFacingMode);
    }, 100);
  };

  const handleButtonClick = () => {
    if (isCameraOpen) {
      stopCamera();
    } else {
      startCamera();
    }
  };

  return (
    <div className="camera-container">
      <div className="camera-video-container">
        <video
          ref={videoRef}
          className="camera-video"
          autoPlay
          playsInline
          muted
        />
      </div>

      <div className="camera-button-container">
        <button
          onClick={handleButtonClick}
          className={`camera-button ${isCameraOpen ? 'camera-button-close' : 'camera-button-open'}`}
        >
          {isCameraOpen ? 'Tutup Kamera' : 'Buka Kamera'}
        </button>

        {isCameraOpen && (
          <button
            onClick={switchCamera}
            className="camera-button camera-button-switch"
          >
            Tukar Kamera
            <span className="camera-label">
              {facingMode === 'environment' ? '📷 Belakang' : '📷 Depan'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Camera;
