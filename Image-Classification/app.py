import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io
from flask import Flask, request, jsonify

# Inisialisasi Flask
app = Flask(__name__)

# Memuat model
model = load_model("Image_ML_Model.h5")

# Mendapatkan ukuran input model
input_size = model.input_shape[1:3]  # Ambil ukuran (height, width) dari model

# Mapping kelas ke nama makanan
class_names = [
    "Ayam Goreng",
    "Ayam Pop",
    "Daging Rendang",
    "Dendeng Batokok",
    "Gulai Ikan",
    "Gulai Tambusu",
    "Gulai Tunjang",
    "Telur Balado",
    "Telur Dadar"
]


# Fungsi untuk preprocessing gambar
def preprocess_image(image_bytes):
    """
    Mengubah byte gambar menjadi array numpy yang siap untuk model prediksi.
    
    Args:
        image_bytes (bytes): Data gambar dalam bentuk byte.
        
    Returns:
        np.ndarray: Array gambar yang telah diproses.
    """
    img = Image.open(io.BytesIO(image_bytes))  # Membuka gambar dari byte
    img = img.convert("RGB")  # Mengonversi gambar menjadi RGB untuk menghindari saluran alpha
    img = img.resize(input_size)  # Ubah ukuran gambar sesuai dengan input model
    img_array = np.array(img) / 255.0  # Normalisasi nilai piksel (0-1)
    img_array = np.expand_dims(img_array, axis=0)  # Tambahkan dimensi batch
    return img_array


# Fungsi untuk prediksi
def predict_image(image_bytes):
    """
    Melakukan prediksi terhadap gambar menggunakan model yang telah dilatih.
    
    Args:
        image_bytes (bytes): Data gambar dalam bentuk byte.
        
    Returns:
        str: Nama makanan hasil prediksi.
    """
    # Preprocess gambar
    img_array = preprocess_image(image_bytes)
    
    # Melakukan prediksi
    predictions = model.predict(img_array)
    predicted_class = np.argmax(predictions, axis=1)[0]  # Mendapatkan kelas dengan probabilitas tertinggi
    
    # Mendapatkan nama makanan dari mapping
    return class_names[predicted_class] if predicted_class < len(class_names) else "Unknown"


# Endpoint untuk prediksi
@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint untuk menerima file gambar dan melakukan prediksi.
    """
    # Periksa apakah file dikirim
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
    
    # Ambil file dari request
    file = request.files['file']
    
    if file:
        try:
            # Baca konten file
            image_bytes = file.read()
            
            # Prediksi gambar
            result = predict_image(image_bytes)
            
            # Kembalikan hasil prediksi sebagai JSON
            return jsonify({"foodName": result})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Invalid file"}), 400

# Jalankan aplikasi
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
