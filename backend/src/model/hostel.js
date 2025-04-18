import {Schema, model} from "mongoose";

const hostelSchema = new Schema({
    guest_id: {
        type: Schema.Types.ObjectId,
        ref: "Guest",
    },
    allocatedBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    allocatedDate: {
        type: Date,
        default: Date.now,
    },
    roomNo: {
        type: Number,
    },
    block: {
        type: String,
    }
});

const Hostel = new model("Hostel", hostelSchema);

export default Hostel;