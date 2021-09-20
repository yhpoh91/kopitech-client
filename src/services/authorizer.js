const { L } = require('./logger')('Authorizer');

const authorize = (allowedRoles = []) => async (req, res, next) => {
  try {
    // TODO: Validate Role
    let hasAccess = true;

    if (hasAccess) {
      next();
      return;
    }

    res.status(403).send('forbidden');
  } catch (error) {
    L.error(error.message);
    res.status(403).send('forbidden');
  }
};

module.exports = {
    authorize,
};
