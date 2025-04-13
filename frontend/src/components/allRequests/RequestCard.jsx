import {Button} from "@mui/material"
import rc from "./RequestCard.module.css";

export default function RequestCard({creatorName, createdAt}) {
    return (
        <div className={rc.RequestCard}>
            <div className={rc.header}>
                <h1>Guest Accommodation Request</h1>
                <span>{creatorName}</span>
                <span>{createdAt}</span>
            </div>
            <Button>View</Button>
            <Button>Delete</Button>
        </div>
    );
}
