import express from "express";
const router = express.Router();
import { getAllHods, getAllRequests } from "../control/dataController.js";
import { authorizeUser } from "../middlewares/authorization.js";

router.route("/all-hods")
.get( authorizeUser, (req, res) => getAllHods(req, res));

router.route("/all-requests")
.get(authorizeUser, (req, res) => getAllRequests(req, res));

export default router;