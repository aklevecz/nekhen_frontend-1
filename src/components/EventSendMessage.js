import React from 'react';
import styled from 'styled-components';
import { withFormik } from 'formik';

import FileUpload from './FileUpload';

const SendMessageWrapper = styled.div`
  grid-column: ${window.innerWidth > 650 ? '2 / span 2' : '1 / -1'};
  grid-row: 3;
  padding: 20px;
  display: grid;
  grid-template-columns: 32px auto;
  font-family: InputSans; 
  max-width:850px;
  contenteditabl:true;
`;

const ENTER_KEY = 13;

const SendMessage = ({
  placeholder,
  values,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
  channelId,
}) => (
  <SendMessageWrapper>
    <FileUpload channelId={channelId} style={{cursor:"pointer",backgroundColor:"blue",marginBottom:"3px",marginRight:"5px",color:'red',textAlign:'center',lineHeight:'20px'}}>
        +
    </FileUpload>
    <input style={{fontFamily:"InputSans",marginLeft:"2px",height:"27px",border:"none",borderBottom:"3px solid black",outline:"none"}}
      onKeyDown={(e) => {
        if (e.keyCode === ENTER_KEY && !isSubmitting) {
          handleSubmit(e);
        }
      }}
      onChange={handleChange}
      onBlur={handleBlur}
      name="message"
      value={values.message}
    />
  </SendMessageWrapper>
);

export default withFormik({
  mapPropsToValues: () => ({ message: '' }),
  handleSubmit: async (values, { props: { onSubmit }, setSubmitting, resetForm }) => {
    if (!values.message || !values.message.trim()) {
      setSubmitting(false);
      return;
    }

    await onSubmit(values.message);
    resetForm(false);
  },
})(SendMessage);
