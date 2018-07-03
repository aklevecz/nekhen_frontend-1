import React from 'react';

const DateVG = ({DateObj}) => {
    let [month, day] = DateObj.split('-');
    if (day.length===1) day =`0${day}`
    
    const desk = (window.innerWidth < 784) ? false : true;

      return (
        <div style={{display:"grid",gridAutoRows:"56px",
        gridTemplateColumns:desk ? "1fr 100px 312px 10% 10% 1fr" : "26% 1fr 23%",
        lineHeight:"59px"}}>
        <div style={{gridColumn:2,
                    textAlign:desk ? "right" : "center",
                      fontFamily:"Condor-Regular-Bold",
                      fontSize:desk ? "40px" : "30px",
                      color:"white",letterSpacing:"6px",
                      borderBottom:"2px white solid"}}>
          {month} {day}
          </div>
        </div>
      );
  }

  export default DateVG;