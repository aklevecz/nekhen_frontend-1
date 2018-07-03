import React from 'react';

const Lister = ({lineOffsets, d, clickHandler, playHandler}) => {
    const desk = (window.innerWidth < 784) ? false : true;
    return (
        <div style={{display:"grid",
                    gridTemplateColumns:desk ? "1fr 150px 312px 10% 10% 1fr" : "0% 47% 23% 15% 15%",
                    gridAutoRows:"100px",
                    }}>
            <div style={{gridColumn:desk ? 3 : "2/span 2",
                fontSize: desk ? "22px" : "15px",
                padding: desk ? "15px" : "28px",
                fontFamily:'KRSNATrial-Medium',
                }}>
                <p style={{color:"#F7064B"}}>{d.artist.toUpperCase()}</p>
                <p style={{color:"white",marginTop:"-16px",marginLeft:"10px"}}>{d.venue.toUpperCase()}</p>
            </div>
            {/* this is so janky*/}
            <div style={{gridColumn:desk ? 4 : 4}} onClick={()=>clickHandler(d)}>
                <ChatBox/>
            </div>
            
            <div style={{gridColumn:desk ? 5 : 5}} onClick={()=>playHandler(d.spotifyuri)}>
                <Note />
            </div> 
            {desk && <div style={{gridColumn: 5}}/>}
        </div>
    );
  };

  export default Lister;

  const ChatBox = () => (
    <svg width="75px" height="67px" viewBox="0 0 150 67" style={{marginTop:"16px"}}>
        <g id="chatBox_1_">
            <g>
                <path fill="#FFFFFF" d="M36.9,60.7c-0.4,0-0.8,0-1.3,0c-0.7-0.7-1.5-1.4-2.1-2.1c-2.2-2.7-4.4-5.3-6.6-8.1c-0.5-0.6-1-0.8-1.8-0.8
                c-3.9,0-7.8,0-11.7,0c-3.5,0-5.2-1.7-5.2-5.2c0-11.2,0-22.4,0-33.6c0-2.9,1.5-4.5,4.4-4.5c16.7,0,33.3,0,50,0
                c2.7,0,4.2,1.5,4.2,4.1c0,3.6,0,7.2,0,10.8c0,7.7,0,15.5,0,23.2c0,3.7-1.4,5.2-5.1,5.2c-4.7,0-9.3,0-14,0c-1,0-1.7,0.3-2.3,1.1
                c-2.1,2.7-4.3,5.5-6.5,8.1C38.4,59.6,37.6,60.1,36.9,60.7z M61.6,44.6c0-11.2,0-22.2,0-33.1c-16.2,0-32.2,0-48.3,0
                c0,11.1,0,22,0,33.1c0.5,0,1,0,1.5,0c3.7,0,7.4,0.1,11,0c2.1-0.1,3.4,0.7,4.6,2.3c1.9,2.4,3.9,4.8,5.9,7.3
                c2.2-2.8,4.4-5.4,6.5-8.1c0.7-1,1.6-1.4,2.8-1.4c3.8,0.1,7.5,0,11.3,0C58.5,44.6,60,44.6,61.6,44.6z"/>
                <path fill="#FFFFFF" d="M27.4,30.3c-1.4,0-2.5-1.1-2.5-2.5c0-1.4,1.1-2.4,2.5-2.4c1.4,0,2.6,1.2,2.5,2.6
                C29.9,29.3,28.8,30.3,27.4,30.3z"/>
                <path fill="#FFFFFF" d="M37.7,30.3c-1.4,0-2.5-1-2.6-2.4c-0.1-1.4,1-2.5,2.4-2.6c1.5-0.1,2.6,1,2.6,2.5
                C40.2,29.2,39.1,30.3,37.7,30.3z"/>
                <path fill="#FFFFFF" d="M47.8,25.3c1.4,0,2.5,1,2.5,2.4c0,1.4-1.1,2.6-2.5,2.5c-1.4,0-2.5-1.1-2.5-2.5
                C45.3,26.4,46.4,25.3,47.8,25.3z"/>
            </g>
        </g>
    </svg>
  );

const Note = () => (
    <svg width="75px" height="67px" viewBox="0 0 150 67" style={{marginTop:"19px"}}>
        <g id="musicNote_1_">
            <circle fill="none" stroke="#FFFFFF" strokeWidth="5" strokeMiterlimit="10" cx="21.9" cy="55.7" r="6.9"/>
            <circle fill="none" stroke="#FFFFFF" strokeWidth="5" strokeMiterlimit="10" cx="53.1" cy="29.7" r="6.9"/>
            <polyline fill="none" stroke="#FFFFFF" strokeWidth="5" strokeMiterlimit="10" points="28.7,57.7 28.7,4.5 60,4.5 60,30.4 	"/>
            <line fill="none" stroke="#FFFFFF" strokeWidth="5" strokeMiterlimit="10" x1="28.7" y1="5.4" x2="60" y2="5.4"/>
        </g>
    </svg>
);