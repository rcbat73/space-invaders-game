import React from 'react';
import styled from 'styled-components';

const LaserShot = styled.div.attrs(props => ({
		style: {
			transform:`
				translate(
					${props.x}px, 
					${props.y}px
				)
			`,				
		}
	}))`
	height: 10px;
	width: 10px;
	background-color: #0000ff00;
	background-image: radial-gradient(red 3%, yellow 60%, rgba(0,255,0,0) 70%);  
	border-radius: 50%;
	position: absolute;
	left: ${(props) => props.xIni}px;
	top: ${(props) =>  props.yIni}px;
`;

export default LaserShot;