# YOLOv10 TensorFlow.js React Experiment

## Deskripsi Project

Project ini merupakan sebuah eksperimen implementasi dan deployment model **YOLOv10** menggunakan **TensorFlow.js** pada aplikasi berbasis **React.js**.  

Tujuan utama dari project ini adalah untuk melakukan **deteksi objek secara realtime** terhadap bayi yang terindikasi mengalami **malnutrisi** menggunakan kamera perangkat secara langsung di browser.

---

# Tujuan Penelitian dan Eksperimen

Eksperimen ini dilakukan untuk mengeksplorasi:

- Deployment model YOLOv10 ke lingkungan web
- Integrasi TensorFlow.js dengan React.js
- Inferensi object detection secara realtime di browser
- Implementasi computer vision tanpa backend inference server

---

# Teknologi yang Digunakan

| Teknologi | Fungsi |
|---|---|
| React.js | Frontend Framework |
| TensorFlow.js | Menjalankan model AI di browser |
| YOLOv10 | Model object detection |
| JavaScript | Bahasa pemrograman utama |
| HTML5 Canvas | Visualisasi bounding box |
| Web Camera API | Mengakses kamera realtime |

---

# Fitur Utama

- Realtime object detection menggunakan webcam
- Deteksi bayi malnutrisi
- Bounding box dan confidence score
- Inferensi langsung di browser
- Tidak membutuhkan server GPU saat runtime
- Cross-platform berbasis web

---

# Cara Kerja Sistem

1. User membuka aplikasi React
2. Browser meminta akses kamera
3. Frame video diproses menggunakan TensorFlow.js
4. Model YOLOv10 melakukan inferensi object detection
5. Hasil prediksi ditampilkan secara realtime pada canvas

---

# Arsitektur Sederhana

```text
Webcam → Video Frame → TensorFlow.js → YOLOv10 Model
       → Inference → Bounding Box Rendering → Browser UI