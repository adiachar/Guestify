import express from "express";
const router = express.Router();
import {addGuestRequest} from "../control/requestController.js";
import { authorizeUser } from "../middlewares/authorization.js";

//Guest Request
router.route("/guest-request")
.post( authorizeUser, (req, res) => addGuestRequest(req, res));


export default router;