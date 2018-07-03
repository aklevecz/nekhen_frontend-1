import React from 'react';
import { graphql,compose } from 'react-apollo';
import gql from 'graphql-tag';
import SpotifyFrame from '../components/SpotifyFrame';
import Listing from '../components/Listing';
import isAuthenticated from '../isAuthenticated';

const path = 'http://nekhen.net/yaejirain?';


class Home extends React.Component {
  state = {
    spotifyUri:''
  }
  
  goToChannel = (e, artist, venue, date) => {
    this.props.history.push(`/chatter/${e}/${artist.replace(/ /g,'_')}-${venue.replace(/ /g,'_')}-${date}`);
  }

  closeFrame = () => {
    this.setState({spotifyUri:null});
  }
  playMusic = (uri) => {
    this.setState({spotifyUri:uri});
  }

  render(){
    const { data: { loading, allChannels } } = this.props;
    console.log('render')
    console.log(allChannels);  
    return loading ? null : (
      <div style={{display:'flex',minHeight:'100vh',flexDirection:'column'}}>
        <div 
        style={{
                color:"white",
                cursor:"pointer",
                textAlign:"center",
                height:"100px",
                width:"300px",
                maxWidth:"600px",
                margin:"0 auto",
                lineHeight:"77px",
                fontSize:"40px",
                border:"10px #F4134F solid",
                backgroundColor:"darkblue",
              marginBottom:"40px",
              marginTop:"40px"}}
        onClick={async ()=>{
          if (isAuthenticated()){
            const lemon = await this.props.start({variables:{username:"authorized"}});
            const {uuid} = lemon.data.startGame;
            window.location=path+uuid;
            } else {
              const nonAuth = prompt("You may either register a user(press cancel) or just type in a name :)");
              console.log(nonAuth);
              if (nonAuth === null || ""){
                this.props.history.push("/register");
              } else {
                const lemon = await this.props.start({variables:{username:nonAuth}});
                const {uuid} = lemon.data.startGame;
                window.location=path+uuid;
              }
            }
          }
        }
          >PLAY YAEJI</div>


        <Listing goToChannel={this.goToChannel} allChannels={allChannels} playMusic={this.playMusic}/>
        {this.state.spotifyUri && <SpotifyFrame closeFrame={this.closeFrame} uri={this.state.spotifyUri} />}
      </div>
    ); 
  }
}

const startGameMutation = gql`
  mutation($username:String) {
    startGame(username:$username){
      uuid
    }
  }
`;

const allChannelsQuery = gql`
{
  allChannels{
    id
    venue
    date
    artist
    spotifyuri
    tickets
  }
}
`;

export default compose(graphql(allChannelsQuery),graphql(startGameMutation,{name:"start"}))(Home);
//export default graphql(allChannelsQuery)(Home);

