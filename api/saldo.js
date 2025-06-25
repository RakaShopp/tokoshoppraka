const express = require('express');
const multer = require('multer');
const authMiddleware = require('./authMiddleware');
const Transaction = require('../models/transaction');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/topup', authMiddleware, upload.single('bukti'), async (req, res) => {
  try {
    const userId = req.user.userId;
    const { amount } = req.body;
    const bukti = req.file ? req.file.filename : null;

    const transaction = new Transaction({
      userId,
      type: 'topup',
      amount,
      status: 'pending',
      productName: 'Top Up Saldo Manual',
      bukti
    });

    await transaction.save();
    res.json({ message: 'Top up berhasil dikirim' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal memproses top up' });
  }
});

module.exports = router;
