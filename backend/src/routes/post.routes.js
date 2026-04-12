import express from "express";
import UploadServices from "../core/middleware/upload.services.js";
import Token from "../core/middleware/Token.js";
import PostController from '../controllers/Post.controller.js';

const postController = new PostController();
const router = express.Router(); //Generamos una instancia de las funcione de enrutamiento.

/**
 * @File - Archivo utilizado para administrar las rutas de usuarios.
 * @author Jose de Haro Jiménez.
 */

router.get('/info', postController.getDataInfo);
router.post('/Ilike', postController.insertLike);
router.delete('/Dlike', postController.deleteLike);

export default router;
