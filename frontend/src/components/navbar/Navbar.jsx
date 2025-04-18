import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import n from "./Navbar.module.css";
import { useSelector } from 'react-redux';


export default function Navbar() {

    const navigate = useNavigate();

    const user = useSelector(state => state.user);
    const allRequests = useSelector(state => state.allRequests);

    return (
        <nav>
            <ul>
                <li>
                    {user.type === "coordinator" && <Button onClick={() => navigate("/create-request")} variant='contained' className={n.btn +" " +n.btnCreateReq}>Create Request</Button>}
                </li>
                <li>
                    <Button onClick={() => navigate("/all-requests")} variant='contained' className={n.btn +" " +n.btnAllReq}>All Request</Button>
                </li>
            </ul>
            <div className={n.options}>
                <MoreVertIcon/>
            </div>
        </nav>
    );
}
