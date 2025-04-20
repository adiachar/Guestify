import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import n from "./Navbar.module.css";


export default function Navbar() {

    const navigate = useNavigate();

    const user = useSelector(state => state.user);

    return (
        <nav>
            <div className={n.features}>
                <h1 className={n.h1}>Guestify</h1>
                {user._id && (
                    <ul>
                        <li>
                            {user.type === "coordinator" &&
                                <Button 
                                    onClick={() => navigate("/create-request")} 
                                    variant='outlined' 
                                    color='dark'
                                    className={n.btn +" " +n.btnCreateReq}

                                >Create Request</Button>
                            }
                        </li>
                        <li>
                            <Button 
                                onClick={() => navigate("/all-requests")} 
                                variant='outlined' 
                                color="dark"
                                className={n.btn +" " +n.btnAllReq}

                            >{user.type === "coordinator" ? "Request Status" : "All Request"}</Button>
                        </li>
                    </ul>
                )}
            </div>

            <ul className={n.options}>
                <li>
                    <Button
                        variant=''
                        color='dark'
                        className={n.btn2 +" " +n.btnHome}
                        onClick={() => navigate("/")}
                    >Home</Button>
                </li>
                <li>
                    <Button
                        variant=''
                        color='dark'
                        className={n.btn2 +" " +n.btnHome}
                    >About</Button>
                </li>
                {user._id && (
                    <>
                        <li>
                            <Button
                                variant=''
                                color='dark'
                                className={n.btn2 +" " +n.btnHome}
                                onClick={() => {localStorage.removeItem("token"); navigate("/user/sign")}}
                            >Sign-out</Button>
                        </li>
                        <li>
                            <Button
                                variant=''
                                color='dark'
                                className={n.btn2 +" " +n.btnHome}
                                onClick={() => navigate("/account")}

                            >Account</Button>
                        </li>                    
                    </>
                )}
            </ul>
        </nav>
    );
}
