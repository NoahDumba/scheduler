import React, { useReducer, useEffect } from "react";

const axios = require('axios').default;

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  
  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return { ...state, day: action.day }
      case SET_APPLICATION_DATA:
        return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
      case SET_INTERVIEW: 
        return {...state, appointments: action.appointments, days: action.days}
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }

  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
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

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayID = getDayID();
    let currentSpots = state.days[dayID].spots;
    currentSpots--;

    const day = {
      ...state.days[dayID],
      spots: currentSpots
    }

    const days = [ ...state.days ]
    if (!state.appointments[id].interview) {
      days[dayID] = day;
    }

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
    .then(
      dispatch({ type: SET_INTERVIEW, appointments, days})
    );
  };

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayID = getDayID();
    let currentSpots = state.days[dayID].spots;
    currentSpots++;

    const day = {
      ...state.days[dayID],
      spots: currentSpots
    }

    const days = [ ...state.days ]
    days[dayID] = day;

    return axios.delete(`http://localhost:8001/api/appointments/${id}`)
    .then(
      dispatch({ type: SET_INTERVIEW, appointments, days})
    );
  };

  function getDayID() {
    let dayID;
    for (let day of state.days) { //looping through the days
      if (day.name === state.day) { //checking if day is equal to state.day
        dayID = day.id;
      }
    }

    return dayID - 1;
  }

  return ({
    state: state,
    setDay: day => dispatch({ type: SET_DAY, day }),
    bookInterview: bookInterview,
    cancelInterview: cancelInterview
  });
}