import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import {useSelector} from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Button} from "@mui/material";
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

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: "Guestify_Report",
    });

    return (
        <div className={re.report}>
            {Object.keys(req).length !== 0 && (
                <div ref={contentRef} className={re.a4Report}>
                    <div className={re.header}>
                        <div className={re.logo}>

                        </div>
                        <div className={re.college}>
                            <h1>{college.name}</h1>
                            <p>{college.dtl}</p>
                        </div>
                    </div>
                    <div className={re.guestDtl}>

                    </div>
                    <div className={re.reasonOfArrival}>

                    </div>
                    <div className={re.approvalStatus}>

                    </div>
                    <div className={re.roomDtl}>

                    </div>
                </div>
            )}
            <Button onClick={handlePrint}>Download</Button>
        </div>
    );
}
