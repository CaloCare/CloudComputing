# Gunakan image dasar Python
FROM python:3.10-slim

# Set working directory di dalam container
WORKDIR /app

# Salin requirements.txt ke dalam container
COPY requirements.txt /app/

# Instal dependensi
RUN pip install --no-cache-dir -r requirements.txt

# Salin semua file aplikasi ke dalam container
COPY . /app/

# Jalankan server Flask menggunakan gunicorn
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]