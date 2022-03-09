const { request, response } = require("express");
const { Producto } = require("../models");

const crearProducto = async (req = request, res = response) => {
  const { nombre, categoria, precio, descripcion, disponible } = req.body;
  const nombreUpp = nombre.toUpperCase();

  const productoDB = await Producto.findOne({ nombre: nombreUpp });
  if (productoDB) {
    return res.status(400).json({
      msg: `El producto ${nombre}, ya existe`,
    });
  }

  const producto = new Producto({
    nombre: nombreUpp,
    precio,
    categoria,
    descripcion,
    disponible,
    usuario: req.usuario._id,
  });

  await producto.save();
  res.status(201).json(producto);
};

const obtenerProductos = async (req = request, res = response) => {
  const { limite = 5, desde = 0 } = req.query;
  const query = { estado: true };

  const [total, productos] = await Promise.all([
    Producto.countDocuments(query),
    Producto.find(query)
      .populate("usuario", "nombre")
      .populate("categoria", "nombre")
      .limit(limite)
      .skip(desde),
  ]);
  res.json({ total, productos });
};

const obtenerProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const producto = await Producto.findById(id)
    .populate("usuario", "nombre")
    .populate("categoria", "nombre");
  res.json({
    msg: producto,
  });
};

const actualizarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const { estado, usuario, ...data } = req.body;

  if (data.nombre) {
    data.nombre = data.nombre.toUpperCase();
  }
  data.usuario = req.usuario._id;

  const producto = await Producto.findByIdAndUpdate(id, data, { new: true });
  res.json({ producto });
};

const eliminarProducto = async (req = request, res = response) => {
  const { id } = req.params;
  const productoBorrado = await Producto.findByIdAndUpdate(
    id,
    { estado: false },
    { new: true }
  );
  res.json(productoBorrado);
};

module.exports = {
  obtenerProducto,
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
};
