const { Firestore } = require('@google-cloud/firestore');

// Fungsi untuk menyimpan data makanan ke Firestore
async function storeData(newFood) {
    const db = new Firestore();
    
    // Pastikan ID valid
    if (!newFood.id || typeof newFood.id !== 'string' || newFood.id.trim() === '') {
        console.error('Invalid food ID');
        throw new Error('ID food is invalid');
    }

    const foodCollection = db.collection('food'); // Koleksi 'food' untuk menyimpan data makanan
    const docRef = foodCollection.doc(newFood.id); // Menggunakan id makanan sebagai document ID

    try {
        console.log('Storing food data:', newFood);  // Menampilkan data yang akan disimpan
        await docRef.set(newFood);
        console.log('Food data successfully stored!');
    } catch (error) {
        console.error('Error storing food:', error);
        throw new Error('Failed to store food data');
    }
}

module.exports = storeData;
