import {Schema, model} from "mongoose";

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
});

const User = new model("User", userSchema);

export default User;