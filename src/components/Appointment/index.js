import React from "react";
import "components/Appointment/styles.scss";
import Header from "components/Appointment/Header";
import Show from "components/Appointment/Show";
import Empty from "components/Appointment/Empty";
import Form from "components/Appointment/Form";
import Status from "components/Appointment/Status";
import Confirm from "components/Appointment/Confirm";
import useVisualMode from "../../hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";


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

    transition(SAVING);
    props.bookInterview(props.id, interview)
    .then(() => 
      transition(SHOW)
    );
  };

  function deleteFunc(id) {
    transition(DELETING)

    props.cancelInterview(props.id)
    .then(() => {
      transition(EMPTY)
    });
  }

  function confirm() {
    transition(CONFIRM)
  }

  function edit() {
    transition(EDIT)
  }

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
  </article>
  )
};