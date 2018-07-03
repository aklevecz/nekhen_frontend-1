import styled from 'styled-components';

let desk = true;
if (window.innerWidth < window.innerHeight) desk=false;

export default styled.div`
  display: grid;
  height: ${desk ? '100vh' : '90vh'}    ;
  grid-template-columns:${desk ? '20% 1fr 1fr 20%' : '0% 1fr 1fr 0%'};
  grid-template-rows: 50px 1fr auto;
`;
