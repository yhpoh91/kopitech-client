const joi = require('joi');

module.exports = {
  listClients: {
    query: {
      limit: joi.number().default(30).optional(),
      offset: joi.number().default(0).optional(),
    },
    params: {},
    body: {},
  },
  searchClients: {
    query: {},
    params: {},
    body: {
      limit: joi.number().default(30).optional(),
      offset: joi.number().default(0).optional(),


      criteria: joi.object({
        clientIds: joi.array().items(joi.string()).optional(),
      }).default({}).optional(),
    },
  },
  authenticateClient: {
    query: {},
    params: {},
    body: {
      clientId: joi.string().required(),
      clientSecret: joi.string().required(),
    },
  },
  createClient: {
    query: {},
    params: {},
    body: {},
  },
  getClient: {
    query: {},
    params: {
      clientId: joi.string().required(),
    },
    body: {},
  },
  resetSecret: {
    query: {},
    params: {
      clientId: joi.string().required(),
    },
    body: {},
  },
  deleteClient: {
    query: {},
    params: {
      clientId: joi.string().required(),
    },
    body: {},
  },
};
