import { useReducer, useEffect } from "react";
import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

const socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
const axios = require('axios').default;

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  useEffect(() => {
    socket.onmessage = event => {
      let parsedMessage = JSON.parse(event.data);

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

    return axios.put(`/api/appointments/${id}`, appointment)
    .then(() =>
      dispatch({ type: SET_INTERVIEW, interview, id})
    );
  };

  function cancelInterview(id, interview = null) {
    return axios.delete(`/api/appointments/${id}`)
    .then(() =>
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