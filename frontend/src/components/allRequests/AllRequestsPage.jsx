import { useEffect } from "react";
import {useSelector, useDispatch} from "react-redux";
import {setAllRequests} from "../../features/guestifySlice.js";
import axios from "axios";

import RequestCard from "./RequestCard";
import ar from "./AllRequests.module.css";

const allRequests = [
    {
        creator: {
            name: "createrName",
            department: "ISE"
        },
        createdAt: "12-03-2025",
    },
    {
        creator: {
            name: "createrName",
            department: "ISE"
        },
        createdAt: "12-03-2025",
    },
    {
        creator: {
            name: "createrName",
            department: "ISE"
        },
        createdAt: "12-03-2025",
    }
];

export default function AllRequestsPage() {

    const headers = useSelector(state => state.headers);
    const allRequests = useSelector(state => state.allRequests);

    const dispatch = useDispatch();

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

        if(allRequests.length == 0) {
            getAllRequests();
        }
    });

    return (
        <div>
            {allRequests.map((val, idx) => (
                <RequestCard creatorName={val.creator.name} createdAt={val.createdAt} key={idx}/>
            ))}
        </div>
    );
}
