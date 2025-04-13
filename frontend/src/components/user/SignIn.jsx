import {useState} from 'react';
import {useFormik} from "formik";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";

import axios from "axios";
import {setUser, setHeader} from "../../features/guestifySlice.js";
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { Button } from '@mui/material';
import s from "./Sign.module.css";

export default function SignIn() {

    const [status, setStatus] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
        },
        validate: () => {},
        onSubmit: async (values) => {
            try {
                let response = await axios.post("http://localhost:5000/user/sign-in", values);

                if(response.status === 200) {
                    localStorage.setItem("token", response.data.token);
                    dispatch(setUser(response.data.user));
                    dispatch(setHeader(response.data.token));
                    navigate("/");
                }
            } catch (err) {
                if(err.response) {
                    setStatus(err.response.data.message);
                }
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className={s.signIn}>
            <h2>Sign In</h2>
            <div className={s.inpField}>
                <EmailIcon className={s.icons}/>
                <input 
                className='form-control' 
                type="email" 
                name='email' 
                placeholder='email' 
                value={formik.values.email} 
                onChange={formik.handleChange}
                required/>
            </div>
            <div className={s.inpField}>
                <LockIcon className={s.icons}/>
                <input 
                className='form-control' 
                type="password" 
                name='password' 
                placeholder='password' 
                value={formik.values.password} 
                onChange={formik.handleChange}
                required/>
            </div>
            <Button type='submit' variant='contained' className={s.button}>Sign-in</Button>
            {status && <p className={s.status}>{status}</p>}
        </form>
    );
}
