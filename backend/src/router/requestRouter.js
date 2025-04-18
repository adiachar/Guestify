import express from "express";
const router = express.Router();
import {addGuestRequest, approveGuestRequest, rejectGuestRequest, deleteRequestForMe, allotHostel} from "../control/requestController.js";
import { authorizeUser } from "../middlewares/authorization.js";

//Guest Request
router.route("/guest-request")
.post( authorizeUser, (req, res) => addGuestRequest(req, res));

//Approve Guest Request 
router.route("/approve/:reqId") 
.patch(authorizeUser, (req, res) => approveGuestRequest(req, res));

//Reject Guest Request 
router.route("/reject/:reqId") 
.patch(authorizeUser, (req, res) => rejectGuestRequest(req, res));

//Delete for me
router.route("/delete/:reqId")
.patch(authorizeUser, (req, res) => deleteRequestForMe(req, res));

//allot hostel
router.route("/allot-hostel") 
.post(authorizeUser, (req, res) => allotHostel(req, res));

export default router;