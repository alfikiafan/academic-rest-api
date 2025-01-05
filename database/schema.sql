-- Buat Database
CREATE DATABASE IF NOT EXISTS akademik_db;
USE akademik_db;

-- Tabel Mahasiswa
CREATE TABLE IF NOT EXISTS mahasiswa (
    nim VARCHAR(20) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    alamat VARCHAR(255) NOT NULL
);

-- Tabel Mata Kuliah
CREATE TABLE IF NOT EXISTS mata_kuliah (
    kode_mata_kuliah VARCHAR(20) PRIMARY KEY,
    nama_mata_kuliah VARCHAR(100) NOT NULL,
    sks INT NOT NULL
);

-- Tabel Pivot Mahasiswa_Mata_Kuliah
CREATE TABLE IF NOT EXISTS mahasiswa_mata_kuliah (
    nim VARCHAR(20),
    kode_mata_kuliah VARCHAR(20),
    PRIMARY KEY (nim, kode_mata_kuliah),
    FOREIGN KEY (nim) REFERENCES mahasiswa(nim) ON DELETE CASCADE,
    FOREIGN KEY (kode_mata_kuliah) REFERENCES mata_kuliah(kode_mata_kuliah) ON DELETE CASCADE
);
