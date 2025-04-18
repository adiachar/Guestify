import {Schema, model} from "mongoose";

const guestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    info: String,
    isVegitarian: Boolean,
    foodTime: {
        breakfast: { type: Boolean, default: false},
        lunch: { type: Boolean, default: false},
        dinner: { type: Boolean, default: false}
    },
    arrivalDate: {type: Date, required: true},
    arrivalTime: {type: Date, required: true},
    leavingDate: {type: Date, required: true},
    
    req_id: {
        type: Schema.Types.ObjectId,
        ref: "GuestRequest",
        required: true,
    },
});

const Guest = new model("Guest", guestSchema);

export default Guest;