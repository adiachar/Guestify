import { useEffect, useState } from 'react';
import {useSelector} from "react-redux";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';
import gr from "./GuestRequestPage.module.css";

export default function GuestRequestPage() {

    const [noGuests, setNoGuests] = useState("");
    const [guest, setGuest] = useState([]);
    const [selectedHod_id, setSelectedHod_id] = useState("");
    const [reasonOfArrival, setReasonOfArrival] = useState("");
    const [status, setStatus] = useState("");
    const [allHods, setAllHods] = useState([]);
    const [isCreated, setIsCreated] = useState(false);
    const headers = useSelector(state => state.headers);
    const navigate = useNavigate();

    useEffect(() => {
        if(!headers.authorization) {
            return navigate("/");
        }
        
        let getAllHods = async () => {
            try {
                let response = await axios.get("http://localhost:5000/data/all-hods", {headers});

                if(response.status === 200) {
                    setAllHods(response.data.allHods);
                    setSelectedHod_id(response.data.allHods[0]._id);
                }    

            } catch(err) {
                if(err.response) {
                    console.log(err.response.data.message);
                }
            }
        }

        getAllHods();

    }, []);

    const handleChange = (e) => {
        if(e.target.name === 'noGuests') {
            
            if(e.target.value > 20) {
                e.target.value = 20;
            }

            setNoGuests(e.target.value);
            setGuest(
                Array.from({length: e.target.value}, () => 
                    ({
                        name: "",
                        info: "",
                        isVegitarian: false,
                        foodTime: {
                            breakfast :false,
                            lunch : false,
                            dinner :false,
                        },
                        arrivalDate: "",
                        arrivalTime: "",
                        leavingDate: "",
                    })
                )
            );
        }

        if(e.target.name === 'hod_id')
            setSelectedHod_id(e.target.value);

        if(e.target.name === 'reasonOfArrival')
            setReasonOfArrival(e.target.value);
    }

    const handleGstChange = (e, idx) => {
        setGuest(gst => {
            let newGstArr = gst;
            let gstObj = newGstArr[idx];
            gstObj[e.target.name] = e.target.value;
            newGstArr[idx] = gstObj;
            return [...newGstArr];
        });
    }

    const handleDateTimeChange = (date, name, idx) => {
        setGuest(gst => {
            let newGstArr = gst;
            let gstObj = newGstArr[idx];
            gstObj[name] = date;
            newGstArr[idx] = gstObj;
            return [...newGstArr];
        });
    }

    const handleRadioChange = (e, idx) => {
        setGuest( gst => {
            let newGstArr = gst;
            let gstObj = newGstArr[idx];
            gstObj.isVegitarian = e.target.value == "true";
            newGstArr[idx] = gstObj;
            return [...newGstArr];
        });
    }

    const handleCheckBoxChange = (e, idx) => {
        setGuest(gst => {
            const {name, checked} = e.target;
            let newGstArr = gst;
            let gstObj = newGstArr[idx];
            gstObj.foodTime = {...gstObj.foodTime, [name]: checked};
            newGstArr[idx] = gstObj;
            return [...newGstArr];           
        });
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if(noGuests <= 0) {
            return setStatus("There Should be atleast One Guest!")
        }

        let values = {
            guest: guest,
            hodId: selectedHod_id,
            reasonOfArrival: reasonOfArrival,
        }
        
        try {
            let response = await axios.post("http://localhost:5000/request/guest-request", values, {headers});

            if(response.status === 200) {
                setIsCreated(true);
                setStatus("Request Created!");
            }

        } catch(err) {
            if(err.response) {
                console.log(err.response.data.message);
            }
        }
    }
    
    return (
        <div className={gr.guestRequestPage}>
            <form onSubmit={handleSubmit} className={gr.guestRequestForm} autoComplete='off'>
                <div className={gr.inpField}>
                    <input 
                    className='form-control' 
                    type="number" 
                    min={1}
                    max={10}
                    id='noGuests'
                    name='noGuests' 
                    placeholder='Number of Guests Arriving' 
                    value={noGuests} 
                    onChange={handleChange}/>
                </div>
                {guest.map((_, idx) => {
                    return (
                        <div className={gr.guestDtl} key={idx}>
                            <div className={gr.row1}>
                                <div className={gr.inpField}>
                                    <input
                                        className='form-control' 
                                        type="text"
                                        name='name'
                                        placeholder='Guest Name' 
                                        value={guest[idx].name}
                                        onChange={e => handleGstChange(e, idx)}
                                        autoComplete='off'
                                        required
                                    />
                                </div>
                                <div className={`${gr.inpField} ${gr.datePicker}`}>
                                    <DatePicker 
                                        className={" form-control"}
                                        name='arrivalDate' 
                                        placeholderText='Arrival Date' 
                                        selected={guest[idx].arrivalDate}
                                        onChange={(date) => handleDateTimeChange(date, "arrivalDate", idx)}
                                        customInput={
                                            <input autoComplete='off'/>
                                        }
                                        required
                                    />
                                </div>
                                <div className={`${gr.inpField} ${gr.datePicker}`}>
                                    <DatePicker 
                                        className={gr.datePicker +" form-control"}
                                        name='arrivalTime' 
                                        placeholderText='Arrival Time' 
                                        selected={guest[idx].arrivalTime} 
                                        onChange={(time) => handleDateTimeChange(time, "arrivalTime", idx)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption='Time'
                                        timeFormat='hh:mm aa'
                                        dateFormat="h:mm aa"
                                        customInput={
                                            <input autoComplete='off'/>
                                        }
                                        required
                                    />
                                </div>
                                <div className={`${gr.inpField} ${gr.datePicker}`}>
                                    <DatePicker 
                                        className={gr.datePicker +" form-control"} 
                                        name='leavingDate' 
                                        placeholderText='Leaving Date' 
                                        selected={guest[idx].leavingDate}
                                        onChange={(date) => handleDateTimeChange(date, "leavingDate", idx)}
                                        required
                                        customInput={
                                            <input autoComplete='off'/>
                                        }
                                    />    
                                </div>
                            </div>
                            <div className={gr.row2}>
                                <div className={gr.inpField}>
                                    <textarea 
                                        rows={7}
                                        className='form-control' 
                                        type="text" 
                                        name='info' 
                                        placeholder='Guest Details' 
                                        value={guest[idx].info} 
                                        onChange={e => handleGstChange(e, idx)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className={gr.row3}>
                                <div className={`${gr.inpField} ${gr.radioInps}`}>
                                    <label>
                                        <input 
                                            type="radio"
                                            value="true"
                                            name={`isVegitarian[${idx}]`}
                                            checked={guest[idx].isVegitarian}
                                            onChange={ e => handleRadioChange(e, idx)}
                                            /> 
                                            Vegitarian
                                    </label>
                                    <label>
                                        <input 
                                            type="radio" 
                                            value="false"
                                            name={`isVegitarian[${idx}]`}
                                            checked={!guest[idx].isVegitarian}
                                            onChange={ e => handleRadioChange(e, idx)}
                                        />
                                        Non Vegitarian
                                    </label>
                                </div>
                                <div className={`${gr.inpField} ${gr.checkBoxInps}`}>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="true"
                                            name="breakfast"
                                            checked={guest[idx].foodTime.breakfast}
                                            onChange={e => handleCheckBoxChange(e, idx)}
                                        /> 
                                        Breakfast
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="true"
                                            name="lunch"
                                            checked={guest[idx].foodTime.lunch}
                                            onChange={e => handleCheckBoxChange(e, idx)}
                                        /> 
                                        Lunch
                                    </label>
                                    <label>
                                        <input 
                                            type="checkbox"
                                            value="false"
                                            name="dinner"
                                            checked={guest[idx].foodTime.dinner}
                                            onChange={e => handleCheckBoxChange(e, idx)}
                                        /> 
                                        Dinner
                                    </label>
                                </div>
                            </div>
                            
                        </div>
                    )
                })}
                <div className={gr.inpField}>
                    <textarea 
                        className='form-control' 
                        type="text" 
                        name='reasonOfArrival' 
                        placeholder='Reason of Arriving'
                        value={reasonOfArrival} 
                        onChange={handleChange}
                        required
                    />
                </div>
                <p className={gr.sendTo}>Send this Request To: </p>
                <div className={gr.inpField}>
                    <select className='form-control' name="hod_id" id="hod_id" value={selectedHod_id} onChange={handleChange}>
                        {allHods.map((hod, idx) => {
                            return (<option key={idx} value={hod._id}>{hod.name}</option>);
                        })}
                    </select>
                </div>
                <Button 
                    type='submit' 
                    variant='outlined'
                    color='dark' 
                    disabled={isCreated} 
                    className={gr.button}
                    
                ><SendIcon className={gr.sendIcon} fontSize='small'/>Send</Button>
                {status && <p className={gr.status}>{status}</p>}
            </form>
        </div>
    )
}
