const pool = require('../config/db');

// CRUD Mata Kuliah
const getAllMataKuliah = async () => {
    const [rows] = await pool.query('SELECT * FROM mata_kuliah');
    return rows;
};

const getMataKuliahByKode = async (kode_mata_kuliah) => {
    const [rows] = await pool.query('SELECT * FROM mata_kuliah WHERE kode_mata_kuliah = ?', [kode_mata_kuliah]);
    return rows[0];
};

const createMataKuliah = async (mataKuliah) => {
    const { kode_mata_kuliah, nama_mata_kuliah, sks } = mataKuliah;
    const [result] = await pool.query('INSERT INTO mata_kuliah (kode_mata_kuliah, nama_mata_kuliah, sks) VALUES (?, ?, ?)', [kode_mata_kuliah, nama_mata_kuliah, sks]);
    return result;
};

const updateMataKuliah = async (kode_mata_kuliah, mataKuliah) => {
    const { nama_mata_kuliah, sks } = mataKuliah;
    const [result] = await pool.query('UPDATE mata_kuliah SET nama_mata_kuliah = ?, sks = ? WHERE kode_mata_kuliah = ?', [nama_mata_kuliah, sks, kode_mata_kuliah]);
    return result;
};

const deleteMataKuliah = async (kode_mata_kuliah) => {
    const [result] = await pool.query('DELETE FROM mata_kuliah WHERE kode_mata_kuliah = ?', [kode_mata_kuliah]);
    return result;
};

module.exports = {
    getAllMataKuliah,
    getMataKuliahByKode,
    createMataKuliah,
    updateMataKuliah,
    deleteMataKuliah
};
