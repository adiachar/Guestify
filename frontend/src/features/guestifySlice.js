import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    user : {},
    headers: {},
    allRequests: [],
    college: { 
        short: 'MITE',
        name: "Mangalore Institute Of Technology & Engineering",
        dtl: "(A Unit of Rajalaxmi Education Trust, Mangalore) \n Autonomous Institute Affialiated to VTU, Belagavi, Approved by AICTE, New Delhi Accredited by NAAC with A+ Grade & ISO 9001:2015 Certified Institution",
        departments: {
            AE: "Aeronautical Engineering",
            CSE: "Computer Science And Engineering",
            AIML: "Artificial Intelligence & Machine Learning",
            CSIOT: "Computer Science and Internet Of Things",
            IOT: "Internet Of Things",
            CSAIML: "Computer Science and Artificial Intelligence & Machine Learning",
            ISE: "Information Science And Engineering",
            ECE: "Electronics And Communication Engineering",
            ML: "Mechanical Engineering",
            ME: "Mechatronics Engineering"
        }
    },
    //donot change this field
    userTypes: ['coordinator', 'hod', 'principal', 'warden', 'messManager'],
}

const guestifySlice = createSlice({
    name: "Guestify",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },

        setHeader: (state, action) => {
            state.headers = {
                authorization: `Bearer ${action.payload}`,
            }
        },

        setAllRequests: (state, action) => {
            state.allRequests = action.payload;
        }
    }
});

export const {
    setUser,
    setHeader,
    setAllRequests
} = guestifySlice.actions;

export default guestifySlice.reducer;