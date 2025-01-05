document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi Modal Materialize
    const modalElems = document.querySelectorAll('.modal');
    const modalInstances = M.Modal.init(modalElems);

    // Seleksi Elemen DOM
    const mahasiswaTableBody = document.querySelector('#mahasiswaTable tbody');
    const mataKuliahTableBody = document.querySelector('#mataKuliahTable tbody');
    const addMahasiswaBtn = document.getElementById('addMahasiswaBtn');
    const addMataKuliahBtn = document.getElementById('addMataKuliahBtn');
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const modalSaveBtn = document.getElementById('modalSaveBtn');

    // Modal untuk Menampilkan Mata Kuliah
    const modalMataKuliah = document.getElementById('modalMataKuliah');
    const modalTitleMataKuliah = document.getElementById('modalTitleMataKuliah');
    const mataKuliahList = document.getElementById('mataKuliahList');

    // REST API URL relatif karena frontend disajikan dari server yang sama
    const REST_API_URL = '/api';

    let daftarMataKuliah = []; // Cache daftar mata kuliah

    // Fetch dan tampilkan data Mahasiswa
    const fetchMahasiswa = async () => {
        try {
            const response = await fetch(`${REST_API_URL}/mahasiswa`);
            if (!response.ok) {
                throw new Error('Gagal mengambil data mahasiswa');
            }
            const data = await response.json();
            mahasiswaTableBody.innerHTML = '';
            data.forEach(mahasiswa => {
                const tr = document.createElement('tr');
                tr.dataset.nim = mahasiswa.nim; // Simpan NIM di dataset untuk klik event
                tr.innerHTML = `
                    <td>${mahasiswa.nim}</td>
                    <td>${mahasiswa.nama}</td>
                    <td>${mahasiswa.alamat}</td>
                    <td>
                        <a class="btn-small waves-effect waves-light blue editMahasiswaBtn" data-nim="${mahasiswa.nim}">
                            <i class="material-icons">edit</i>
                        </a>
                        <a class="btn-small waves-effect waves-light red deleteMahasiswaBtn" data-nim="${mahasiswa.nim}">
                            <i class="material-icons">delete</i>
                        </a>
                    </td>
                `;
                mahasiswaTableBody.appendChild(tr);
            });
        } catch (error) {
            M.toast({ html: error.message, classes: 'red' });
            console.error(error);
        }
    };

    // Fetch dan tampilkan daftar Mata Kuliah mahasiswa
    const fetchMataKuliahMahasiswa = async (nim) => {
        try {
            const response = await fetch(`${REST_API_URL}/mahasiswa/${nim}`);
            if (!response.ok) {
                throw new Error('Gagal mengambil data mata kuliah mahasiswa');
            }
            const mahasiswa = await response.json();
            modalTitleMataKuliah.textContent = `Mata Kuliah yang Diambil: ${mahasiswa.nama}`;
            mataKuliahList.innerHTML = '';

            if (mahasiswa.mata_kuliah && mahasiswa.mata_kuliah.length > 0) {
                mahasiswa.mata_kuliah.forEach(mk => {
                    const li = document.createElement('li');
                    li.classList.add('collection-item');
                    li.textContent = `${mk.nama_mata_kuliah} (${mk.sks} SKS)`;
                    mataKuliahList.appendChild(li);
                });
            } else {
                const li = document.createElement('li');
                li.classList.add('collection-item');
                li.textContent = 'Tidak ada mata kuliah yang diambil.';
                mataKuliahList.appendChild(li);
            }

            const modalInstance = M.Modal.getInstance(modalMataKuliah);
            modalInstance.open();
        } catch (error) {
            M.toast({ html: error.message, classes: 'red' });
            console.error(error);
        }
    };

    // Fetch dan tampilkan data Mata Kuliah
    const fetchMataKuliah = async () => {
        try {
            const response = await fetch(`${REST_API_URL}/mata_kuliah`);
            if (!response.ok) {
                throw new Error('Gagal mengambil data mata kuliah');
            }
            const data = await response.json();
            daftarMataKuliah = data; // Simpan di cache
            mataKuliahTableBody.innerHTML = '';
            data.forEach(mk => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${mk.kode_mata_kuliah}</td>
                    <td>${mk.nama_mata_kuliah}</td>
                    <td>${mk.sks}</td>
                    <td>
                        <a class="btn-small waves-effect waves-light blue editMataKuliahBtn" data-kode="${mk.kode_mata_kuliah}">
                            <i class="material-icons">edit</i>
                        </a>
                        <a class="btn-small waves-effect waves-light red deleteMataKuliahBtn" data-kode="${mk.kode_mata_kuliah}">
                            <i class="material-icons">delete</i>
                        </a>
                    </td>
                `;
                mataKuliahTableBody.appendChild(tr);
            });
        } catch (error) {
            M.toast({ html: error.message, classes: 'red' });
            console.error(error);
        }
    };

    // Render Checkbox Mata Kuliah
    const renderCheckboxMataKuliah = (selectedMataKuliah = []) => {
        return daftarMataKuliah.map(mk => `
            <p>
                <label>
                    <input type="checkbox" class="filled-in" value="${mk.kode_mata_kuliah}" ${selectedMataKuliah.includes(mk.kode_mata_kuliah) ? 'checked' : ''}/>
                    <span>${mk.nama_mata_kuliah} (${mk.sks} SKS)</span>
                </label>
            </p>
        `).join('');
    };

    // Tambah Mahasiswa
    addMahasiswaBtn.addEventListener('click', async () => {
        try {
            // Pastikan daftar mata kuliah sudah dimuat
            if (daftarMataKuliah.length === 0) {
                await fetchMataKuliah();
            }

            modalTitle.textContent = 'Tambah Mahasiswa';
            modalContent.innerHTML = `
                <div class="input-field">
                    <input id="nim" type="text" required>
                    <label for="nim">NIM</label>
                </div>
                <div class="input-field">
                    <input id="nama" type="text" required>
                    <label for="nama">Nama</label>
                </div>
                <div class="input-field">
                    <input id="alamat" type="text" required>
                    <label for="alamat">Alamat</label>
                </div>
                <div class="input-field">
                    <p>Mata Kuliah yang Diambil:</p>
                    ${renderCheckboxMataKuliah()}
                </div>
            `;
            // Re-initialize Materialize components
            M.updateTextFields();
            // Open Modal
            const modalInstance = M.Modal.getInstance(modal);
            modalInstance.open();
        } catch (error) {
            M.toast({ html: 'Gagal menampilkan form tambah mahasiswa', classes: 'red' });
            console.error(error);
        }
    });

    // Tambah Mata Kuliah
    addMataKuliahBtn.addEventListener('click', () => {
        modalTitle.textContent = 'Tambah Mata Kuliah';
        modalContent.innerHTML = `
            <div class="input-field">
                <input id="kode_mata_kuliah" type="text" required>
                <label for="kode_mata_kuliah">Kode Mata Kuliah</label>
            </div>
            <div class="input-field">
                <input id="nama_mata_kuliah" type="text" required>
                <label for="nama_mata_kuliah">Nama Mata Kuliah</label>
            </div>
            <div class="input-field">
                <input id="sks" type="number" required>
                <label for="sks">SKS</label>
            </div>
        `;
        // Re-initialize Materialize components
        M.updateTextFields();
        // Open Modal
        const modalInstance = M.Modal.getInstance(modal);
        modalInstance.open();
    });

    // Save Modal
    modalSaveBtn.addEventListener('click', async () => {
        const title = modalTitle.textContent;
        if (title === 'Tambah Mahasiswa' || title === 'Edit Mahasiswa') {
            const nimInput = document.getElementById('nim');
            const nama = document.getElementById('nama').value.trim();
            const alamat = document.getElementById('alamat').value.trim();
            const selectedMataKuliah = Array.from(document.querySelectorAll('#modalContent input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);

            if (title === 'Tambah Mahasiswa') {
                const nim = nimInput.value.trim();
                if (!nim || !nama || !alamat) {
                    M.toast({ html: 'Semua field harus diisi', classes: 'red' });
                    return;
                }

                try {
                    const response = await fetch(`${REST_API_URL}/mahasiswa`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nim, nama, alamat, mata_kuliah: selectedMataKuliah })
                    });
                    const result = await response.json();
                    if (response.ok) {
                        M.toast({ html: result.message, classes: 'green' });
                        fetchMahasiswa();
                        const modalInstance = M.Modal.getInstance(modal);
                        modalInstance.close();
                    } else {
                        M.toast({ html: result.message, classes: 'red' });
                    }
                } catch (error) {
                    M.toast({ html: 'Gagal menambahkan mahasiswa', classes: 'red' });
                    console.error(error);
                }
            } else if (title === 'Edit Mahasiswa') {
                const nim = document.getElementById('edit_nim').value.trim();
                if (!nama || !alamat) {
                    M.toast({ html: 'Semua field harus diisi', classes: 'red' });
                    return;
                }

                try {
                    const response = await fetch(`${REST_API_URL}/mahasiswa/${nim}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nama, alamat, mata_kuliah: selectedMataKuliah })
                    });
                    const result = await response.json();
                    if (response.ok) {
                        M.toast({ html: result.message, classes: 'green' });
                        fetchMahasiswa();
                        const modalInstance = M.Modal.getInstance(modal);
                        modalInstance.close();
                    } else {
                        M.toast({ html: result.message, classes: 'red' });
                    }
                } catch (error) {
                    M.toast({ html: 'Gagal memperbarui mahasiswa', classes: 'red' });
                    console.error(error);
                }
            }
        } else if (title === 'Tambah Mata Kuliah') {
            const kode_mata_kuliah = document.getElementById('kode_mata_kuliah').value.trim();
            const nama_mata_kuliah = document.getElementById('nama_mata_kuliah').value.trim();
            const sks = parseInt(document.getElementById('sks').value.trim());

            if (!kode_mata_kuliah || !nama_mata_kuliah || isNaN(sks)) {
                M.toast({ html: 'Semua field harus diisi dengan benar', classes: 'red' });
                return;
            }

            try {
                const response = await fetch(`${REST_API_URL}/mata_kuliah`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ kode_mata_kuliah, nama_mata_kuliah, sks })
                });
                const result = await response.json();
                if (response.ok) {
                    M.toast({ html: result.message, classes: 'green' });
                    fetchMataKuliah();
                    fetchMahasiswa();
                    const modalInstance = M.Modal.getInstance(modal);
                    modalInstance.close();
                } else {
                    M.toast({ html: result.message, classes: 'red' });
                }
            } catch (error) {
                M.toast({ html: 'Gagal menambahkan mata kuliah', classes: 'red' });
                console.error(error);
            }
        }
    });

    // Delegasi Event untuk Edit dan Delete Mahasiswa
    mahasiswaTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.editMahasiswaBtn')) {
            const nim = e.target.closest('.editMahasiswaBtn').dataset.nim;
            editMahasiswa(nim);
        } else if (e.target.closest('.deleteMahasiswaBtn')) {
            const nim = e.target.closest('.deleteMahasiswaBtn').dataset.nim;
            deleteMahasiswa(nim);
        } else {
            // Klik pada baris tabel untuk membuka modal mata kuliah
            const tr = e.target.closest('tr');
            if (tr && tr.dataset.nim) {
                fetchMataKuliahMahasiswa(tr.dataset.nim);
            }
        }
    });

    // Delegasi Event untuk Edit dan Delete Mata Kuliah
    mataKuliahTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.editMataKuliahBtn')) {
            const kode = e.target.closest('.editMataKuliahBtn').dataset.kode;
            editMataKuliah(kode);
        } else if (e.target.closest('.deleteMataKuliahBtn')) {
            const kode = e.target.closest('.deleteMataKuliahBtn').dataset.kode;
            deleteMataKuliah(kode);
        }
    });

    // Edit Mahasiswa
    const editMahasiswa = async (nim) => {
        try {
            const response = await fetch(`${REST_API_URL}/mahasiswa/${nim}`);
            if (!response.ok) {
                throw new Error('Gagal mengambil data mahasiswa');
            }
            const mahasiswa = await response.json();
            modalTitle.textContent = 'Edit Mahasiswa';
            modalContent.innerHTML = `
                <div class="input-field">
                    <input id="edit_nim" type="text" value="${mahasiswa.nim}" disabled>
                    <label for="edit_nim">NIM</label>
                </div>
                <div class="input-field">
                    <input id="nama" type="text" value="${mahasiswa.nama}" required>
                    <label class="active" for="nama">Nama</label>
                </div>
                <div class="input-field">
                    <input id="alamat" type="text" value="${mahasiswa.alamat}" required>
                    <label class="active" for="alamat">Alamat</label>
                </div>
                <div class="input-field">
                    <p>Mata Kuliah yang Diambil:</p>
                    ${renderCheckboxMataKuliah(mahasiswa.mata_kuliah.map(mk => mk.kode_mata_kuliah))}
                </div>
            `;
            // Re-initialize Materialize components
            M.updateTextFields();
            // Open Modal
            const modalInstance = M.Modal.getInstance(modal);
            modalInstance.open();
        } catch (error) {
            M.toast({ html: error.message, classes: 'red' });
            console.error(error);
        }
    };

    // Delete Mahasiswa
    const deleteMahasiswa = (nim) => {
        if (confirm('Apakah Anda yakin ingin menghapus mahasiswa ini?')) {
            fetch(`${REST_API_URL}/mahasiswa/${nim}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    M.toast({ html: data.message, classes: 'green' });
                    fetchMahasiswa();
                }
            })
            .catch(error => {
                M.toast({ html: 'Gagal menghapus mahasiswa', classes: 'red' });
                console.error(error);
            });
        }
    };

    // Edit Mata Kuliah
    const editMataKuliah = async (kode) => {
        try {
            const response = await fetch(`${REST_API_URL}/mata_kuliah/${kode}`);
            if (!response.ok) {
                throw new Error('Gagal mengambil data mata kuliah');
            }
            const mataKuliah = await response.json();
            modalTitle.textContent = 'Edit Mata Kuliah';
            modalContent.innerHTML = `
                <div class="input-field">
                    <input id="edit_kode_mata_kuliah" type="text" value="${mataKuliah.kode_mata_kuliah}" disabled>
                    <label for="edit_kode_mata_kuliah">Kode Mata Kuliah</label>
                </div>
                <div class="input-field">
                    <input id="nama_mata_kuliah" type="text" value="${mataKuliah.nama_mata_kuliah}" required>
                    <label class="active" for="nama_mata_kuliah">Nama Mata Kuliah</label>
                </div>
                <div class="input-field">
                    <input id="sks" type="number" value="${mataKuliah.sks}" required>
                    <label class="active" for="sks">SKS</label>
                </div>
            `;
            // Re-initialize Materialize components
            M.updateTextFields();
            // Open Modal
            const modalInstance = M.Modal.getInstance(modal);
            modalInstance.open();

            // Handle Save for Edit Mata Kuliah
            modalSaveBtn.onclick = async () => {
                const nama_mata_kuliah = document.getElementById('nama_mata_kuliah').value.trim();
                const sks = parseInt(document.getElementById('sks').value.trim());

                if (!nama_mata_kuliah || isNaN(sks)) {
                    M.toast({ html: 'Semua field harus diisi dengan benar', classes: 'red' });
                    return;
                }

                try {
                    const response = await fetch(`${REST_API_URL}/mata_kuliah/${kode}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ nama_mata_kuliah, sks })
                    });
                    const result = await response.json();
                    if (response.ok) {
                        M.toast({ html: result.message, classes: 'green' });
                        fetchMataKuliah();
                        fetchMahasiswa(); // Update mata kuliah di mahasiswa
                        const modalInstance = M.Modal.getInstance(modal);
                        modalInstance.close();
                    } else {
                        M.toast({ html: result.message, classes: 'red' });
                    }
                } catch (error) {
                    M.toast({ html: 'Gagal memperbarui mata kuliah', classes: 'red' });
                    console.error(error);
                }
            };
        } catch (error) {
            M.toast({ html: error.message, classes: 'red' });
            console.error(error);
        }
    };

    // Delete Mata Kuliah
    const deleteMataKuliah = (kode) => {
        if (confirm('Apakah Anda yakin ingin menghapus mata kuliah ini?')) {
            fetch(`${REST_API_URL}/mata_kuliah/${kode}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    M.toast({ html: data.message, classes: 'green' });
                    fetchMataKuliah();
                    fetchMahasiswa(); // Update mata kuliah di mahasiswa
                }
            })
            .catch(error => {
                M.toast({ html: 'Gagal menghapus mata kuliah', classes: 'red' });
                console.error(error);
            });
        }
    };

    // Delegasi Event untuk Edit dan Delete Mahasiswa
    mahasiswaTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.editMahasiswaBtn')) {
            const nim = e.target.closest('.editMahasiswaBtn').dataset.nim;
            editMahasiswa(nim);
        } else if (e.target.closest('.deleteMahasiswaBtn')) {
            const nim = e.target.closest('.deleteMahasiswaBtn').dataset.nim;
            deleteMahasiswa(nim);
        } else {
            // Klik pada baris tabel untuk membuka modal mata kuliah
            const tr = e.target.closest('tr');
            if (tr && tr.dataset.nim) {
                fetchMataKuliahMahasiswa(tr.dataset.nim);
            }
        }
    });

    // Delegasi Event untuk Edit dan Delete Mata Kuliah
    mataKuliahTableBody.addEventListener('click', (e) => {
        if (e.target.closest('.editMataKuliahBtn')) {
            const kode = e.target.closest('.editMataKuliahBtn').dataset.kode;
            editMataKuliah(kode);
        } else if (e.target.closest('.deleteMataKuliahBtn')) {
            const kode = e.target.closest('.deleteMataKuliahBtn').dataset.kode;
            deleteMataKuliah(kode);
        }
    });

    // Fetch data mahasiswa dan mata kuliah saat halaman dimuat
    fetchMahasiswa();
    fetchMataKuliah();
});
