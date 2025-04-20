import User from "../model/user.js";
import Guest from "../model/guest.js";
import GuestRequest from "../model/guestRequest.js";
import Hostel from "../model/hostel.js";


export const getAllRequests = async (req, res) => {
    try {
        let guestRequests = [];

        if(req.user.type === "principal") {
            guestRequests = await GuestRequest.find({"approvals.hod.approved": true, [`visibility.${req.user.type}`]: true})
            .populate("requestedBy", "name department")
            .populate("rejects.by", "name department")
            .lean();

        } else if (req.user.type === "coordinator") {
            guestRequests = await GuestRequest.find({requestedBy: req.user._id, [`visibility.${req.user.type}`]: true})
            .populate("requestedBy", "name department")
            .populate("rejects.by", "name department")
            .lean();

        } else {
            guestRequests = await GuestRequest.find({[`to.${req.user.type}`]: req.user._id, [`visibility.${req.user.type}`]: true})
            .populate("requestedBy", "name department")
            .populate("rejects.by", "name department")
            .lean();
        }

        let allRequests = await Promise.all (guestRequests.map(async (req) => {
            let guests = await Guest.find({req_id: req._id}).lean();
            return {...req, guests};
        }));

        return res.status(200).json({allRequests: allRequests});

    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const getAllHods = async (req, res) => {
    
    try {
        let allHods = await User.find({type: "hod"}, "name");  

        if(!allHods) {
            return res.status(404).json({message: "No Hod's Registered!"})
        }

        return res.status(200).json({allHods: allHods});

    } catch(err) { 
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const getAllWardens = async (req, res) => {
    
    try {
        let allWardens = await User.find({type: "warden"}, "name");  

        if(!allWardens) {
            return res.status(404).json({message: "No Wardens's Registered!"})
        }

        return res.status(200).json({allWardens: allWardens});

    } catch(err) { 
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const getAllMessManagers = async (req, res) => {
    
    try {
        let allMessManagers = await User.find({type: "messManager"}, "name");  

        if(!allMessManagers) {
            return res.status(404).json({message: "No Mess Managers's Registered!"})
        }

        return res.status(200).json({allMessManagers: allMessManagers});

    } catch(err) { 
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const getGuestRequest = async (req, res) => {
    try {
        let {reqId} = req.params;
        let guestRequest = await GuestRequest.findById(reqId)
        .populate("requestedBy", "name department")
        .populate("to.hod", "name department")
        .populate("to.warden", "name department")
        .populate("to.messManager", "name department")
        .lean();

        let principal = await User.findOne({type: "principal"}, "name");
        let guests = await Guest.find({req_id: reqId});

        for(let guest of guests) {
            let hostel = await Hostel.find({guest_id: guest._id});
            guest.hostel = hostel;
        }

        guestRequest.guests = guests;
        guestRequest.to.principal = principal;

        return res.status(200).json({guestRequest: guestRequest});
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}