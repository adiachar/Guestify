import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "axios";

import {Button} from "@mui/material";

import rl from "./GuestRequestLetter.module.css";

const branchFullForms = {
    ISE: "Informantion Science and Engineering",
    CSE: "Compouter Science and  Engineering",
    ECE: "Electronics and Communication Engineering",
    MEC: "Mechanical Engineering",
    AIML: "Artificial Intelligence and Machine Learning",
    IOT: "Internet Of Things",
    CVL: "Civil Engineering",
}

export default function GuestReqLetter() {
    
    const allRequests = useSelector(state => state.allRequests);
    const user = useSelector(state => state.user);
    const headers = useSelector(state => state.headers);

    const [req, setReq] = useState({});

    const [rejectRequest, setRejectRequest] = useState(false);
    const [principalApprove, setPrincipalApprove] = useState(false);
    const [allotRoom, setAllotRoom] = useState(false);

    const [status, setStatus] = useState("");

    const [isSubmited, setIsSubmited] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if(!headers.authorization) {
            return navigate("/");
        }

        for(let curReq of allRequests) {
            if(location.state.reqId == curReq._id) {
                setReq(curReq);
                break;
            }
        }
    },[]);

    const handleApprove = async () => {
        try {
            let response = await axios.patch(`http://localhost:5000/request/approve/${req._id}`, {}, {headers});
            if(response.status === 200) {
                setIsSubmited(true);
                setStatus("Request Approved");
            }
        } catch(err) {
            if(err.response) {
                console.log(err.response.data.message);
            } else {
                console.log(err);
            }
        }
    }

    const handleReject = () => {
        setRejectRequest(rej => !rej);
    }

    const getDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {day: "numeric", month: "long", year: "numeric"});
    }

    const getTime = (time) => {
        return new Date(time).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: true});
    }

    return (
        <div className={rl.guestReqLetter}>
            {Object.keys(req).length !== 0 && <div className={rl.guestReqLetter}>
                <div className={rl.from}>
                    <h5>From: </h5>
                    <p>{req.requestedBy.name}</p>
                    <p>{branchFullForms[req.requestedBy.department]}</p>    
                    <p>Mangalore Institute of Technology and Engineering</p>
                </div>
                <div className={rl.to}>
                    <h5>To: </h5>
                    <p>{user.name}</p>
                    {(user.type === "hod" || user.type === "coordinator") && <p>{branchFullForms[user.department]}</p>}
                    <p>Mangalore Institute of Technology and Engineering</p>
                </div>
                <div className={rl.date}>
                    <p>{getDate(req.requestedAt)}</p>
                </div>
                <div className={rl.subject}>
                    <div className={rl.subjectHead}>
                        <h5>Subject :</h5>
                        <p>Guest Accommodation Request</p>
                    </div>
                    <p className="">{req.reasonOfArrival}</p>
                </div>
                <div className={rl.guestsDtl}>
                    <h4>Guest Details</h4>
                    {req.guests.map((guest, idx) => (
                        <div className={rl.guestDtl} key={idx}>
                            <div className={rl.inpField}>
                                <p className="pe-3"><b>Name: </b></p>
                                <p>{guest.name}</p>
                            </div>
                            <div className={rl.inpField}>
                                <p className="pe-3"><b>Arrival Date: </b></p>
                                <p>{getDate(guest.arrivalDate)}</p>
                            </div>
                            <div className={rl.inpField}>
                                <p className="pe-3"><b>Arrival Time: </b></p>
                                <p>{getTime(guest.arrivalTime)}</p>
                            </div>
                            <div className={rl.inpField}>
                                <p className="pe-3"><b>Leaving Date: </b></p>
                                <p>{getDate(guest.leavingDate)}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className={rl.btns +" mt-3"}>
                    <Button 
                        variant="outlined" 
                        color="success" 

                        onClick={user.type === "hod" || user.type === "messManager" ? 
                            handleApprove : 
                            (user.type === "principal" ?
                                () => setPrincipalApprove(approve => !approve) : 
                                () => setAllotRoom(approve => !approve)
                            )
                        }

                        disabled={(req.approvals[user.type].approved || req.rejects.rejected || isSubmited)} 
                    >
                        Approve
                    </Button>
                    <Button 
                        className="ms-3" 
                        variant="outlined" 
                        color="error" 
                        disabled={req.approvals[user.type].approved || req.rejects.rejected || isSubmited} 
                        onMouseEnter={() =>console.log(req.status)}
                        onClick={handleReject}
                        >Reject
                    </Button>
                </div>
            </div>}
            {rejectRequest && <RejectGuestRequest isSubmited={isSubmited} setIsSubmited={setIsSubmited} setStatus={setStatus} req={req} headers={headers}/>}
            {principalApprove && <ApproveRequestForPrincipal isSubmited={isSubmited} setIsSubmited={setIsSubmited} setStatus={setStatus} req={req} headers={headers}/>}
            {allotRoom && <AllocateRoom isSubmited={isSubmited} setIsSubmited={setIsSubmited} setStatus={setStatus} req={req} headers={headers}/>}
            {status && <p className={rl.status}>{status}</p>}
        </div>
    );
}


function RejectGuestRequest({isSubmited, setIsSubmited, setStatus, req, headers}){

    const [reason, setReason] = useState("");

    const handleReject = async () => {
        try {
            let response = await axios.patch(`http://localhost:5000/request/reject/${req._id}`, {reason}, {headers});
            if(response.status === 200) {
                setIsSubmited(true);
                setStatus("Request Rejected");
            }
        } catch(err) {
            if(err.response) {
                console.log(err.response.data.message);
            } else {
                console.log(err);
            }
        }
    }

    const handleChange = (e) => {
        setReason(e.target.value);
    }

    return (
        <div className={rl.rejectComponent}>
            <form className={rl.rejectForm}>
                <textarea 
                    type="text" 
                    value={reason}
                    name="reason"
                    onChange={handleChange}
                    className={rl.inp +"  form-control mb-3"} 
                    placeholder="Why are you rejecting this Request ?" 
                    required
                />
                <Button variant="outlined" disabled={isSubmited} color="error" onClick={() => handleReject()} className={rl.btnReject}>Reject</Button>
            </form>
        </div>
    );
}

function ApproveRequestForPrincipal({isSubmited, setIsSubmited, setStatus, req, headers}) {

    const [allWardens, setAllWardens] = useState([]);
    const [allMessManagers, setAllMessManagers] = useState([]);

    const [selectedWardenId, setSelectedWardenId] = useState("");
    const [selectedMessManagerId, setSelectedMessManagerId] = useState("");

    useEffect(() => {
        getAllWardens();
        getAllMessManagers();
    }, []);

    const getAllWardens = async () => {
        try {
            let response = await axios.get("http://localhost:5000/data/all-wardens", {headers});
            if(response.status === 200) {
                setAllWardens(response.data.allWardens);
                setSelectedWardenId(response.data.allWardens[0]._id);
            }
        } catch(err) {
            if(err.response) {
                console.log(err.response.data.message);
            }
        }
    }

    const getAllMessManagers = async () => {
        try {
            let response = await axios.get("http://localhost:5000/data/all-messManagers", {headers});
            if(response.status === 200) {
                setAllMessManagers(response.data.allMessManagers);
                setSelectedMessManagerId(response.data.allMessManagers[0]._id);
            }
        } catch(err) {
            if(err.response) {
                console.log(err.response.data.message);
            }
        }
    }

    const handleApprove = async () => {
        let values = {
            wardenId: selectedWardenId,
            messManagerId: selectedMessManagerId,
        }
        
        try {
            let response = await axios.patch(`http://localhost:5000/request/approve/${req._id}`, values, {headers});

            if(response.status === 200) {
                setIsSubmited(true);
                setStatus("Request Approved");
            }
            
        } catch(err) {

            if(err.response) {
                setStatus(err.response.data.message);
            } else {
                console.log(err);
            }
        }
    }


    return (
        <div className={rl.approveRequestComponent}>
            <form className={rl.approveRequestForm}>
                <label htmlFor="warden" className="form-lable"> Send Guest Details To: </label>
                <select 
                    name="warden" 
                    id="warden" 
                    value={selectedWardenId} 
                    onChange={(e) => setSelectedWardenId(e.target.value)}
                    className={rl.select +" form-control mb-2"}
                    required
                >
                    {allWardens.length != 0 && allWardens.map((val, idx) => (
                        <option value={val._id} key={idx}>{val.name}</option>
                    ))}
                </select>
                <label htmlFor="messManager" className="form-lable"> Send Guest Food Details To: </label>
                <select 
                    name="messManager" 
                    id="messManager" 
                    value={selectedMessManagerId} 
                    onChange={(e) => setSelectedMessManagerId(e.target.value)}
                    className={rl.select +" form-control mb-2"}
                    required
                >
                    {allMessManagers.map((val, idx) => (
                        <option value={val._id} key={idx}>{val.name}</option>
                    ))}
                </select>
                <Button variant="outlined" disabled={isSubmited} color="success" onClick={() => handleApprove()} className={rl.btnApprove}>Approve</Button>
            </form>
        </div>
    );
}

function AllocateRoom({req, isSubmited, setIsSubmited, setStatus, headers}) {

    let blocks = ["B1", "B2", "B3", "G1", "G2", "G3"];

    const [selectedBlock, setSelectedBlock] = useState(blocks[0]);

    const [rooms, setRooms] = useState(
        req.guests.map((guest, idx) => (
            {
                guest_id: guest._id,
                roomNo: 0,
                block: blocks[0]
            }
        ))
    );

    let handleChange = (e, idx) => {
        setRooms(rooms => {
            let newRooms = rooms;
            newRooms[idx] = {...newRooms[idx], [e.target.name]: e.target.value}
            return [...newRooms];
        });
    }

    let handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response = await axios.patch(`http://localhost:5000/request/approve/${req._id}`, {rooms}, {headers});

            if(response.status === 200) {
                setIsSubmited(true);
                setStatus("Request Accepted and Room Alloted");
            }

        } catch(err) {
            console.log(err);

            if(err.response) {
                console.log(err.response.message);
            }
        }
    }
    
    return(
        <div className={rl.allocateRoomComponent}>
            <form className={rl.allocateRoomForm} onSubmit={handleSubmit}>
                <h5>Allocate Room</h5>
                {rooms.map((room, idx) => (
                    <div className={rl.inputsContainer +" border p-2 mb-3"} key={idx}>
                        <h6>Guest({idx + 1}): {req.guests[idx].name}</h6>
                        <div className={rl.inputs}>
                            <label htmlFor="block" className="form-lable">Block: </label>
                            <select 
                                name="block" 
                                id="block" 
                                className={rl.select +" form-control mb-4"}
                                value={room.block}
                                onChange={e => handleChange(e, idx)}
                            >
                                {blocks.map((block, idx) => (
                                    <option key={idx} value={block}>{block}</option>
                                ))}
                            </select>
                            <label htmlFor="roomNo" className="form-lable">Room No: </label>
                            <input 
                                type="number" 
                                id="roomNo"
                                min={0}
                                name="roomNo"
                                value={room.roomNo} 
                                className={rl.select +" form-control"}
                                onChange={e => handleChange(e, idx)}
                                required
                            />
                        </div>
                    </div>
                ))}
                <Button
                    type="submit"
                    variant="outlined" 
                    color="success" 
                    className={rl.btnApprove}
                    disabled={isSubmited}
                >Apparove</Button>  
            </form>
        </div>

    );
}