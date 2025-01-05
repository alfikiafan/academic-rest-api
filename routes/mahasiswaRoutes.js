const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const mataKuliahController = require('../controllers/mataKuliahController');

// CRUD Mahasiswa
router.get('/', mahasiswaController.getAllMahasiswa);
router.get('/:nim', mahasiswaController.getMahasiswaByNim);
router.post('/', mahasiswaController.createMahasiswa);
router.put('/:nim', mahasiswaController.updateMahasiswa);
router.delete('/:nim', mahasiswaController.deleteMahasiswa);
router.get('/', mataKuliahController.getAllMataKuliah);

// Manage Mata Kuliah Mahasiswa
router.post('/:nim/mata_kuliah', mahasiswaController.addMataKuliahToMahasiswa);
router.delete('/:nim/mata_kuliah/:kode_mata_kuliah', mahasiswaController.removeMataKuliahFromMahasiswa);

module.exports = router;
