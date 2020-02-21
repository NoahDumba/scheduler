import React, { useEffect } from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import Error from "components/Appointment/Error";
import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";


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
    
    if (interviewer) {

    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => 
      transition(SHOW)
    ).catch(() => {
      transition(ERROR_SAVE, true)
    });

    } else {
      console.log("CANT BOOK WITHOUT AN INTERVIEWER");
    }
  };

  function deleteFunc(id) {
    transition(DELETING)

    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY)
    }).catch(() => {
      transition(ERROR_DELETE, true)
    });
  }

  function confirm() {
    transition(CONFIRM)
  }

  function edit() {
    transition(EDIT)
  }

  // let interviewers = getInterviewersForDay(props.state, props.day)

  useEffect(() => {
    if (props.interview && mode === EMPTY) {
     transition(SHOW);
    }
    if (props.interview === null && mode === SHOW) {
     transition(EMPTY);
    }
   }, [props.interview, transition, mode]);

  return (
  <article className="appointment">
    <Header
      time={props.time}
    />
    {mode === EMPTY && <Empty onAdd={onAdd} />}
    {mode === SHOW && props.interview && (
      <Show
        student={props.interview.student}
        interviewer={props.interview.interviewer}
        onDelete={confirm}
        onEdit={edit}
      />
    )}
    {mode === CREATE && (
      <Form interviewers={props.interviewers} onSave={save} onCancel={onCancel}/>
    )}
    {mode === SAVING && <Status message={"Saving"} />}
    {mode === DELETING && <Status message={"Deleting"} />}
    {mode === CONFIRM && <Confirm message={"Are you sure you want to delete?"} onConfirm={deleteFunc} onCancel={onCancel} />}
    {mode === EDIT && (
      <Form name={props.interview.student} interviewers={props.interviewers} interviewer={props.interview.interviewer.id} onSave={save} onCancel={onCancel}/>
    )}
    {mode === ERROR_DELETE && (<Error message="Error while deleting" onClose={onCancel}/>)}
    {mode === ERROR_SAVE && (<Error message="Error while saving" onClose={onCancel}/>)}
  </article>
  )
};