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

export function getInterviewersForDay(state, day) {
  let manta = [];
  if(state.days.length === 0) {
    return manta;
  };

  let interviewersArr = [];
  for (let element of state.days) {
    if (element.name === day) {
      interviewersArr = element.interviewers
    };
  };

  for (let index of interviewersArr) {
    manta.push(state.interviewers[index]);
  }

  return manta;
};

export function getInterview(state, interviewor) {
  let interview = {...interviewor};
  if(Object.keys(interview).length === 0) {
     return null; 
    };

  for (let stateInterviewer in state.interviewers) {
    if (interview.interviewer === Number(stateInterviewer)) {
      interview.interviewer = state.interviewers[stateInterviewer];
    }
  }

  return interview;
};