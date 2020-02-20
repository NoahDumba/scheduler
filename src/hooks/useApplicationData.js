import React, { useState, useEffect } from "react";

const axios = require('axios').default;

export default function useApplicationData() {

  const [state, setState] = useState({
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
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
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

    return axios.put(`http://localhost:8001/api/appointments/${id}`, appointment)
    .then(
      setState({
        ...state,
        appointments
      })
    );
  };

  function cancelInterview(id) {
    setState({
      ...state,
      ...state.appointments[id],
      interview: null
    });

    return axios.delete(`http://localhost:8001/api/appointments/${id}`);
  };

  return ({
    state: state,
    setDay: day => setState({ ...state, day }),
    bookInterview: bookInterview,
    cancelInterview: cancelInterview
  });
}