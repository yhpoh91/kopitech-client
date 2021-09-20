const express = require('express');
const validate = require('express-validation');
const validator = require('./validation');
const controller = require('./controller');

const authenticator = require('../../services/authenticator');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(
    authenticator.authenticate,
    validate(validator.listClients),
    controller.listClients,
  )
  .post(
    authenticator.authenticate,
    validate(validator.createClient),
    controller.createClient,
  );

router.route('/search')
  .post(
    authenticator.authenticate,
    validate(validator.searchClients),
    controller.searchClients,
  );

router.route('/authenticate')
  .post(
    authenticator.authenticate,
    validate(validator.authenticateClient),
    controller.authenticateClient,
  );

router.route('/:clientId/reset')
  .put(
    authenticator.authenticate,
    validate(validator.resetSecret),
    controller.resetSecret,
  );

router.route('/:clientId')
  .get(
    authenticator.authenticate,
    validate(validator.getClient),
    controller.getClient,
  )
  .delete(
    authenticator.authenticate,
    validate(validator.deleteClient),
    controller.deleteClient,
  );

module.exports = router;
