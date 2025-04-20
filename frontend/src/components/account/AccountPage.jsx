import { useSelector } from "react-redux";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ac from "./AccountPage.module.css";

export default function AccountPage() {
    const user = useSelector(state  => state.user);
    const college = useSelector(state => state.college);

    return (
        <div className={ac.accountPage}>
            <div className={ac.account}>
                <AccountCircleIcon className={ac.accountIcon}/>
                <div className={ac.kvPair}>
                    <p className={ac.key}>Name: </p>
                    <p className={ac.val}>{user.name}</p>
                </div>
                <div className={ac.kvPair}>
                    <p className={ac.key}>Email: </p>
                    <p className={ac.val}>{user.email}</p>
                </div>
                <div className={ac.kvPair}>
                    <p className={ac.key}>Working As: </p>
                    <p className={ac.val}>{user.type}</p>
                </div>
                {user.type !== "principal" ? 
                (
                    <div className={ac.kvPair}>
                        <p className={ac.key}>Department: </p>
                        <p className={ac.val}>{college.departments[user.department]}</p>
                    </div>
                ) : 
                (
                    <div className={ac.kvPair}>
                        <p className={ac.key}>College: </p>
                        <p className={ac.val}>{college.name}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
