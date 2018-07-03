import React from 'react';
import Lister from './Lister';
import DateVG from './DateVG';
class Listing extends React.Component {
    playMusicHandle = (uri) => {
      this.props.playMusic(uri);
    }
    goToChannelHandle = (d) => {
      this.props.goToChannel(d.id,d.artist,d.venue,d.date);
    }
  
      render(){
      const channels = this.props.allChannels.map((d,i)=> {
        const renderDate = (d.date!=='chicken-chicken') ? true : false;
        const lineOffsets = ((i+1)%2) ? true : false;
        return (
          <div key={'d'+d.id}>
          {renderDate && <DateVG key={d.date} DateObj={d.date}/>}
          <div key={d.id} id={'e'+d.id}  >
                <Lister lineOffsets={lineOffsets} d={d} clickHandler={this.goToChannelHandle} playHandler={this.playMusicHandle}/>
          </div>
          </div>
  
        );
      })
      return channels;
    }
  }

  export default Listing;