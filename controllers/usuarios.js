const { response } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req, res = response) => {
  // const { id, nombre = "No name", limit, page = 1 } = req.query;
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  // const usuarios = await Usuario.find(query).skip(desde).limit(limite);
  // const total = await Usuario.countDocuments(query);

  //Hacemos una destructuracion de array
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(desde).limit(limite),
  ]);

  res.json({ total, usuarios });
};

const usuariosPost = async (req, res = response) => {
  const { nombre, correo, password, rol } = req.body;
  const usuario = new Usuario({ nombre, correo, password, rol });

  //Encriptar la contraseña
  const salt = bcrypt.genSaltSync();
  usuario.password = bcrypt.hashSync(password, salt);

  //Guardar en DB
  await usuario.save();
  res.json({
    msg: "post api - controlador",
    usuario,
  });
};

const usuariosPut = async (req, res = response) => {
  const { id } = req.params;
  const { _id, password, google, correo, ...resto } = req.body;

  //TODO Validar contra base de datos
  if (password) {
    //Encriptar la contraseña
    const salt = bcrypt.genSaltSync();
    resto.password = bcrypt.hashSync(password, salt);
  }

  const usuario = await Usuario.findByIdAndUpdate(id, resto);

  res.json({ usuario });
};

const usuariosPatch = (req, res = response) => {
  res.json({
    msg: "patch api - controlador",
  });
};

const usuariosDelete = async (req, res = response) => {
  const { id } = req.params;

  const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });
  const usuarioAutenticado = req.usuario;
  res.json({
    usuario,
  });
};

module.exports = {
  usuariosGet,
  usuariosPost,
  usuariosPut,
  usuariosDelete,
  usuariosPatch,
};
