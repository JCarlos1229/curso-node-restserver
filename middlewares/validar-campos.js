const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  //next es lo que se llama si este middleware pasa
  next();
};

module.exports = {
  validarCampos,
};
