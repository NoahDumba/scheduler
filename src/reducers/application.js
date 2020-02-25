export const SET_DAY = "SET_DAY";
export const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
export const SET_INTERVIEW = "SET_INTERVIEW";

export default function reducer(state, action) {
  function getDayID(state, id) {
    for (let day of state.days) { //looping through the days
      if (day.appointments.includes(id)) {
        return day.id - 1;
      }
    }
  }

  switch (action.type) {
    case SET_DAY:
      return { ...state, day: action.day }
    case SET_APPLICATION_DATA:
      return { ...state, days: action.days, appointments: action.appointments, interviewers: action.interviewers }
    case SET_INTERVIEW:

        const interview = action.interview
        const id = action.id
        const dayID = getDayID(state, id);

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
          if (!currentAppointment.interview || Object.keys(currentAppointment.interview).length === 0) {
            spotCount++;
          }
        }

        const day = {
          ...state.days[dayID],
          spots: spotCount
        }
          days[dayID] = day;

      return {...state, appointments: appointments, days: days}
    default:
      throw new Error(
        `Tried to reduce with unsupported action type: ${action.type}`
      );
  }
}