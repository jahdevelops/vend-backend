const express = require('express');
const router = express.Router();

const {
    getAllUsersTransaction,
    getTotalRevenue
} = require('../../controller/Admin/transaction.controller')

router.route('/').get(getAllUsersTransaction);

module.exports = router;