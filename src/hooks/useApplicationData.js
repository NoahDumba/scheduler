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

  function getDayID(state) {
    let dayID;
    for (let day of state.days) { //looping through the days
      if (day.name === state.day) { //checking if day is equal to state.day
        dayID = day.id;
      }
    }

    return dayID - 1;
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

          const appointment = {
            ...state.appointments[id],
            interview: { ...interview }
          };
      
          const appointments = {
            ...state.appointments,
            [id]: appointment
          };

          const days = [ ...state.days ];
          const dayID = getDayID(state);
          
          if (!state.appointments[id].interview && interview) {

            let currentSpots = state.days[dayID].spots;
            currentSpots--;
      
            const day = {
            ...state.days[dayID],
            spots: currentSpots
          }
            days[dayID] = day;

          } else if (state.appointments[id].interview && !interview) {

            let currentSpots = state.days[dayID].spots;
            currentSpots++;
      
            const day = {
            ...state.days[dayID],
            spots: currentSpots
          }
            days[dayID] = day;
          }

        return {...state, appointments: appointments, days: days}
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  useEffect(() => {
    socket.send("ping");
    socket.onmessage = event => {
      console.log(`Message Received: ${event.data}`);
      let parsedMessage = JSON.parse(event.data);

      console.log(parsedMessage);
      if (parsedMessage.type === SET_INTERVIEW) {
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