const pool = require('../config/db');

// CRUD Mahasiswa
const getAllMahasiswa = async () => {
    const [rows] = await pool.query('SELECT * FROM mahasiswa');
    return rows;
};

const getMahasiswaByNim = async (nim) => {
    const [rows] = await pool.query('SELECT * FROM mahasiswa WHERE nim = ?', [nim]);
    return rows[0];
};

const createMahasiswa = async (mahasiswa) => {
    const { nim, nama, alamat } = mahasiswa;
    const [result] = await pool.query('INSERT INTO mahasiswa (nim, nama, alamat) VALUES (?, ?, ?)', [nim, nama, alamat]);
    return result;
};

const updateMahasiswa = async (nim, mahasiswa) => {
    const { nama, alamat } = mahasiswa;
    const [result] = await pool.query('UPDATE mahasiswa SET nama = ?, alamat = ? WHERE nim = ?', [nama, alamat, nim]);
    return result;
};

const deleteMahasiswa = async (nim) => {
    const [result] = await pool.query('DELETE FROM mahasiswa WHERE nim = ?', [nim]);
    return result;
};

const getMataKuliahByMahasiswa = async (nim) => {
    const [rows] = await pool.query(`
        SELECT mk.kode_mata_kuliah, mk.nama_mata_kuliah, mk.sks
        FROM mata_kuliah mk
        JOIN mahasiswa_mata_kuliah mmk ON mk.kode_mata_kuliah = mmk.kode_mata_kuliah
        WHERE mmk.nim = ?
    `, [nim]);
    return rows;
};

const addMataKuliahToMahasiswa = async (nim, kode_mata_kuliah) => {
    const [result] = await pool.query('INSERT INTO mahasiswa_mata_kuliah (nim, kode_mata_kuliah) VALUES (?, ?)', [nim, kode_mata_kuliah]);
    return result;
};

const removeMataKuliahFromMahasiswa = async (nim, kode_mata_kuliah) => {
    const [result] = await pool.query('DELETE FROM mahasiswa_mata_kuliah WHERE nim = ? AND kode_mata_kuliah = ?', [nim, kode_mata_kuliah]);
    return result;
};

module.exports = {
    getAllMahasiswa,
    getMahasiswaByNim,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    getMataKuliahByMahasiswa,
    addMataKuliahToMahasiswa,
    removeMataKuliahFromMahasiswa
};
