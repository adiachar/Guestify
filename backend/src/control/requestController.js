import Guest from "../model/guest.js";
import GuestRequest from "../model/guestRequest.js";
import Hostel from "../model/hostel.js";

export const addGuestRequest = async (req, res) => {

    if(!req.body || !req.body.guest) {
        return res.status(404).json({message: "No Request Body!"});
    }

    try {
        let newGuestRequest = new GuestRequest({
            requestedBy: req.user._id,
            "to.hod": req.body.hodId,
            reasonOfArrival: req.body.reasonOfArrival,
        });
        
        await newGuestRequest.save();

        let guestList = req.body.guest;

        for(let guest of guestList) {
            guest.req_id = newGuestRequest._id;
            guest.arrivalDate = new Date(guest.arrivalDate);
            guest.arrivalTime = new Date(guest.arrivalTime);
            guest.leavingDate = new Date(guest.leavingDate);
        }

        let result = await Guest.insertMany(guestList);

        return res.status(200).json({message: "Request Created!"});

    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const approveGuestRequest = async (req, res) => {

    try {
        let {reqId} = req.params;

        let result1 = await GuestRequest.updateOne(
            {_id: reqId}, 
            {$set: 
                {
                    [`approvals.${req.user.type}.approved`]: true, 
                    [`approvals.${req.user.type}.approvedAt`]: new Date()
                }
            }
        );

        if(req.user.type === "principal") {
            let {wardenId, messManagerId} = req.body;

            if(!wardenId || !messManagerId) {
                return res.status(404).json({message: "No warden or Mess Manager Id"});
            }
            
            let result2 = await GuestRequest.updateOne(
                {_id: reqId}, 
                {$set: 
                    {
                        "to.warden": wardenId, 
                        "to.messManager": messManagerId
                    }
                }
            );

        } else if(req.user.type === "warden") {
            return await allotHostel(req, res);
        }

        return res.status(200).json({message: "Request Approved"});
        
    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const rejectGuestRequest = async (req, res) => {
    try {
        let {reqId} = req.params;
        let {reason} = req.body;

        let result = await GuestRequest.updateOne(
            {_id: reqId}, 
            {$set: 
                {
                    "rejects.rejected": true, 
                    "rejects.by": req.user._id, 
                    "rejects.at": new Date(), 
                    "rejects.reason": reason
                }
            }
        );

        return res.status(200).json({message: "Request Rejected"});

    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const deleteRequestForMe = async (req, res) => {
    try {
        let {reqId} = req.params;
        let result1 = await GuestRequest.findById(reqId, "approvals rejects visibility").lean();
        
        let isActionRequired = result1.rejects.rejected ? false : (result1.approvals[req.user.type].approved ? false : true);
        
        if(isActionRequired) {
            return res.status(404).json({message: "Need Action", isActionRequired: isActionRequired});
        }

        let result2 = await GuestRequest.updateOne({_id: reqId}, {$set: {[`visibility.${req.user.type}`]: false}});

        return res.status(200).json({message: "Request Deleted"});

    } catch(err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error!"});
    }
}

export const allotHostel = async (req, res) => {
    try {
        let {rooms} = req.body;
        
        for(let room of rooms) {
            room.allocatedBy = req.user._id;
            let newRoom = new Hostel(room);
            await newRoom.save();
        }

        return res.status(200).json({message: "Room Alloted"});

    } catch(err) {
        console.log(err);

        return res.status(500).json({message: "Internal Server Error!"});
    }
}