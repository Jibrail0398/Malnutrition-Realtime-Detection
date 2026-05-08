import React, { useRef, useState, useEffect } from 'react';
import { runObjectDetection } from './utils/detect';

const Camera = ({ session }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null); // Ref baru untuk tempat menggambar kotak deteksi
  const streamRef = useRef(null);
  const requestRef = useRef(null); // Menyimpan ID animasi agar bisa dihentikan
  
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState('environment');

  const startCamera = async (mode) => {
    try {
      if(mode) setFacingMode(mode);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Pastikan video sudah siap diputar sebelum mengubah state
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsCameraOpen(true);
          
        };
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
    // Hentikan proses deteksi jika kamera ditutup
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    // Bersihkan canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const switchCamera = async () => {
    stopCamera();
    const newFacingMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(newFacingMode);
    setTimeout(() => {
      startCamera(newFacingMode);
    }, 100);
  };

  const handleButtonClick = () => {
    if (isCameraOpen) stopCamera();
    else startCamera();
  };

  // ==========================================
  // LOGIKA DETEKSI REAL-TIME
  // ==========================================
  const detectFrame = async () => {
    // Pastikan video sedang dimainkan dan model sudah siap
    if (videoRef.current && videoRef.current.readyState >= 2 && session && canvasRef.current) {
      
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Samakan ukuran canvas dengan ukuran asli video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      try {
        // Panggil fungsi deteksi yang kita buat di utils/detect.js
        await runObjectDetection(video, canvas, session);
      } catch (error) {
        console.error("Terjadi kesalahan saat deteksi:", error);
      }
    }
    
    // Looping tanpa henti selama kamera menyala
    requestRef.current = requestAnimationFrame(detectFrame);
  };

  // Jalankan deteksi otomatis setiap kali kamera (isCameraOpen) bernilai true
  useEffect(() => {
    if (isCameraOpen && session) {
      requestRef.current = requestAnimationFrame(detectFrame);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isCameraOpen, session]);

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
        <canvas
          ref={canvasRef}
          className="camera-canvas"
          style={{ position: 'absolute', top: 0, left: 0 }}
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
