const express = require('express');

const clientRouter = require('./client');

const { L } = require('kopitech-logger')('Global Router');

const router = express.Router({ mergeParams: true });

router.get('/', (_, res) => res.send('Server is online'));
router.use('/clients', clientRouter);


module.exports = router;
