import React, { useState, useEffect } from "react";
import Appointment from "components/Appointment";
import "components/Application.scss";
import DayList from "components/DayList";
import getAppointmentsForDay, { getInterview, getInterviewersForDay } from "../helpers/selectors";

const axios = require('axios').default;

export default function Application(props) {

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });


  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data}));
    });
  },[])

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
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    return axios.delete(`http://localhost:8001/api/appointments/${id}`);
  }

  return (
    <main className="layout">
      <section className="sidebar">
      <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
      {
        getAppointmentsForDay(state, state.day).map(appointment => {
          const interview = getInterview(state, appointment.interview);
          const interviewers = getInterviewersForDay(state, state.day)
          return (
            <Appointment key={appointment.id} interview={interview} interviewers={interviewers} bookInterview={bookInterview} cancelInterview={cancelInterview} id={appointment.id} time={appointment.time} />
          );
        })
      }
      { <Appointment key="last" time="5pm" /> }
      </section>
    </main>
  );
}
