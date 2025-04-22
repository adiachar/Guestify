import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Button} from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';
import re from "./ReportPage.module.css";

export default function Report() {

    const headers = useSelector(state => state.headers);
    const college = useSelector(state => state.college);
    const location = useLocation();
    const navigate = useNavigate();
    const contentRef = useRef();
    const [req, setReq] = useState({});

    useEffect(() => {

        if(!headers.authorization) {
            return navigate("/");
        }

        const getFullReq = async (req) => {
            try {
                let response = await axios.get(`http://localhost:5000/data/guest-request/${req._id}`, {headers});       
                
                if(response.status === 200) {
                    setReq(response.data.guestRequest);
                }

            } catch(err) {
                console.log(err);
            }
        }

        getFullReq(location.state.req);

    },[]);

    const getDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {day: "numeric", month: "long", year: "numeric"});
    }

    const getTime = (time) => {
        return new Date(time).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit", hour12: true});
    }

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: "Guestify_Report",
    });

    return (
        <div className={re.report}>
            <div className={re.downloadSection}>
                <Button 
                    className={re.downloadBtn} 
                    variant="outlined" 
                    color="dark" 
                    onClick={handlePrint}
                > <DownloadIcon/> Download</Button>
            </div>
            {Object.keys(req).length !== 0 && (
                <div ref={contentRef} className={re.a4Report}>
                    <div className={re.header}>
                        <div className={re.logo}>
                            <img className="logo-small" src="https://mite.ac.in/wp-content/uploads/2025/03/mite-logo.svg"/>
                        </div>
                        <div className={re.college}>
                            <h1>{(college.name).toUpperCase()}</h1>
                            <p>{(college.dtl).slice(0, 49)}</p>
                            <p>{(college.dtl).slice(49)}</p>
                        </div>
                    </div>
                    <h2>Guest Accommodation Report</h2>
                    <h3>Guest Details</h3>
                    <div className={re.guestsDtl}>
                        {req.guests.map((guest, idx) => (
                            <div className={re.guestDtl} key={idx}>
                                <div className={re.kvpair}>
                                    <p className={re.key}>Name</p>
                                    <p className={re.val}>{guest.name}</p>
                                </div>
                                <div className={re.kvpair}>
                                    <p className={re.key}>Arrival Date</p>
                                    <p className={re.val}>{getDate(guest.arrivalDate)}</p>
                                </div>
                                <div className={re.kvpair}>
                                    <p className={re.key}>Arrival Time</p>
                                    <p className={re.val}>{getTime(guest.arrivalTime)}</p>
                                </div>
                                <div className={re.kvpair}>
                                    <p className={re.key}>Dispatch</p>
                                    <p className={re.val}>{getDate(guest.leavingDate)}</p>
                                </div>
                            </div>   
                        ))}
                    </div>
                    <h3>Reason of Arrival</h3>
                    <div className={re.reasonOfArrival}>
                        <p>{req.reasonOfArrival}</p>
                    </div>
                    <h3>Approval Status</h3>
                    <div className={re.approvalStatus}>
                        <div className={re.approvalRows}>
                            {Object.entries(req.approvals).map(([type, obj], idx) => (
                                <div className={re.approvalRow} key={idx}>
                                    <p>{type}</p>
                                    <p>{req.to[type].name}</p>
                                    <p>{obj.approved ? "Approved" : "Not Approved"}</p>
                                    <p>{getDate(obj.approvedAt)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <h3>Room Details</h3>
                    <div className={re.roomDtls}>
                        {req.guests.map((guest, idx) => (
                            <div className={re.roomDtl} key={idx}>
                                <div className={re.kvpair}>
                                    <p className={re.key}>Name</p>
                                    <p className={re.val}>{guest.name}</p>
                                </div>
                                <div className={re.kvpair}>
                                    <p className={re.key}>Block</p>
                                    <p className={re.val}>{guest.hostel.block}</p>
                                </div>
                                <div className={re.kvpair}>
                                    <p className={re.key}>Room No</p>
                                    <p className={re.val}>{guest.hostel.roomNo}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
