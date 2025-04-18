import express from "express";
const router = express.Router();
import { getAllHods, getAllWardens, getAllMessManagers, getAllRequests } from "../control/dataController.js";
import { authorizeUser } from "../middlewares/authorization.js";

router.route("/all-hods")
.get(authorizeUser, (req, res) => getAllHods(req, res));

router.route("/all-wardens")
.get(authorizeUser, (req, res) => getAllWardens(req, res));

router.route("/all-messManagers")
.get(authorizeUser, (req, res) => getAllMessManagers(req, res));

router.route("/all-requests")
.get(authorizeUser, (req, res) => getAllRequests(req, res));

export default router;