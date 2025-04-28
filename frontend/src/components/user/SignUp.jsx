import {useState } from 'react';
import {useFormik} from "formik";
import { useDispatch, useSelector} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { setUser, setHeader } from '../../features/guestifySlice';


import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { Button } from '@mui/material';

import s from "./Sign.module.css";

export default function SignUp() {

    const [status, setStatus] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const college = useSelector(state => state.college);
    const userTypes = useSelector(state => state.userTypes);
    const departments = Object.keys(college.departments);
    const collegeShortForm = college.short;

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            type: userTypes[0],
            department: departments[0],
            password: "",
            conPass: "",
        },
        validate: (values) => {},
        onSubmit: async (values) => {
            if(values.conPass != values.password) {
                return setStatus("Passwords didn't match!");
            }

            try {
                let response = await axios.post("https://guestify-8blq.onrender.com/user/sign-up", values);

                if(response.status === 200) {
                    localStorage.setItem("token", response.data.token);
                    dispatch(setUser(response.data.user));
                    dispatch(setHeader(response.data.token));
                    navigate("/");
                } else {
                    console.log(response);
                }

            } catch (err) {
                if(err.response) {
                    setStatus(err.response.data.message);
                }
            }
        }
    });

    return (
        <form onSubmit={formik.handleSubmit} className={s.signUp}>
            <h2>Sign Up</h2>
            <div className={s.inpField}>
                <PersonIcon className={s.icons}/>
                <input 
                className='form-control' 
                type="name" 
                name='name' 
                id='name'
                placeholder='Name' 
                value={formik.values.name} 
                onChange={formik.handleChange}
                required/>
            </div>
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
                <WorkIcon className={s.icons}/>
                <select className='form-control' name="type" id="type" value={formik.values.type} onChange={formik.handleChange}>
                    {userTypes.map((val, idx) => {
                        return (<option value={val} key={idx}>{val}</option>);
                    })}
                </select>
            </div>
            <div className={s.inpField}>
                <AccountBalanceIcon className={s.icons}/>
                <select className='form-control' name="department" id="department" value={formik.values.department} onChange={formik.handleChange}>
                    {(formik.values.type === "hod" || formik.values.type === "coordinator" )? departments.map((val, idx) => {
                        return (<option value={val} key={idx}>{val}</option>);
                    }) : <option value={collegeShortForm}>{collegeShortForm}</option>}
                </select>
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
            <div className={s.inpField}>
                <LockOpenIcon className={s.icons}/>
                <input 
                className='form-control' 
                type="conPass" 
                name='conPass' 
                placeholder='confirm password' 
                value={formik.values.conPass} 
                onChange={formik.handleChange}
                required/>
            </div>
            <Button type='submit' variant='contained' className={s.button}>Sign-in</Button>
            {status && <p className={s.status}>{status}</p>}
        </form>
    );
}
