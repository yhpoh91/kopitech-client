const { v4: uuid } = require('uuid');

const { L } = require('../../services/logger')('Client Router');
const clientService = require('../../services/client');

const listClients = async (req, res, next) => {
  try {
    const { limit, offset } = req.query;
    const criteria = {};
    const clients = await clientService.listClients(criteria, limit, offset, true, true);
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const searchClients = async (req, res, next) => {
  try {
    const { limit, offset, criteria } = req.body;
    const clients = await clientService.listClients(criteria, limit, offset, true, true);
    res.status(200).json(clients);
  } catch (error) {
    next(error);
  }
};

const authenticateClient = async (req, res, next) => {
  try {
    const { clientId, clientSecret } = req.body;
    const criteria = {
      id: clientId,
      secret: clientSecret,
    };
    const clients = await clientService.listClients(criteria, 30, 0, true, false);

    if (clients == null) {
      L.error(`Null client list when login`);
      res.json({ authenticated: false });
      return;
    }

    if (clients.length <= 0) {
      L.warn(`Empty client list when login`);
      res.json({ authenticated: false });
      return;
    }

    if (clients.length > 1) {
      L.warn(`More than one active client with clientname "${clientname}!"`);
    }

    const client = clients[0];
    const safeClient = await clientService.getClient(clientId, true, true);
    res.json({ authenticated: true, client: safeClient });
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const { name } = req.body;
    const clientId = uuid();
    const clientSecret = uuid();

    const client = await clientService.createClient(clientId, clientSecret, name);
    res.status(201).json({ name, clientId, clientSecret });
  } catch (error) {
    next(error);
  }
};

const getClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const client = await clientService.getClient(clientId, true, true);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const resetSecret = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const clientSecret = uuid();
    await clientService.updateSecret(clientId, { secret: clientSecret }, true);

    // Get Updated Client
    const client = await clientService.getClient(clientId, true, false);
    res.status(200).json(client);
  } catch (error) {
    next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    await clientService.deleteClient(clientId, true);
    res.status(200).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listClients,
  searchClients,
  authenticateClient,

  createClient,
  getClient,
  resetSecret,
  deleteClient,
};
