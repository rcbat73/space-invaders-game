import React from 'react';
import styled from 'styled-components';


const DisplayScreen = styled.div`
  height: ${(props) => props.height}px;
	width: ${(props) => props.width}px;
  border-radius: 6px;
  display: flex;
	justify-content: center;
	align-items: center;
  flex-direction: column;
`;

export default DisplayScreen;