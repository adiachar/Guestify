import { useEffect, useState } from "react";
import {useSelector, useDispatch} from "react-redux";
import {useLocation, useNavigate} from "react-router-dom";

import {setAllRequests} from "../../features/guestifySlice.js";
import axios from "axios";

import RequestCard from "./RequestCard";
import ar from "./AllRequestsPage.module.css";

export default function AllRequestsPage() {

    const navigate = useNavigate();
    const location = useLocation();

    const headers = useSelector(state => state.headers);
    const user = useSelector(state => state.user);
    const allRequests = useSelector(state => state.allRequests);

    const dispatch = useDispatch();

    const [isUpdated, setIsUpdated] = useState(false);

    useEffect(() => {
        let getAllRequests = async () => {
            try {
                let response = await axios.get("http://localhost:5000/data/all-requests", {headers});

                if(response.status === 200) {
                    dispatch(setAllRequests(response.data.allRequests));
                }

            } catch(err) {
                console.log(err);
            }
        } 

        if(!user._id) {
            return navigate("/");
        }

        getAllRequests();

    }, [isUpdated]);

    return (
        <div className={ar.allRequests}>
            {allRequests.length === 0 ? <h4 style={{textAlign: "center"}}>No Requests Here!</h4> : allRequests.map((req, idx) => (
                <RequestCard req={req} setIsUpdated={setIsUpdated} key={idx} />
            ))}
        </div>
    );
}
