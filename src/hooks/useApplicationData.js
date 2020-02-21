import { useReducer, useEffect } from "react";

const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

const axios = require('axios').default;

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  function getDayID(state, id) {
    for (let day of state.days) { //looping through the days
      if (day.appointments.includes(id)) {
        return day.id - 1;
      }
    }    
  }
  
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
      case SET_INTERVIEW:

          const interview = action.interview
          const id = action.id
          const dayID = getDayID(state, id);

          console.log("INTERVIEw:", interview)

          let appointment = {};

          if (!interview) {
            appointment = {
              ...state.appointments[id],
              interview: null
            };
          } else {
            appointment = {
              ...state.appointments[id],
              interview: { ...interview }
            };
          }

          const appointments = {
            ...state.appointments,
            [id]: appointment
          };

          const days = [ ...state.days ];
          const appointmentsForDay = state.days[dayID].appointments;
          let spotCount = 0;

          for (let appointment of appointmentsForDay) {
            let currentAppointment = appointments[appointment]
            console.log("CURRENT APPOINTMENT", currentAppointment);
            if (!currentAppointment.interview || Object.keys(currentAppointment.interview).length === 0) {
              spotCount++;
            }
          }
          console.log("SPOTS", spotCount);          
    
          const day = {
            ...state.days[dayID],
            spots: spotCount
          }
            days[dayID] = day;
          
          console.log("REDUCER");
        return {...state, appointments: appointments, days: days}
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  useEffect(() => {
    // socket.send("ping");
    socket.onmessage = event => {
      console.log(`Message Received: ${event.data}`);
      let parsedMessage = JSON.parse(event.data);

      console.log(parsedMessage);
      if (parsedMessage.type === SET_INTERVIEW) {
        console.log("HELLO THIS IS SERVER MESSAGE");
        dispatch({ type: SET_INTERVIEW, interview: parsedMessage.interview, id: parsedMessage.id});
      }
    }
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      dispatch({ type: SET_APPLICATION_DATA, days: all[0].data, appointments: all[1].data, interviewers: all[2].data});
    });
  },[]);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    // const dayID = getDayID();
    // let currentSpots = state.days[dayID].spots;
    // currentSpots--;

    // const day = {
    //   ...state.days[dayID],
    //   spots: currentSpots
    // }

    // const days = [ ...state.days ]
    // if (!state.appointments[id].interview) {
    //   days[dayID] = day;
    // }

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
    .then(
      dispatch({ type: SET_INTERVIEW, interview, id})
    );
  };

  function cancelInterview(id, interview = null) {
    // const appointment = {
    //   ...state.appointments[id],
    //   interview: null
    // };

    // const appointments = {
    //   ...state.appointments,
    //   [id]: appointment
    // };

    // const dayID = getDayID();
    // let currentSpots = state.days[dayID].spots;
    // currentSpots++;

    // const day = {
    //   ...state.days[dayID],
    //   spots: currentSpots
    // }

    // const days = [ ...state.days ]
    // days[dayID] = day;

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(
      dispatch({ type: SET_INTERVIEW, interview, id})
    );
  };

  return ({
    state: state,
    setDay: day => dispatch({ type: SET_DAY, day }),
    bookInterview: bookInterview,
    cancelInterview: cancelInterview
  });
}