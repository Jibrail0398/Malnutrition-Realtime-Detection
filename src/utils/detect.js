import * as ort from "onnxruntime-web";

/**
 * Fungsi utama untuk memproses video, menjalankan model, dan menggambar kotak
 */
export const runObjectDetection = async (video, canvas, session) => {
  // Ukuran standar input model YOLOv10
  const modelWidth = 256;
  const modelHeight = 256;

  // 1. PREPROCESSING: Ambil gambar dari video dan ubah ukurannya
  // Kita buat canvas sementara (tidak tampil di layar) untuk me-resize gambar video
  const offscreenCanvas = document.createElement("canvas");
  offscreenCanvas.width = modelWidth;
  offscreenCanvas.height = modelHeight;
  const ctx = offscreenCanvas.getContext("2d");
  
  // Gambar frame video saat ini ke canvas sementara dengan ukuran 640x640
  ctx.drawImage(video, 0, 0, modelWidth, modelHeight);
  
  // Ambil data pikselnya (format bawaannya adalah RGBA)
  const imageData = ctx.getImageData(0, 0, modelWidth, modelHeight);
  const pixels = imageData.data;

  // Siapkan array kosong untuk menampung format Tensor (Channel x Height x Width)
  const float32Data = new Float32Array(3 * modelWidth * modelHeight);

  // Konversi dari RGBA [0-255] menjadi RGB [0.0 - 1.0] dan pisahkan layernya (Red, Green, Blue)
  for (let i = 0; i < pixels.length / 4; i++) {
    float32Data[i] = pixels[i * 4] / 255.0;                                  // Red
    float32Data[modelWidth * modelHeight + i] = pixels[i * 4 + 1] / 255.0;     // Green
    float32Data[2 * modelWidth * modelHeight + i] = pixels[i * 4 + 2] / 255.0; // Blue
  }

  // Buat objek Tensor menggunakan ONNX Runtime
  const tensor = new ort.Tensor("float32", float32Data, [1, 3, modelHeight, modelWidth]);

  // 2. INFERENCE: Berikan Tensor ke model YOLOv10 untuk ditebak
  const feeds = {};
  feeds[session.inputNames[0]] = tensor; // Masukkan input
  const results = await session.run(feeds); // Mulai proses deteksi!
  
  // Ambil hasil outputnya. YOLOv10 biasanya mengeluarkan array [1, 300, 6]
  const outputData = results[session.outputNames[0]].data;

  // 3. POSTPROCESSING: Gambar hasil ke layar
  renderBoxes(canvas, outputData, video.videoWidth, video.videoHeight, modelWidth, modelHeight);
};

/**
 * Fungsi untuk menggambar Bounding Box ke atas Canvas
 */
const renderBoxes = (canvas, outputData, videoWidth, videoHeight, modelWidth, modelHeight) => {
  const ctx = canvas.getContext("2d");
  
  // Bersihkan canvas dari kotak deteksi frame sebelumnya
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Hitung rasio perbedaan ukuran asli video dengan ukuran model (640x640)
  // Ini penting agar kotak tergambar di posisi yang akurat pada layar pengguna
  const xRatio = videoWidth / modelWidth;
  const yRatio = videoHeight / modelHeight;

  // Format output YOLOv10 adalah deretan angka: [x1, y1, x2, y2, score, classId]
  // Setiap 6 angka merepresentasikan 1 objek yang terdeteksi
  for (let i = 0; i < outputData.length; i += 6) {
    const score = outputData[i + 4];

    // Filter: Hanya tampilkan objek dengan tingkat kepercayaan (confidence) di atas 50%
    if (score > 0.5) {
      let x1 = outputData[i];
      let y1 = outputData[i + 1];
      let x2 = outputData[i + 2];
      let y2 = outputData[i + 3];
      const classId = outputData[i + 5];

      // Kembalikan koordinat kotak ke ukuran asli video
      x1 *= xRatio;
      x2 *= xRatio;
      y1 *= yRatio;
      y2 *= yRatio;
      const width = x2 - x1;
      const height = y2 - y1;

      // --- Mulai Menggambar Kotak ---
      ctx.strokeStyle = "#00FF00"; // Warna kotak (Hijau)
      ctx.lineWidth = 3;
      ctx.strokeRect(x1, y1, width, height);

      // --- Mulai Menggambar Label Text ---
      ctx.fillStyle = "#00FF00";
      ctx.font = "18px Arial";
      const label = `Objek ${classId} (${Math.round(score * 100)}%)`;
      ctx.fillText(label, x1, y1 - 5);
    }
  }
};