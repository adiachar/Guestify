import { useState } from "react";
import {Button} from "@mui/material"
import rc from "./RequestCard.module.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RequestCard({req, setIsUpdated}) {
    const [status, setStatus] = useState("");
    const [isApproved, setIsApproved] = useState(
        (req.approvals.hod.approved && 
        req.approvals.principal.approved &&
        req.approvals.warden.approved && 
        req.approvals.messManager.approved) ? true : false
    );
    
    const [deletePermanently, setDeletePermanently] = useState(false);
    
    const user = useSelector(state => state.user);
    const headers = useSelector(state => state.headers);
    const navigate = useNavigate();
    const location = useLocation();

    const getDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {day: "numeric", month: "long", year: "numeric"})
    }

    const handleView = () => {
        navigate("/guest-request-letter", {state: {req: req}});
    } 

    const handleDelete = async () => {
        try {
            let response = await axios.patch(`https://guestify-8blq.onrender.com/request/delete/${req._id}`, {}, {headers});
        
            if(response.status === 200) {
                setIsUpdated(isUpdated => !isUpdated);
                navigate("/all-requests");
            }

        } catch(err) {
            console.log(err);
            if(err.response) {

                if(err.response.data.isActionRequired) {
                    setStatus("Can't delete as Request is not Approved or Rejected.");
                }
            }
        }
    }

    const handleReport = () => {
        navigate("/report", {state: {req: req}});
    }

    const handleDeletePermanently = async () => {
        try {
            let response = await axios.patch(`https://guestify-8blq.onrender.com/request/delete-permanently/${req._id}`, {}, {headers});
        
            if(response.status === 200) {
                setIsUpdated(isUpdated => !isUpdated);
                navigate("/all-requests");
            }

        } catch(err) {
            console.log(err);
            if(err.response) {

                if(err.response.data.isActionRequired) {
                    setStatus("Internal Server Error!");
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
                    {user.type !== "coordinator" && ((!req.approvals[user.type].approved && !req.rejects.rejected) && <span className={rc.dot}></span>)}
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
            <div className={rc.btns}>
                <Button className={rc.btn +" " +rc.btnView} variant="outlined" size="small" onClick={handleView}>View</Button>
                <Button className={rc.btn +" " +rc.btnDelete} variant="outlined" size="small" onClick={handleDelete}>Delete For Me</Button>
                {user.type === "coordinator" && (
                    <>
                        <Button 
                            className={rc.btn +" " +rc.btnReport} 
                            variant="outlined" 
                            size="small" 
                            onClick={handleReport}

                        >Report</Button>

                        <Button 
                            className={rc.btn +" " +rc.btnDeletePermanently} 
                            variant="outlined" size="small" 
                            onClick={() => setDeletePermanently(val => !val)}

                        >Delete Permanently</Button>                    
                    </>

                )}
            </div>
            
            {deletePermanently && 
                <div className={rc.deletePermanently}>
                    <p>By clicking on Delete Permanently, this Request will deleted from the Database.</p>
                    <Button className={rc.deletePermanentlyBtn} variant="contained" size="small" onClick={handleDeletePermanently} color="error">Delete Permanently</Button>
                </div>
            }
            {status && <p className={"text-muted"}>{status}</p>}
        </div>
    );
}
