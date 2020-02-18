export default function getAppointmentsForDay(state, day) {
  let appointmentsArr = [];
  for (let element of state.days) {
    if (element.name === day) {appointmentsArr = element.appointments};
  };
  
  let finalArr = [];
  for (let index of appointmentsArr) {
    finalArr.push(state.appointments[index]);
  }

  return finalArr;
};

export function getInterview(state, interview) {
  if(!interview) { return null; };

  for (let stateInterviewer in state.interviewers) {
    if (interview.interviewer === Number(stateInterviewer)) {
      interview.interviewer = state.interviewers[stateInterviewer];
    }
  }

  return interview;
};