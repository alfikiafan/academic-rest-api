const mahasiswaModel = require('../models/mahasiswa');
const mataKuliahModel = require('../models/mataKuliah');

// Get all Mahasiswa
const getAllMahasiswa = async (req, res, next) => {
    try {
        const mahasiswa = await mahasiswaModel.getAllMahasiswa();
        res.json(mahasiswa);
    } catch (error) {
        next(error);
    }
};

// Get Mahasiswa by NIM
const getMahasiswaByNim = async (req, res, next) => {
    try {
        const { nim } = req.params;
        const mahasiswa = await mahasiswaModel.getMahasiswaByNim(nim);
        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }
        const mataKuliah = await mahasiswaModel.getMataKuliahByMahasiswa(nim);
        mahasiswa.mata_kuliah = mataKuliah;
        res.json(mahasiswa);
    } catch (error) {
        next(error);
    }
};

// Create Mahasiswa
const createMahasiswa = async (req, res, next) => {
    try {
        const { nim, nama, alamat, mata_kuliah } = req.body;
        if (!nim || !nama || !alamat) {
            return res.status(400).json({ message: 'NIM, nama, dan alamat wajib diisi' });
        }
        const existingMahasiswa = await mahasiswaModel.getMahasiswaByNim(nim);
        if (existingMahasiswa) {
            return res.status(400).json({ message: 'Mahasiswa dengan NIM tersebut sudah ada' });
        }
        await mahasiswaModel.createMahasiswa({ nim, nama, alamat });
        if (mata_kuliah && Array.isArray(mata_kuliah)) {
            for (const kode of mata_kuliah) {
                await mahasiswaModel.addMataKuliahToMahasiswa(nim, kode);
            }
        }
        res.status(201).json({ message: 'Mahasiswa berhasil ditambahkan' });
    } catch (error) {
        next(error);
    }
};


// Update Mahasiswa
const updateMahasiswa = async (req, res, next) => {
    try {
        const { nim } = req.params;
        const { nama, alamat, mata_kuliah } = req.body;
        const mahasiswa = await mahasiswaModel.getMahasiswaByNim(nim);
        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }
        await mahasiswaModel.updateMahasiswa(nim, { nama, alamat });
        if (mata_kuliah && Array.isArray(mata_kuliah)) {
            // Hapus semua mata kuliah yang diambil saat ini
            const existingMataKuliah = await mahasiswaModel.getMataKuliahByMahasiswa(nim);
            for (const mk of existingMataKuliah) {
                await mahasiswaModel.removeMataKuliahFromMahasiswa(nim, mk.kode_mata_kuliah);
            }
            // Tambahkan mata kuliah baru
            for (const kode of mata_kuliah) {
                await mahasiswaModel.addMataKuliahToMahasiswa(nim, kode);
            }
        }
        res.json({ message: 'Mahasiswa berhasil diperbarui' });
    } catch (error) {
        next(error);
    }
};

// Delete Mahasiswa
const deleteMahasiswa = async (req, res, next) => {
    try {
        const { nim } = req.params;
        const mahasiswa = await mahasiswaModel.getMahasiswaByNim(nim);
        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }
        await mahasiswaModel.deleteMahasiswa(nim);
        res.json({ message: 'Mahasiswa berhasil dihapus' });
    } catch (error) {
        next(error);
    }
};

// Add Mata Kuliah to Mahasiswa (Opsional, jika Anda masih ingin menggunakannya)
const addMataKuliahToMahasiswa = async (req, res, next) => {
    try {
        const { nim } = req.params;
        const { kode_mata_kuliah } = req.body;

        const mahasiswa = await mahasiswaModel.getMahasiswaByNim(nim);
        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }

        // Periksa apakah mata kuliah sudah diambil
        const mataKuliahMahasiswa = await mahasiswaModel.getMataKuliahByMahasiswa(nim);
        if (mataKuliahMahasiswa.find(mk => mk.kode_mata_kuliah === kode_mata_kuliah)) {
            return res.status(400).json({ message: 'Mata kuliah sudah diambil oleh mahasiswa ini' });
        }

        await mahasiswaModel.addMataKuliahToMahasiswa(nim, kode_mata_kuliah);
        res.json({ message: 'Mata kuliah berhasil ditambahkan ke mahasiswa' });
    } catch (error) {
        next(error);
    }
};

// Remove Mata Kuliah from Mahasiswa (Opsional, jika Anda masih ingin menggunakannya)
const removeMataKuliahFromMahasiswa = async (req, res, next) => {
    try {
        const { nim, kode_mata_kuliah } = req.params;

        const mahasiswa = await mahasiswaModel.getMahasiswaByNim(nim);
        if (!mahasiswa) {
            return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
        }

        const mataKuliahMahasiswa = await mahasiswaModel.getMataKuliahByMahasiswa(nim);
        if (!mataKuliahMahasiswa.find(mk => mk.kode_mata_kuliah === kode_mata_kuliah)) {
            return res.status(400).json({ message: 'Mata kuliah tidak diambil oleh mahasiswa ini' });
        }

        await mahasiswaModel.removeMataKuliahFromMahasiswa(nim, kode_mata_kuliah);
        res.json({ message: 'Mata kuliah berhasil dihapus dari mahasiswa' });
    } catch (error) {
        next(error);
    }
};

// Metode untuk SOAP API
const getAllMahasiswaSOAP = async () => {
    try {
        const mahasiswa = await Mahasiswa.findAll({
            include: MataKuliah
        });
        return mahasiswa.map(m => ({
            nim: m.nim,
            nama: m.nama,
            alamat: m.alamat,
            mata_kuliah: m.MataKuliah.map(mk => ({
                kode_mata_kuliah: mk.kode_mata_kuliah,
                nama_mata_kuliah: mk.nama_mata_kuliah,
                sks: mk.sks
            }))
        }));
    } catch (error) {
        throw error;
    }
};

const getMahasiswaByNimSOAP = async (nim) => {
    try {
        const mahasiswa = await Mahasiswa.findOne({
            where: { nim },
            include: MataKuliah
        });
        if (!mahasiswa) return null;
        return {
            nim: mahasiswa.nim,
            nama: mahasiswa.nama,
            alamat: mahasiswa.alamat,
            mata_kuliah: mahasiswa.MataKuliah.map(mk => ({
                kode_mata_kuliah: mk.kode_mata_kuliah,
                nama_mata_kuliah: mk.nama_mata_kuliah,
                sks: mk.sks
            }))
        };
    } catch (error) {
        throw error;
    }
};

const createMahasiswaSOAP = async ({ nim, nama, alamat, mata_kuliah }) => {
    try {
        const mahasiswa = await Mahasiswa.create({ nim, nama, alamat });
        if (mata_kuliah && mata_kuliah.length > 0) {
            const mataKuliahRecords = await MataKuliah.findAll({
                where: { kode_mata_kuliah: mata_kuliah }
            });
            await mahasiswa.addMataKuliah(mataKuliahRecords);
        }
        return {
            nim: mahasiswa.nim,
            nama: mahasiswa.nama,
            alamat: mahasiswa.alamat,
            mata_kuliah: mata_kuliah.map(kode => ({ kode_mata_kuliah: kode }))
        };
    } catch (error) {
        throw error;
    }
};

const updateMahasiswaSOAP = async ({ nim, nama, alamat, mata_kuliah }) => {
    try {
        const mahasiswa = await Mahasiswa.findOne({ where: { nim } });
        if (!mahasiswa) throw new Error('Mahasiswa tidak ditemukan');
        mahasiswa.nama = nama;
        mahasiswa.alamat = alamat;
        await mahasiswa.save();
        if (mata_kuliah) {
            const mataKuliahRecords = await MataKuliah.findAll({
                where: { kode_mata_kuliah: mata_kuliah }
            });
            await mahasiswa.setMataKuliah(mataKuliahRecords);
        }
        return {
            nim: mahasiswa.nim,
            nama: mahasiswa.nama,
            alamat: mahasiswa.alamat,
            mata_kuliah: mata_kuliah.map(kode => ({ kode_mata_kuliah: kode }))
        };
    } catch (error) {
        throw error;
    }
};

const deleteMahasiswaSOAP = async (nim) => {
    try {
        const mahasiswa = await Mahasiswa.findOne({ where: { nim } });
        if (!mahasiswa) throw new Error('Mahasiswa tidak ditemukan');
        await mahasiswa.destroy();
        return {
            message: 'Mahasiswa berhasil dihapus'
        };
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllMahasiswa,
    getMahasiswaByNim,
    createMahasiswa,
    updateMahasiswa,
    deleteMahasiswa,
    addMataKuliahToMahasiswa,
    removeMataKuliahFromMahasiswa,
    getAllMahasiswaSOAP,
    getMahasiswaByNimSOAP,
    createMahasiswaSOAP,
    updateMahasiswaSOAP,
    deleteMahasiswaSOAP
};
