import { useNavigate } from 'react-router-dom';
import Button from "@mui/material/Button";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import n from "./Navbar.module.css";


export default function Navbar() {

    const navigate = useNavigate();

    return (
        <nav>
            <ul>
                <li>
                    <Button onClick={() => navigate("/create-request")}>Create Request</Button>
                </li>
                <li>
                    <Button onClick={() => navigate("/all-requests")}>All Request</Button>
                </li>
            </ul>
            <div className={n.options}>
                <MoreVertIcon/>
            </div>
        </nav>
    )
}
