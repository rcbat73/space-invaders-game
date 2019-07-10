import React from 'react';
import styled from 'styled-components';


const Player = styled.div`
  height: ${(props) => props.height}px;
	width: ${(props) => props.width}px;
  background-size: ${(props) => props.width}px ${(props) => props.height}px;
  background-image: url('https://cdn.pixabay.com/photo/2016/05/25/13/33/ship-1414820_960_720.png');
  position: absolute;
  left: ${(props) => props.xIni}px;
  top: ${(props) => props.yIni}px;
  transform: translate(${(props) => props.x}px, ${(props) => props.y}px);
`;

export default Player;