const { nanoid } = require('nanoid');
const storeData = require('./storeData');
const { Firestore } = require('@google-cloud/firestore');


// Handler untuk menambahkan data makanan ke Firestore
const addFoodHandler = async (request, h) => {
    const {
        foodName, carbohydrate, protein, fat, calories, totalNutrition, evaluation
    } = request.payload;

    const id = nanoid(16);  // Membuat ID unik menggunakan nanoid
    const createdAt = new Date().toISOString();

    // Validasi input
    if (!foodName) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan makanan. Mohon isi nama makanan',
        }).code(400);
    }

    // Membuat objek makanan baru
    const newFood = {
        id, foodName, carbohydrate, protein, fat, calories, totalNutrition, evaluation, createdAt,
    };

    try {
        // Menyimpan data makanan ke Firestore
        await storeData(newFood);

        return h.response({
            status: 'success',
            message: 'Makanan berhasil ditambahkan',
            data: {
                foodId: id,
            },
        }).code(201);

    } catch (error) {
        console.error('Error saving food:', error);

        return h.response({
            status: 'error',
            message: 'Gagal menambahkan makanan. Terjadi kesalahan pada server.',
        }).code(500);
    }
};

// Handler untuk mengambil semua data makanan
const getAllFoodHandler = async (request, h) => {
    try {
        const db = new Firestore();
        const foodCollection = db.collection('food');
        const snapshot = await foodCollection.get();

        if (snapshot.empty) {
            return h.response({
                status: 'fail',
                message: 'Tidak ada data makanan',
            }).code(404);
        }

        const foods = snapshot.docs.map(doc => doc.data());

        return h.response({
            status: 'success',
            data: { foods },
        }).code(200);
    } catch (error) {
        console.error('Error fetching food data:', error);
        return h.response({
            status: 'error',
            message: 'Gagal mengambil data makanan',
        }).code(500);
    }
};

const deleteFoodByNameHandler = async (request, h) => {
    const { foodName } = request.payload; // Mengambil nama makanan dari body

    if (!foodName) {
        return h.response({
            status: 'fail',
            message: 'Nama makanan tidak boleh kosong',
        }).code(400);
    }

    try {
        const db = new Firestore();
        const foodCollection = db.collection('food');
        const snapshot = await foodCollection.where('foodName', '==', foodName).get();

        if (snapshot.empty) {
            return h.response({
                status: 'fail',
                message: 'Makanan tidak ditemukan',
            }).code(404);
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();

        return h.response({
            status: 'success',
            message: `Makanan "${foodName}" berhasil dihapus`,
        }).code(200);
    } catch (error) {
        console.error('Error deleting food by name:', error);
        return h.response({
            status: 'error',
            message: 'Gagal menghapus makanan',
        }).code(500);
    }
};

module.exports = { deleteFoodByNameHandler };

const searchFoodHandler = async (request, h) => {
    const { name } = request.query; // Mengambil query parameter "name"

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Parameter name tidak boleh kosong',
        }).code(400);
    }

    try {
        const db = new Firestore();
        const foodCollection = db.collection('food');
        const snapshot = await foodCollection.where('foodName', '>=', name)
                                             .where('foodName', '<=', name + '\uf8ff')
                                             .get();

        if (snapshot.empty) {
            return h.response({
                status: 'fail',
                message: 'Makanan tidak ditemukan',
            }).code(404);
        }

        const foods = snapshot.docs.map((doc) => doc.data());

        return h.response({
            status: 'success',
            data: { foods },
        }).code(200);
    } catch (error) {
        console.error('Error searching food data:', error);
        return h.response({
            status: 'error',
            message: 'Gagal mencari data makanan',
        }).code(500);
    }
};

module.exports = { addFoodHandler, getAllFoodHandler, deleteFoodByNameHandler, searchFoodHandler };