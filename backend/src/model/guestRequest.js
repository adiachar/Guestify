import {Schema, model} from "mongoose";

const guestRequestSchema = new Schema({
    creator_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    to_id: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    status: {
        type: String,
        default: "NHNPNWNM",
        required: true
    },
    statusMsg: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    approvedAt: {
        hod: Date,
        principal: Date,
        warden: Date,
        messManager: Date,
    },
    reasonOfArrival: {
        type: String,
    },
    visibility: {
        type: String,
        default: "CHPWM"
    }    
});

const GuestRequest = new model("GuestRequest", guestRequestSchema);

export default GuestRequest;