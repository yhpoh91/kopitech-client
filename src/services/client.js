const { v4: uuid } = require('uuid');
const { Op } = require('sequelize');

const { Client } = require('./database');
const { L } = require('./logger')('Client Service');


const mapClient = (rawClient, removeSensitive = true) => {
  if (rawClient == null) {
    return null;
  }

  const client = rawClient.dataValues;

  if (removeSensitive) {
    delete client.secret;
  }
  return client;
};



const listClients = async (criteria, limit = 30, offset = 0, excludeDeleted = true, removeSensitive = true) => {
  try {
    const { clientIds, name, secret } = criteria;

    const query = {
      where: {},
      limit,
      offset,
    };

    if (clientIds) {
      query.where.id = clientIds;
    }

    if (name) {
      query.where.name = name;
    }

    if (secret) {
      query.where.secret = secret;
    }

    if (excludeDeleted) {
      query.where.deleted = 0;
    }

    const rawClients = await Client.findAll(query);
    const mappedClients = (rawClients || []).map(rawClient => mapClient(rawClient, removeSensitive));
    return Promise.resolve(mappedClients);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getClient = async (clientId, excludeDeleted = true, removeSensitive = true) => {
  try {
    const query = {
      where: {
        id: clientId,
      },
    };

    if (excludeDeleted) {
      query.where.deleted = 0;
    }

    const rawClient = await Client.findOne(query);
    const mappedClient = mapClient(rawClient, removeSensitive);
    return Promise.resolve(mappedClient);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createClient = async (clientId, clientSecret, name) => {
  try {
    const rawClient = await Client.create({
      id: clientId,
      name,
      secret: clientSecret,
      deleted: 0,
    });

    const mappedClient = mapClient(rawClient, true);
    return Promise.resolve(mappedClient);
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateSecret = async (clientId, requestedChanges, excludeDeleted = true) => {
  try {
    const query = {
      where: {
        id: clientId,
      },
      fields: [],
      returning: true,
    };

    if (excludeDeleted) {
      query.where.deleted = 0;
    }

    const changes = {};

    if (requestedChanges.secret != null) {
      changes.secret = requestedChanges.secret;
      query.fields.push('secret');
    }

    const updateResult = await Client.update(changes, query);
    return Promise.resolve(updateResult);
  } catch (error) {
    return Promise.reject(error);
  }
}

const deleteClient = async (clientId, excludeDeleted = true) => {
  try {
    const query = {
      where: {
        id: clientId,
      },
      returning: true,
    };

    if (excludeDeleted) {
      query.where.deleted = 0;
    }

    const changes = {
      deleted: Math.floor(new Date().getTime() / 1000),
    }

    const updateResult = await Client.update(changes, query);
    return Promise.resolve(updateResult);
  } catch (error) {
    return Promise.reject(error);
  }
}

module.exports = {
  listClients,
  createClient,
  getClient,
  updateSecret,
  deleteClient,
};
