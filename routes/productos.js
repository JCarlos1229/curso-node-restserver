const { Router } = require("express");
const { check } = require("express-validator");
const {
  obtenerProducto,
  crearProducto,
  obtenerProductos,
  actualizarProducto,
  eliminarProducto,
} = require("../controllers/productos");
const {
  existeProductoPorId,
  existeCategoriaPorId,
} = require("../helpers/db-validators");
const { validarJWT, validarCampos, isAdminRole } = require("../middlewares");

const router = Router();

//Todos los productos paginados
router.get("/", obtenerProductos);

router.get(
  "/:id",
  [
    check("id", "El ID no es valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  obtenerProducto
);

router.put(
  "/:id",
  [
    validarJWT,
    check("id", "El ID no es valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    // check("categoria", "El ID no es valido").isMongoId(),
    // check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarProducto
);

//Crear productos
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("categoria", "El ID de categoria no es valido").isMongoId(),
    check("categoria").custom(existeCategoriaPorId),
    validarCampos,
  ],
  crearProducto
);

router.delete(
  "/:id",
  [
    validarJWT,
    isAdminRole,
    check("id", "El ID no es valido").isMongoId(),
    check("id").custom(existeProductoPorId),
    validarCampos,
  ],
  eliminarProducto
);

module.exports = router;
