const express = require('express');
const router = express.Router();
const mataKuliahController = require('../controllers/mataKuliahController');

// CRUD Mata Kuliah
router.get('/', mataKuliahController.getAllMataKuliah);
router.get('/:kode_mata_kuliah', mataKuliahController.getMataKuliahByKode);
router.post('/', mataKuliahController.createMataKuliah);
router.put('/:kode_mata_kuliah', mataKuliahController.updateMataKuliah);
router.delete('/:kode_mata_kuliah', mataKuliahController.deleteMataKuliah);

module.exports = router;
