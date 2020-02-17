import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {

  const dayItems = function(props) {
    let dayItems = [];

    for (let day of props.days) {
      dayItems.push(
        <DayListItem 
        name={day.name} 
        spots={day.spots} 
        selected={day.name === props.day}
        setDay={props.setDay}  />
      );
    }
    return dayItems;
  }
  
  return  <ul>{dayItems(props)}</ul>;
};