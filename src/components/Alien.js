import React from 'react';
import styled from 'styled-components';

const Alien = styled.div.attrs(props => ({
		style: {
			transform:`
				translate(
					${props.x}px, 
					${props.y}px
				)
			`,				
		}
	}))`
	height: ${(props) => props.height}px;
	width: ${(props) => props.width}px;
	background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Twemoji2_1f47d.svg/600px-Twemoji2_1f47d.svg.png');
	background-size: ${(props) => props.width}px ${(props) => props.height}px;
	position: absolute;
	left: ${(props) => props.xIni}px;
	top: ${(props) =>  props.yIni}px;
`;

export default Alien;