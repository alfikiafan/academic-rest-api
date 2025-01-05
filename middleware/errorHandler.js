const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Terjadi kesalahan di server', error: err.message });
};

module.exports = errorHandler;
