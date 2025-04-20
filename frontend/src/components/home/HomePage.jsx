import { useEffect, useState } from "react";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import axios from "axios";

import { setHeader, setUser } from "../../features/guestifySlice.js";

import Navbar from "../navbar/Navbar.jsx";
import SignPage from "../user/SignPage.jsx";
import GuestRequestPage from "../createRequest/GuestRequestPage.jsx";
import AllRequestsPage from "../allRequests/AllRequestsPage.jsx";
import GuestReqLetter from "../gstReqLetter/GuestRequestLetter.jsx";
import Report from "../report/ReportPage.jsx";

import hp from "./HomePage.module.css";
import LandingPage from "../LandingPage.jsx";
import AccountPage from "../account/AccountPage.jsx";


export default function HomePage() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.user);
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let authorizeUser = async () => {

            const token = localStorage.getItem("token");

            if(!token) {
                return;
            }

            let headers = {
                authorization: `Bearer ${token}`,
            }

            try {
                let response = await axios.get("http://localhost:5000/user/authorize-user", {headers});

                if(response.status === 200) {
                    dispatch(setUser(response.data.user));
                    dispatch(setHeader(token));
                    setStatus("User is Authorized!");
                }
                
            } catch(err) {
                navigate("/");
            }
        }

        if(!user._id || !headers.authorization) {
            authorizeUser();
        }

    }, []);

    let noNavRoutes = ["/user/sign"];

    return (
        <div className={hp.homePage}>
            {!noNavRoutes.includes(location.pathname) && <Navbar/>}
            <Routes>
                <Route path="/*" element={<LandingPage/>} />
                <Route path="/user/sign" element={<SignPage/>} />
                <Route path="/create-request" element={<GuestRequestPage/>} />
                <Route path="/all-requests" element={<AllRequestsPage/>}/>
                <Route path="/guest-request-letter" element={<GuestReqLetter/>} />
                <Route path="/report" element={<Report/>} />
                <Route path="/account" element={<AccountPage/>} />
            </Routes>
        </div>
    );
}
