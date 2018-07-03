import React from 'react';
import { Checkbox, Form, Input, Button, Modal } from 'semantic-ui-react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';

import { meQuery } from '../graphql/team';
import MultiSelectUsers from './MultiSelectUsers';


import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';

class DateMen extends React.Component {
  constructor(props){
    super(props);
    const daMoment = moment();
  this.state = {
    startDate: daMoment
  }
  this.props.onDateChange(daMoment);
}

  handleDateChange = (date) =>{
    this.setState({startDate:date});
    this.props.onDateChange(date);
  }

  render(){
    return <DatePicker 
    selected={this.state.startDate} onChange={this.handleDateChange} />
  }
}
const AddChannelModal = ({
  open,
  onClose,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
  teamId,
  currentUserId,
  teamName,
}) => {

  return (
  <Modal
    open={open}
    onClose={(e) => {
      resetForm();
      onClose(e);
    }}
  >
    <Modal.Header>Add Channel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.venue}
            onChange={handleChange}
            onBlur={handleBlur}
            name="venue"
            fluid
            placeholder="Channel name"
          />
        </Form.Field>
        <Form.Field>
          <Input
            value={values.tickets}
            onChange={handleChange}
            onBlur={handleBlur}
            name="tickets"
            fluid
            placeholder="ticket link"
          />
        </Form.Field>
        <Form.Field>
          <DateMen value={values.date_test} onDateChange={(e)=> setFieldValue('date', e) }
          />
        </Form.Field>
        <Form.Field>
          <Checkbox
            checked={!values.public}
            label="Private"
            onChange={(e, { checked }) => setFieldValue('public', !checked)}
            toggle
          />
        </Form.Field>
        {values.public ? null : (
          <Form.Field>
            <MultiSelectUsers
              value={values.members}
              handleChange={(e, { value }) => setFieldValue('members', value)}
              teamId={teamId}
              placeholder="select members to invite"
              currentUserId={currentUserId}
            />
          </Form.Field>
        )}
        <Form.Group widths="equal">
          <Button
            disabled={isSubmitting}
            fluid
            onClick={(e) => {
              resetForm();
              onClose(e);
            }}
          >
            Cancel
          </Button>
          <Button disabled={isSubmitting} onClick={handleSubmit} fluid>
            Create Channel
          </Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);
};

const createChannelMutation = gql`
  mutation($teamId: Int!, $name: String!, $artist: String, $date: String, $venue: String, $tickets: String, $public: Boolean, $members: [Int!]) {
    createChannel(teamId: $teamId, name: $name, venue: $venue, tickets: $tickets, artist: $artist, date: $date, public: $public, members: $members) {
      ok
      channel {
        id
        name
        dm
      }
    }
  }
`;

export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ public: true,tickets:'', name: '', venue: '', date:'', members: [] }),
    handleSubmit: async (values, { props: { onClose, teamId, mutate, teamName }, setSubmitting }) => {
      await mutate({
        variables: {
          teamId,
          tickets: values.tickets,
          artist: teamName,
          name: values.venue + '-' + new Date(values.date).toLocaleString("en-US").split(',')[0],
          date: values.date.format("YYYY-MM-DD"),
          venue: values.venue,
          public: values.public,
          members: values.members,
        },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: -1,
              name: values.name,
              dm: false,
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) {
            return;
          }

          const data = store.readQuery({ query: meQuery });
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          data.me.teams[teamIdx].channels.push(channel);
          store.writeQuery({ query: meQuery, data });
        },
      });
      onClose();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);