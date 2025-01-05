const mataKuliahModel = require('../models/mataKuliah');
const mahasiswaModel = require('../models/mahasiswa');

// Get all Mata Kuliah
const getAllMataKuliah = async (req, res, next) => {
    try {
        const mataKuliah = await mataKuliahModel.getAllMataKuliah();
        res.json(mataKuliah);
    } catch (error) {
        next(error);
    }
};

// Get Mata Kuliah by Kode
const getMataKuliahByKode = async (req, res, next) => {
    try {
        const { kode_mata_kuliah } = req.params;
        const mataKuliah = await mataKuliahModel.getMataKuliahByKode(kode_mata_kuliah);
        if (!mataKuliah) {
            return res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });
        }
        res.json(mataKuliah);
    } catch (error) {
        next(error);
    }
};

// Create Mata Kuliah
const createMataKuliah = async (req, res, next) => {
    try {
        const { kode_mata_kuliah, nama_mata_kuliah, sks } = req.body;
        if (!kode_mata_kuliah || !nama_mata_kuliah || !sks) {
            return res.status(400).json({ message: 'Kode, nama mata kuliah, dan SKS wajib diisi' });
        }
        const existingMataKuliah = await mataKuliahModel.getMataKuliahByKode(kode_mata_kuliah);
        if (existingMataKuliah) {
            return res.status(400).json({ message: 'Mata kuliah dengan kode tersebut sudah ada' });
        }
        await mataKuliahModel.createMataKuliah({ kode_mata_kuliah, nama_mata_kuliah, sks });
        res.status(201).json({ message: 'Mata kuliah berhasil ditambahkan' });
    } catch (error) {
        next(error);
    }
};

// Update Mata Kuliah
const updateMataKuliah = async (req, res, next) => {
    try {
        const { kode_mata_kuliah } = req.params;
        const { nama_mata_kuliah, sks } = req.body;
        const mataKuliah = await mataKuliahModel.getMataKuliahByKode(kode_mata_kuliah);
        if (!mataKuliah) {
            return res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });
        }
        await mataKuliahModel.updateMataKuliah(kode_mata_kuliah, { nama_mata_kuliah, sks });
        res.json({ message: 'Mata kuliah berhasil diperbarui' });
    } catch (error) {
        next(error);
    }
};

// Delete Mata Kuliah
const deleteMataKuliah = async (req, res, next) => {
    try {
        const { kode_mata_kuliah } = req.params;
        const mataKuliah = await mataKuliahModel.getMataKuliahByKode(kode_mata_kuliah);
        if (!mataKuliah) {
            return res.status(404).json({ message: 'Mata kuliah tidak ditemukan' });
        }
        await mataKuliahModel.deleteMataKuliah(kode_mata_kuliah);
        res.json({ message: 'Mata kuliah berhasil dihapus' });
    } catch (error) {
        next(error);
    }
};

// Metode untuk SOAP API
const getAllMataKuliahSOAP = async () => {
    try {
        const mataKuliah = await MataKuliah.findAll();
        return mataKuliah.map(mk => ({
            kode_mata_kuliah: mk.kode_mata_kuliah,
            nama_mata_kuliah: mk.nama_mata_kuliah,
            sks: mk.sks
        }));
    } catch (error) {
        throw error;
    }
};

const getMataKuliahByKodeSOAP = async (kode) => {
    try {
        const mk = await MataKuliah.findOne({ where: { kode_mata_kuliah: kode } });
        if (!mk) return null;
        return {
            kode_mata_kuliah: mk.kode_mata_kuliah,
            nama_mata_kuliah: mk.nama_mata_kuliah,
            sks: mk.sks
        };
    } catch (error) {
        throw error;
    }
};

const createMataKuliahSOAP = async ({ kode_mata_kuliah, nama_mata_kuliah, sks }) => {
    try {
        const mk = await MataKuliah.create({ kode_mata_kuliah, nama_mata_kuliah, sks });
        return {
            kode_mata_kuliah: mk.kode_mata_kuliah,
            nama_mata_kuliah: mk.nama_mata_kuliah,
            sks: mk.sks
        };
    } catch (error) {
        throw error;
    }
};

const updateMataKuliahSOAP = async ({ kode_mata_kuliah, nama_mata_kuliah, sks }) => {
    try {
        const mk = await MataKuliah.findOne({ where: { kode_mata_kuliah } });
        if (!mk) throw new Error('Mata Kuliah tidak ditemukan');
        mk.nama_mata_kuliah = nama_mata_kuliah;
        mk.sks = sks;
        await mk.save();
        return {
            kode_mata_kuliah: mk.kode_mata_kuliah,
            nama_mata_kuliah: mk.nama_mata_kuliah,
            sks: mk.sks
        };
    } catch (error) {
        throw error;
    }
};

const deleteMataKuliahSOAP = async (kode_mata_kuliah) => {
    try {
        const mk = await MataKuliah.findOne({ where: { kode_mata_kuliah } });
        if (!mk) throw new Error('Mata Kuliah tidak ditemukan');
        await mk.destroy();
        return {
            message: 'Mata Kuliah berhasil dihapus'
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllMataKuliah,
    getMataKuliahByKode,
    createMataKuliah,
    updateMataKuliah,
    deleteMataKuliah,
    getAllMataKuliahSOAP,
    getMataKuliahByKodeSOAP,
    createMataKuliahSOAP,
    updateMataKuliahSOAP,
    deleteMataKuliahSOAP
};
