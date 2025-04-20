import React from 'react';
import {Button} from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';
import LoginIcon from '@mui/icons-material/Login';
import { useSelector } from 'react-redux';

import lp from "./LandingPage.module.css";
import { useNavigate } from 'react-router-dom';


export default function LandingPage() {
  const user = useSelector(state => state.user);
  const navigate = useNavigate();

  return (
    <div className={lp.landingPage}>
      <div className={lp.section1}>
        <div className={lp.dtl +" col-2"}>
          <h1>Guest Accommodation Management System</h1>
          <p>Accommodation made easy with seamleas request creation and approvals by various levels.</p>
          {!user._id && (<div className={lp.btns}>
            <Button
              className={lp.learnMoreBtn}
              variant='outlined'
              color='light'>Learn More<InfoIcon className={lp.icon}/></Button>
            <Button
            className={lp.getStartedBtn}
            variant='outlined'
            color='light'
            onClick={() => navigate("/user/sign")}
            >Get Started<LoginIcon className={lp.icon}/></Button>
          </div>)}
        </div>
        <div className={lp.image +" col-5"}>
            {/*image through css*/}
        </div>
      </div>
      <div className={lp.section2}>
        <div className={lp.image +" col-5"}>
            {/*image through css*/}
        </div>
        <div className={lp.dtl +" col-2"}>
          <h1>Faster Process of Managing Guests In College</h1>
          <p>Accommodation made easy with seamleas request creation and approvals by various levels.</p>
        </div>
      </div>
    </div>
  );
}
