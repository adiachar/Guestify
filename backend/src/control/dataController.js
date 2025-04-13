import User from "../model/user.js";
import Guest from "../model/guest.js";
import GuestRequest from "../model/guestRequest.js";

export const getAllHods = async (req, res) => {
    
    try {
        let allHods = await User.find({type: "hod"});  

        if(!allHods) {
            return res.status(404).json({message: "No Hod's Registered!"})
        }

        return res.status(200).json({allHods: allHods});

    } catch(err) { 
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const getAllRequests = async (req, res) => {
    try {
        let allRequests = await GuestRequest.find({to_id: req.user._id}).lean();

        allRequests = allRequests.map(async (req) => {
            let guest = await Guest.find({guestRequest_id: req._id}).lean();
            return {...req, guest};
        });

        return res.status(200).json({allRequests: allRequests});

    } catch(err) {
        return res.status(500).json({message: "Internal Server Error!"});
    }
}