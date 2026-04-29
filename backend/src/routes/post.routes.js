import express from "express";
import UploadServices from "../core/middleware/upload.services.js";
import Token from "../core/middleware/Token.js";
import PostController from "../controllers/Post.controller.js";

const postController = new PostController();
const router = express.Router(); //Generamos una instancia de las funcione de enrutamiento.

/**
 * @File - Archivo utilizado para administrar las rutas de usuarios.
 * @author Jose de Haro Jiménez.
 */

router.get("/info", postController.getDataInfo);
router.post("/Ilike", postController.insertLike);
router.delete("/Dlike", postController.deleteLike);
router.delete('/delete', postController.deletePost);
router.put('/update', postController.updatePost);
router.post(
  "/add",
  Token.validateToken,
  UploadServices.validateImg().single("img_post"),
  postController.addPost,
);
router.delete("/delete", Token.validateToken, postController.deletePost);
router.post(
  "/insertComment",
  Token.validateToken,
  postController.insertComment,
);
router.get("/getComment", Token.validateToken, postController.getComment);
router.delete(
  "/deleteComment",
  Token.validateToken,
  postController.deleteComment,
);

export default router;
