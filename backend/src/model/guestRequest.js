import {Schema, model} from "mongoose";

const guestRequestSchema = new Schema({
    requestedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestedAt: {
        type: Date,
        default: Date.now,
    },
    to: {
        hod: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        warden: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        messManager: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        }
    },
    approvals: {
        hod: {
            approved: {type: Boolean, default: false},
            approvedAt: Date
        },
        principal: {
            approved: {type: Boolean, default: false},
            approvedAt: Date
        },
        warden: {
            approved: {type: Boolean, default: false},
            approvedAt: Date
        },
        messManager: {
            approved: {type: Boolean, default: false},
            approvedAt: Date
        }
    },
    rejects: {
        rejected: {
            type: Boolean,
            default: false,
        },
        by: {
            type: Schema.Types.ObjectId, 
            ref: "User"
        },
        at: Date,
        reason: String,
    },
    reasonOfArrival: {
        type: String,
    },
    visibility: {
        coordinator: {type: Boolean, default: true},
        hod: {type: Boolean, default: true},
        principal: {type: Boolean, default: true},
        warden: {type: Boolean, default: true},
        messManager: {type: Boolean, default: true},
    }    
});

const GuestRequest = new model("GuestRequest", guestRequestSchema);

export default GuestRequest;