const express = require('express');
const validate = require('express-validation');
const validator = require('./validation');
const controller = require('./controller');

const authenticationClient = require('kopitech-authentication-client');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(
    authenticationClient.expressAuthenticate,
    validate(validator.listClients),
    controller.listClients,
  )
  .post(
    authenticationClient.expressAuthenticate,
    validate(validator.createClient),
    controller.createClient,
  );

router.route('/search')
  .post(
    authenticationClient.expressAuthenticate,
    validate(validator.searchClients),
    controller.searchClients,
  );

router.route('/authenticate')
  .post(
    authenticationClient.expressAuthenticate,
    validate(validator.authenticateClient),
    controller.authenticateClient,
  );

router.route('/:clientId/reset')
  .put(
    authenticationClient.expressAuthenticate,
    validate(validator.resetSecret),
    controller.resetSecret,
  );

router.route('/:clientId')
  .get(
    authenticationClient.expressAuthenticate,
    validate(validator.getClient),
    controller.getClient,
  )
  .delete(
    authenticationClient.expressAuthenticate,
    validate(validator.deleteClient),
    controller.deleteClient,
  );

module.exports = router;
