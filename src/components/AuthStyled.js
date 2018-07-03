import styled from 'styled-components';

export const AuthHeader = styled.div`
    font-family: Fit;
    font-size: 100px;
    text-align: center;
    line-height: 1.5;
    color: white;
`

export const AuthLayout = styled.div`
  display: grid;
  height: '100vh';
  grid-template-columns:'20% 1fr 1fr 20%';
  grid-template-rows: 150px 1fr auto auto;
`;

export const GoButton = styled.div`
  color:#E6428C;
  font-family:InputSans;
  font-size:48.5414px;
  cursor:pointer;
  margin:0 auto;
  background-color:#2d2d2d;
  height:70px;
  width:161px;
  text-align:center;
  line-height: 60px;
  margin-top:22px;
`;