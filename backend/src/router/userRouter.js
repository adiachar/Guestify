import express from "express";

import {authorizeUser} from "../middlewares/authorization.js";

import { signIn, signUp, authorize } from "../control/userController.js";

const router = express.Router();

router.route("/sign-up")
.post((req, res) => signUp(req, res));

router.route("/sign-in")
.post((req, res) => signIn(req, res));

router.route("/authorize-user")
.get(authorizeUser, (req, res) => authorize(req, res));

export default router;