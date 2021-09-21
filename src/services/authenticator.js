const axios = require('axios');
const jsonwebtoken = require('jsonwebtoken');

const { L } = require('./logger')('Authenticator');


const authenticationEnabled = (process.env.AUTHENTICATION_ENABLED || 'true').toLowerCase() === 'true';
const earlyTokenRefreshSeconds = parseInt(process.env.SELF_TOKEN_EARLY_REFRESH_SECONDS || '30', 10);
const selfClientId = process.env.CLIENT_ID;
const selfClientSecret = process.env.CLIENT_SECRET;
const authenticatorLoginServiceUrl = process.env.AUTHENTICATOR_SERVICE_LOGIN_SERVICE_URL;
const authenticatorVerifyUrl = process.env.AUTHENTICATOR_SERVICE_VERIFY_URL;

let currentSelfToken;
let currentSelfTokenExp = 0;

const getServiceToken = async () => {
  try {
    const now = Math.floor(new Date().getTime() / 1000);
    if (currentSelfToken == null || currentSelfTokenExp < now) {
      const body = {
        clientId: selfClientId,
        clientSecret: selfClientSecret,
      };
      const response = await axios.post(authenticatorLoginServiceUrl, body);
      const { data } = response;
      const token = data.access_token;

      const payload = jsonwebtoken.decode(token);

      // Save Current Token
      currentSelfToken = token;
      currentSelfTokenExp = payload.exp - earlyTokenRefreshSeconds;
    }

    return Promise.resolve(currentSelfToken);
  } catch (error) {
    return Promise.reject(error);
  }
}

const getConfig = async () => {
  try {
    const token = await getServiceToken();
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    };
    return Promise.resolve(config);
  } catch (error) {
    return Promise.reject(error);
  }
}

const validateToken = async (accessToken) => {
  try {
    const url = authenticatorVerifyUrl;
    const body = { accessToken };
    const config = await getConfig();

    const response = await axios.post(url, body, config);
    const { data } = response;
    return Promise.resolve(data);
  } catch (error) {
    return Promise.reject(error);
  }
}

const authenticate = async (req, res, next) => {
  try {
    let token;

    // Ensure authorization header is present
    if (authenticationEnabled) {
      const authorizationHeader = req.headers['authorization'];
      if (authorizationHeader == null) {
        res.status(401).send('invalid authorization header');
        return;
      }

      const prefix = 'Bearer ';
      if (authorizationHeader.indexOf(prefix) < 0) {
        res.status(401).send('invalid authorization header');
        return;
      }

      token = authorizationHeader.slice(prefix.length);
    }


    // Validate Token
    let hasAccess = !authenticationEnabled;
    if (!hasAccess) {
      const { ok: isValidated, payload } = await validateToken(token);
      if (isValidated && payload) {
        const { sub, typ } = payload;

        hasAccess = true;
        req.accessor = payload;
      }
    }
    


    if (!hasAccess) {
      res.status(401).send('unauthorized');
      return;
    }

    next();
  } catch (error) {
    L.error(error.message); 
    res.status(401).send('unauthorized');
  }
};

module.exports = {
  authenticate,
};
