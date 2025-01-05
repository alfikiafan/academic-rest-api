const soap = require('strong-soap').soap;
const http = require('http');
const fs = require('fs');
const path = require('path');
const mahasiswaController = require('../controllers/mahasiswaController');
const mataKuliahController = require('../controllers/mataKuliahController');

// Membaca WSDL
const wsdlPath = path.join(__dirname, '..', 'wsdl', 'AcademicDashboard.wsdl');
let wsdl;

try {
    wsdl = fs.readFileSync(wsdlPath, 'utf8');
    console.log('WSDL successfully read');
} catch (err) {
    console.error('Error reading WSDL:', err);
    process.exit(1);
}

// Mendefinisikan Service sesuai dengan WSDL
const service = {
    AcademicDashboardService: {
        AcademicDashboardPortType: {
            // Mahasiswa Operations
            GetAllMahasiswa: async (args, callback, headers, req) => {
                try {
                    const mahasiswaList = await mahasiswaController.getAllMahasiswaSOAP();
                    callback(null, { mahasiswa: { Mahasiswa: mahasiswaList } });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            GetMahasiswaByNim: async (args, callback, headers, req) => {
                try {
                    const { nim } = args.GetMahasiswaByNimRequest;
                    const mahasiswa = await mahasiswaController.getMahasiswaByNimSOAP(nim);
                    if (!mahasiswa) {
                        throw new Error('Mahasiswa tidak ditemukan');
                    }
                    callback(null, { mahasiswa });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            CreateMahasiswa: async (args, callback, headers, req) => {
                try {
                    const { nim, nama, alamat, mata_kuliah } = args.CreateMahasiswaRequest;
                    const mahasiswa = await mahasiswaController.createMahasiswaSOAP({ nim, nama, alamat, mata_kuliah });
                    callback(null, { mahasiswa });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            UpdateMahasiswa: async (args, callback, headers, req) => {
                try {
                    const { nim, nama, alamat, mata_kuliah } = args.UpdateMahasiswaRequest;
                    const mahasiswa = await mahasiswaController.updateMahasiswaSOAP({ nim, nama, alamat, mata_kuliah });
                    callback(null, { mahasiswa });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            DeleteMahasiswa: async (args, callback, headers, req) => {
                try {
                    const { nim } = args.DeleteMahasiswaRequest;
                    const result = await mahasiswaController.deleteMahasiswaSOAP(nim);
                    callback(null, { message: result.message });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },

            // MataKuliah Operations
            GetAllMataKuliah: async (args, callback, headers, req) => {
                try {
                    const mataKuliahList = await mataKuliahController.getAllMataKuliahSOAP();
                    callback(null, { mata_kuliah: { MataKuliah: mataKuliahList } });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            GetMataKuliahByKode: async (args, callback, headers, req) => {
                try {
                    const { kode_mata_kuliah } = args.GetMataKuliahByKodeRequest;
                    const mataKuliah = await mataKuliahController.getMataKuliahByKodeSOAP(kode_mata_kuliah);
                    if (!mataKuliah) {
                        throw new Error('Mata Kuliah tidak ditemukan');
                    }
                    callback(null, { mata_kuliah });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            CreateMataKuliah: async (args, callback, headers, req) => {
                try {
                    const { kode_mata_kuliah, nama_mata_kuliah, sks } = args.CreateMataKuliahRequest;
                    const mataKuliah = await mataKuliahController.createMataKuliahSOAP({ kode_mata_kuliah, nama_mata_kuliah, sks });
                    callback(null, { mata_kuliah });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            UpdateMataKuliah: async (args, callback, headers, req) => {
                try {
                    const { kode_mata_kuliah, nama_mata_kuliah, sks } = args.UpdateMataKuliahRequest;
                    const mataKuliah = await mataKuliahController.updateMataKuliahSOAP({ kode_mata_kuliah, nama_mata_kuliah, sks });
                    callback(null, { mata_kuliah });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            },
            DeleteMataKuliah: async (args, callback, headers, req) => {
                try {
                    const { kode_mata_kuliah } = args.DeleteMataKuliahRequest;
                    const result = await mataKuliahController.deleteMataKuliahSOAP(kode_mata_kuliah);
                    callback(null, { message: result.message });
                } catch (error) {
                    callback({ Fault: { faultcode: 'Client', faultstring: error.message } }, null);
                }
            }
        }
    }
};

const soapServer = (port) => {
    const server = http.createServer((request, response) => {
        if (request.url === '/') {
            response.writeHead(200, { 'Content-Type': 'text/plain' });
            response.end('Academic Dashboard SOAP Service\nAccess the WSDL at /soap?wsdl');
        } else {
            // Handle SOAP requests
            response.end('404: Not Found: ' + request.url);
        }
    });

    soap.listen(server, '/soap', service, wsdl);

    server.listen(port, () => {
        console.log(`SOAP API is running at http://localhost:${port}/soap?wsdl`);
    });
};

module.exports = soapServer;