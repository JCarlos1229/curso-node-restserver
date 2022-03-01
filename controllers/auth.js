const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { generarJWT } = require("../helpers/generar-jwt");

const login = async (req = request, res = response) => {
  const { correo, password } = req.body;

  try {
    //Verificar si el correo existe
    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "correo ó password  incorrectos - correo",
      });
    }

    //Si el usuario está activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "correo ó password  incorrectos - estado: false",
      });
    }

    //Verificar la contraseña

    const validPass = bcryptjs.compareSync(password, usuario.password);
    if (!validPass) {
      return res.status(400).json({
        msg: "correo ó password  incorrectos - password",
      });
    }

    //Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      msg: "Login ok",
      usuario,
      token,
    });
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

module.exports = {
  login,
};
