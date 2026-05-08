import { useState, useEffect } from 'react';
import Camera from './Camera';
import { useModel } from './hooks/useModel';

import './App.css'

function App() {

  
  const modelURL = `${import.meta.env.BASE_URL}best.onnx`;
  const { session, loading } = useModel(modelURL);
  

  return (
    <>
    
    {loading?(
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Sedang memuat model YOLOv10...</h2>
      </div>
    ):(
      <Camera/>
    )}

    </>
  )
}

export default App
