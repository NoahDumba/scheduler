import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import useVisualMode from "../../hooks/useVisualMode";
import getAppointmentsForDay, { getInterviewersForDay } from "../../helpers/selectors";

const axios = require('axios').default;
// const classNames = require('classnames');
const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const STATUS = "STATUS";


export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function onAdd() {
    transition(CREATE);
  };

  function onCancel() {
    back();
  };

  function save(name, interviewer) {
    // let ID = props.id;
    const interview = {
      student: name,
      interviewer
    };

    transition(STATUS);
    props.bookInterview(props.id, interview)
    .then(() => 
      transition(SHOW)
    );
  
  };

  // let interviewers = getInterviewersForDay(props.state, props.day)

  return (
  <article className="appointment">
    <Header
      time={props.time}
    />
    {mode === EMPTY && <Empty onAdd={onAdd} />}
    {mode === SHOW && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
      />
    )}
    {mode === CREATE && (
      <Form interviewers={props.interviewers} onSave={save} onCancel={onCancel}/>
    )}
    {mode === STATUS && <Status message={"Saving"} />}
  </article>
  )
};