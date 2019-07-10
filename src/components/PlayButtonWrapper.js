import React from 'react';
import styled from 'styled-components';

const PlayButton = styled.button`
  border: none;
  background-color: rgba(0,0,0,0.7);
  margin: 10px;
  padding: 0px;
  width: 150px;
  height: 40px;
  color: white;
  font-weight: bold;
  border-radius: 20px;
  border: 4px solid white;
  &:hover{
    background-color: rgba(0,0,0,0.4);
  }  
`;

class PlayButtonWrapper extends React.Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <PlayButton onClick={() => this.props.gameStatus(false)}>{this.props.label}</PlayButton>
    );
  }
}

export default PlayButtonWrapper;