import React from 'react';
import ReactDOM from 'react-dom';
import { FaVolumeUp, FaVolumeOff } from 'react-icons/fa';
import styled from 'styled-components';
import cnt from './helpers/Constants.js';
import Game from './components/Game.js';
import DisplayScreen from './components/DisplayScreen.js';
import PlayButtonWrapper from './components/PlayButtonWrapper.js';
import './index.css';

const Container = styled.div`
	width: 100%; 
	height: 100%; 
	margin: 0; 
	padding: 0;
`;

//App title 
const GameHeader = styled.div`
  height: ${(props) => props.height}px;
	width: ${(props) => props.width}px;
  font-weight: bold;
  font-size: 2em;
  text-align: center;
  color: #ffffff;
`;

const Score = styled.div`
  height: ${(props) => props.height}px;
	width: ${cnt.GAME_WIDTH}px;
  font-weight: bold;
  padding-bottom: 40px;
  padding-top: 10px;
  text-align: center;
  font-size: 0.8em;
  color: #ffffff;
`;

//Toggle mute audio
const VolumeControl = styled.div`
    height: 15px;
    width: 15px;
    font-size: 14px;
    background-color: rgba(0,0,0,0.6);
    border-radius: 6px;
    padding: 6px;
    color: white;
    margin: 0 auto;
    &:hover {
        background-color: rgba(0,0,0,0.9);
    }
`;

//How to play
const GameHelp = styled.div`
  margin: 5px;
  padding 5px;
  color: yellow;
  font-size: 1em;
  font-weight: bold;
  text-align: center;  
`;

const GameContainer = styled.div`
  height: ${(props) => props.height}px;
	width: ${(props) => props.width}px;
  margin: 0 auto;
  position: relative;
`;

const AppContainer = styled.div`
  height: 100%;
	width: 100%;
  background-image: linear-gradient(-45deg, rgba(45,105,255,1), rgba(0,0,0,1));  
  background-repeat: no-repeat;
  
  display: flex;
	justify-content: center;
	align-items: center;
  flex-direction: column;
`;

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      start: false,
      ended: false,
      score: 0,
      btnText: cnt.BTN_PLAY_LABEL,
      muted: localStorage.getItem('muted') === 'true' || false
    };
    
    this.setGameStatus = this.setGameStatus.bind(this);
    this.setScore = this.setScore.bind(this);
  }
  
  
  setGameStatus(status){    
    this.setState({
      start: true,
      ended: status,
      score: status ? this.state.score : 0,
      btnText: status ? cnt.BTN_AGAIN_LABEL : cnt.BTN_PLAY_LABEL     
    }); 
    
  }

  toggleMute(muted) {
    this.setState({ muted });
    localStorage.setItem('muted', muted);
  }
  
  setScore(){
    this.setState({score: this.state.score + 1});
  }
  
  renderIni(gameStatus){
    let result = this.state.score === cnt.NUM_ALIEN  * cnt.ALIEN_VALUE ? cnt.GAME_WIN : "";    
    return <div>
              {
                !gameStatus ?
                 (<DisplayScreen width={cnt.GAME_WIDTH} height={cnt.GAME_HEIGHT}>
                    <GameHeader>{cnt.GAME_NAME}</GameHeader>
                    <GameHelp>{cnt.GAME_HELP}</GameHelp>
                    <PlayButtonWrapper gameStatus={this.setGameStatus} label={this.state.btnText}/>
                 </DisplayScreen>) :
                 (<DisplayScreen width={cnt.GAME_WIDTH} height={cnt.GAME_HEIGHT}>
                    <GameHeader>{cnt.GAME_OVER}</GameHeader>
                    <Score>{`${cnt.SCORE}${this.state.score} ${result}`}</Score>
                    <PlayButtonWrapper gameStatus={this.setGameStatus} label={this.state.btnText}/>
                 </DisplayScreen>)
              }
              
           </div>;
  }
  
  render(){
    return (
	<Container>
      <AppContainer>
        <GameContainer width={cnt.GAME_WIDTH} height={cnt.GAME_HEIGHT}>
          {
              this.state.start && !this.state.ended?
                (<div>
                  <VolumeControl>
                    {this.state.muted ? 
                        <FaVolumeOff onClick={() => this.toggleMute(false)} />
                      : <FaVolumeUp onClick={() => this.toggleMute(true)} />
                    }
                  </VolumeControl>
                  <Score size={0.8}>{`${cnt.SCORE}${this.state.score}`}</Score>                  
                  <Game gameStatus={this.setGameStatus} score={this.setScore} muted={this.state.muted}/> 
                </div>):
                this.renderIni(this.state.start)
          }        
        </GameContainer>
      </AppContainer>
	</Container>
    );
  }
}

ReactDOM.render(<App/>,
    document.getElementById('root')
);