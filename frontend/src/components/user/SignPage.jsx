import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import s from "./Sign.module.css";
import { Button } from '@mui/material';

export default function SignPage() {
    const [isSignIn, setIsSignIn] = useState(true);

    return ( 
        <div className={s.signPage}>
            <div className={s.sign}>
                <div className={s.left}>
                    <h1>Welcome To Guestify</h1>
                </div>
                <div className={s.right}>
                   {isSignIn ? <SignIn/> : <SignUp/>} 
                   {isSignIn ? (
                        <div className={s.bottomNav}>
                            <p className={s.bottomText}>Don't have a Account ?</p>
                            <p className={s.getSignUp +" ms-2"} onClick={() => setIsSignIn(!isSignIn)}>click here to Sign-Up</p>
                        </div>
                    ) : (
                        <div className={s.bottomNav}>
                            <p className={s.bottomText}>Have a Account ?</p>
                            <p className={s.getSignUp +" ms-2"} onClick={() => setIsSignIn(!isSignIn)}>click here to Sign-In</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
