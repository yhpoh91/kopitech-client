const jsonwebtoken = require('jsonwebtoken');
const { L } = require('./logger')('Token Service');

const earlyTokenRefreshSeconds = parseInt(process.env.SELF_TOKEN_EARLY_REFRESH_SECONDS || '30', 10);
const selfClientId = process.env.CLIENT_ID;
const selfClientSecret = process.env.CLIENT_SECRET;
const authenticatorLoginServiceUrl = process.env.AUTHENTICATOR_SERVICE_LOGIN_SERVICE_URL;


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

module.exports = {
  getServiceToken,
};
