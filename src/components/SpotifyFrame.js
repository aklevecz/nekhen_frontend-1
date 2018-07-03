import React from 'react';
const SpotifyFrame = ({uri, closeFrame}) => {
    console.log(closeFrame);
    const height = window.innerHeight;
    const width = window.innerWidth;
    let desk = false;
    if (width>height){
      desk = true;
    } 
    const WrapperStyles = {
        position: 'fixed',
        right: 0,
        bottom: 0,
        border: '4px #52C3D0 solid',
        width: desk ? '20%': '100%',
        height:  desk? '300px':'290px',
    }

    const iFrameStyles = {
        height:  desk? '300px':'290px',
        width:'100%'
    }

    const CloserStyles = {
        position:'absolute',
        color:'#52C3D0',
        cursor:'pointer',
        fontFamily:"Lato",
        padding:'-6%',
        fontSize:'20px',
        fontWeight:900,
        backgroundColor:'#EC5043',
        height:'26px',
        width:'23px'
    }

  return (
      <div style={WrapperStyles}>
      <div style={CloserStyles}
           onClick={()=>closeFrame()}><span style={{padding:'4px',lineHeight:'24px'}}>X</span></div>
  <iframe 
src={"https://open.spotify.com/embed/artist/"+uri} style={iFrameStyles} frameBorder="0" title="player" allowtransparency="true" allow="encrypted-media"></iframe>
</div>
  );
}

export default SpotifyFrame;