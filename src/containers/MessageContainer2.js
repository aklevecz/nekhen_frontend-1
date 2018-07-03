import React from 'react';
import { graphql,compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Comment } from 'semantic-ui-react';
import decode from 'jwt-decode';


import FileUpload from '../components/FileUpload';
import RenderText from '../components/RenderText';

import EventSendMessage from '../components/EventSendMessage';

import EventLayout from '../components/EventLayout';

const newChannelMessageSubscription = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
      created_at
    }
  }
`;

const Message = ({ message: { url, text, filetype } }) => {
  if (url) {
    if (filetype.startsWith('image/')) {
      return <div><img width="300" src={url} alt=""/></div>;
    } else if (filetype === 'text/plain') {
      return <RenderText url={url} />;
    } else if (filetype.startsWith('audio/')) {
      return (
        <div>
          <audio controls>
            <source src={url} type={filetype} />
          </audio>
        </div>
      );
    }
  }
  return <Comment.Text style={{color:"white"}}>{text}</Comment.Text>;
};

//Container is changed to take in match params instead of normal props
class MessageContainer extends React.Component {
  state = {
    hasMoreItems: true,
    username:decode(localStorage.getItem('token')).user.username,
  };

  componentWillMount() {    
      console.log(this.props.match.params);
    this.unsubscribe = this.subscribe(this.props.match.params.channelId);
  }

  componentWillReceiveProps({ data: { messages }, channelId }) {
      console.log(this.props);
      console.log('receive props');
    if (this.props.channelId !== channelId) {
      if (this.unsubscribe) {
          console.log('unsub')
        this.unsubscribe();
      }
      this.unsubscribe = this.subscribe(channelId);
    }

    if (
      this.scroller &&
      this.scroller.scrollTop < 20 &&
      this.props.data.messages &&
      messages &&
      this.props.data.messages.length !== messages.length
    ) {
      // 35 items
      const heightBeforeRender = this.scroller.scrollHeight;
      // wait for 70 items to render
      setTimeout(() => {
        if (this.scroller) {
          this.scroller.scrollTop = this.scroller.scrollHeight - heightBeforeRender;
        }
      }, 120);
    }
  }

  componentWillUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  subscribe = channelId =>
    this.props.data.subscribeToMore({
      document: newChannelMessageSubscription,
      variables: {
        channelId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          messages: [subscriptionData.newChannelMessage, ...prev.messages],
        };
      },
    });

  handleScroll = () => {
    const { data: { messages, fetchMore }, match:{params:{channelId } } } = this.props;    
    if (
      this.scroller &&
      this.scroller.scrollTop < 100 &&
      this.state.hasMoreItems &&
      messages.length >= 35
    ) {
      fetchMore({
        variables: {
          channelId,
          cursor: messages[messages.length - 1].created_at,
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return previousResult;
          }

          if (fetchMoreResult.messages.length < 35) {
            this.setState({ hasMoreItems: false });
          }

          return {
            ...previousResult,
            messages: [...previousResult.messages, ...fetchMoreResult.messages],
          };
        },
      });
    }
  };
  render() {
    const { data: { loading, messages }, match:{params:{channelId } } } = this.props;
    const {username} = this.state
    const {artist, venue, date} = this.props.match.params;
    console.log(messages);
    let last_message = '';
    return loading ? null : (
        <EventLayout>
            <header style={{maxWidth:"850px",
                            backgroundColor:"red",
                            gridColumn:'2 / span 2',
                            textAlign:'center',
                            fontFamily:'Condor-Regular-Bold', 
                            fontSize:"1.5em",
                            paddingTop:"17px"}}>
                {artist.toUpperCase().replace(/_/g, ' ')} @ {venue.toUpperCase().replace(/_/g, ' ')}
            </header>
      <div
      id="chatBox"
        style={{
          gridColumn: window.innerWidth > 650 ? '2 / span 2' : '2 / span 2',
          gridRowStart: 2,
          gridRowEnd:2,
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          flexDirection: 'column-reverse',
          overflowY: 'auto',
          maxWidth: '850px',
          border: "2px red solid",
        }}
        onScroll={this.handleScroll}
        ref={(scroller) => {
          this.scroller = scroller;
        }}
      >
        <FileUpload
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            maxWidth:'850px',
          }}
          channelId={channelId}
          disableClick
        >



          <div style={{fontFamily:'OutputSans-Medium',overflow:"visible",maxWidth:"1850px"}}>
            {messages
              .slice()
              .reverse()
              .map(m => {
                  console.log(last_message, ':last |  user:', m.user.username)
                  let showUsername = true;
                  if(last_message === m.user.username) showUsername = false
                  last_message = m.user.username;
                return (<Comment key={`${m.id}-message`}>
                    <Comment.Content style={{textAlign: m.user.username!==username ? 'left' : 'right',}}>
                    {showUsername && <Comment.Author style={{fontFamily:'Condor-Regular-Bold',
                                            color: m.user.username!==username ? 'red' : 'blue'}} as="a">
                                            {m.user.username}
                    </Comment.Author>}
                    <Comment.Metadata style={{display:'none'}}>
                      <div>{m.created_at}</div>
                    </Comment.Metadata>
                      <Message message={m} />
                  </Comment.Content>
                </Comment>);
                
            })}
          </div>
        </FileUpload>


      </div>
      <EventSendMessage
          channelId={channelId}
          placeholder={`${artist}-${venue}-${date}`}
          onSubmit={async (text) => {
            await this.props.mutate({ variables: { text, channelId: this.props.match.params.channelId } });
          }}
        />
     </EventLayout>
      
    );
  }
}
const createMessageMutation = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

const messagesQuery = gql`
  query($cursor: String, $channelId: Int!) {
    messages(cursor: $cursor, channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
      created_at
    }
  }
`;

export default compose(
graphql(messagesQuery, {
  options: props => ({
    fetchPolicy: 'network-only',
    variables: {
      channelId: props.match.params.channelId,
    },
  }),
}),graphql(createMessageMutation),)(MessageContainer);

