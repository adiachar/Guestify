import Guest from "../model/guest.js";
import GuestRequest from "../model/guestRequest.js";

export const addGuestRequest = async (req, res) => {

    if(!req.body || !req.body.guest) {
        return res.status(404).json({message: "No Request Body!"});
    }

    try {
        let newGuestRequest = new GuestRequest({
            creator_id: req.user._id,
            to_id: [req.body.hod_id],
            reasonOfArrival: req.body.reasonOfArrival,
        });
        
        await newGuestRequest.save();

        const guestList = req.body.guest;

        for(let guest of guestList) {
            guest.guestRequest_id = newGuestRequest._id;
        }

        let result = await Guest.insertMany(guestList);

        return res.status(200).json({message: "Request Created!"});

    } catch(err) {
        console.log(err);
    }

}