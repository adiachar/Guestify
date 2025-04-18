import { useState } from "react";
import {Button} from "@mui/material"
import rc from "./RequestCard.module.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RequestCard({req, setIsUpdated}) {
    const [status, setStatus] = useState("");
    const [isApproved, setIsApproved] = useState(
        req.approvals.hod.approved && 
        req.approvals.principal.approved &&
        req.approvals.warden.approved && 
        req.approvals.messManager.approved
    );
    
    const user = useSelector(state => state.user);
    const headers = useSelector(state => state.headers);
    const navigate = useNavigate();
    const location = useLocation();

    const getDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {day: "numeric", month: "long", year: "numeric"})
    }

    const handleView = () => {
        navigate("/guest-request-letter", {state: {reqId: req._id}});
    } 

    const handleDelete = async () => {
        try {
            let response = await axios.patch(`http://localhost:5000/request/delete/${req._id}`, {}, {headers});
        
            if(response.status === 200) {
                setIsUpdated(isUpdated => !isUpdated);
                navigate("/all-requests");
            }

        } catch(err) {
            console.log(err);
            if(err.response) {
                console.log(err.response.data.message);

                if(err.response.data.isActionRequired) {
                    setStatus("Please Approve or Reject the Request before Deleting it.");
                }
            }
        }
    }

    return (
        <div className={rc.requestCard +" border-bottom"}>
            <div className={rc.header}>
                <h4>Guest Accommodation Request</h4>
                <div className={rc.dtl}>
                    <span className={rc.creator}>From: {req.requestedBy.name}</span>
                    <span className={rc.createdAt}>{req.requestedAt.toString().split('T')[0]}</span>
                    {(!req.approvals[user.type].approved && !req.rejects.rejected) && <span className={rc.dot}></span>}
                </div>
                <div className={rc.reqStatus}>
                    {req.rejects.rejected ?
                        <span className={rc.rejected}>Rejected by: {req.rejects.by.name} on: {getDate(req.rejects.at)}</span> 
                        :(
                            <>
                                <span className={req.approvals.hod.approved ? rc.approved : rc.notApproved}><p>Hod</p></span>
                                <span className={req.approvals.principal.approved ? rc.approved : rc.notApproved}><p>Principal</p></span>
                                <span className={req.approvals.warden.approved ? rc.approved : rc.notApproved}><p>Warden</p></span>
                                <span className={req.approvals.messManager.approved ? rc.approved : rc.notApproved}><p>Mess Manager</p></span>
                                <span className={isApproved ? rc.reqApproved : rc.reqPending}
                                >{isApproved ? "Approved": "Pending"}</span>
                            </>
                        )
                    }
                </div>
            </div>
            <Button className={rc.btn +" " +rc.btnView} variant="outlined" size="small" onClick={handleView}>View</Button>
            <Button className={rc.btn +" " +rc.btnDelete} variant="outlined" size="small" onClick={handleDelete}>Delete</Button>
            {status && <p className={"text-muted"}>{status}</p>}
        </div>
    );
}
