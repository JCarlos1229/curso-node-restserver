const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearCategoria,
  obtenerCategorias,
  actualizarCategoria,
  obtenerCategoria,
  borrarCategoria,
} = require("../controllers/categorias");
const { existeCategoriaPorId } = require("../helpers/db-validators");
const { validarJWT, validarCampos, isAdminRole } = require("../middlewares");

const router = Router();

//Obtener todas las categorias - publico
router.get("/", obtenerCategorias);

//Obtener una categoria por id - publico
router.get(
  "/:id",
  [
    check("id", "No es un ID Valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  obtenerCategoria
);

//Crear categoria - privado (cualquier persona con token valido)
router.post(
  "/",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  crearCategoria
);

//Actualizar - privado (cualquiera con un token valido)
router.put(
  "/:id",
  [
    validarJWT,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("id", "El ID no es valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  actualizarCategoria
);

//Borrar una categoria - Admin
router.delete(
  "/:id",
  [
    validarJWT,
    isAdminRole,
    check("id", "No es un ID Valido").isMongoId(),
    check("id").custom(existeCategoriaPorId),
    validarCampos,
  ],
  borrarCategoria
);

module.exports = router;
