import React, { useState } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import s from "./Sign.module.css";
import { Button } from '@mui/material';

export default function SignPage() {
    const [isSignIn, setIsSignIn] = useState(true);

    return ( 
        <div className={s.signPage}>
            {isSignIn ? <SignIn/> : <SignUp/>}
            {isSignIn ? (
                <div className='d-flex'>
                    <p className={s.bottomText}>Don't have a Account ?</p>
                    <p className={s.getSignUp +" ms-2"} onClick={() => setIsSignIn(!isSignIn)}>click here to Sign-up</p>
                </div>
            ): (
                <div className='d-flex'>
                    <p className={s.bottomText}>Have a Account ?</p>
                    <p className={s.getSignUp +" ms-2"} onClick={() => setIsSignIn(!isSignIn)}>click here to Sign-in</p>
                </div>
            )}
        </div>
    );
}
