import React from 'react';
import styled from 'styled-components';
import cnt from '../helpers/Constants.js';
import Player from './Player.js';
import Alien from './Alien.js';
import LaserShot from './LaserShot.js';
import DisplayScreen from './DisplayScreen.js';
import Sound from '../helpers/Sound.js';
import laserAudio from '../assets/laser.mp3';
import explosionAudio from '../assets/laser.mp3';

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = this.iniState(false);     
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.animationID = null; 
    this.ended = false;
  }
  
  iniState(){
    return {
      aliens: this.createAliens(),
      player: { 
        x: cnt.PLAYER_POS_X, 
        y: cnt.PLAYER_POS_Y,
        xIni: 0,
        yIni: 0,
        width: cnt.CANNON_WIDTH,
        height: cnt.CANNON_HEIGHT,
        pointing: 1
      },
      laserShots: [],
	  moveX: cnt.PLAYER_POS_X
    };
  } 
  
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress);
	
    this.shootSound = Sound.find(laserAudio);
    this.destroySound = Sound.find(explosionAudio);
    this.animationID = window.requestAnimationFrame(() => this.updateGame());
  }  
  
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress);
	document.removeEventListener("ontouchmove", this.handleTouchMove);
    window.cancelAnimationFrame(this.animationID);
  }
  
  updateGame(){ 
    if(!this.ended){
      this.moveAliens();
      this.animationID = window.requestAnimationFrame(() => this.updateGame());
    }
  }
  
  createAliens() {    
    let newRow = 0;
    let aliens = [];    
    for(let index=0; index < cnt.NUM_ALIEN; index++){
      if((cnt.NUM_ALIEN / cnt.ALIEN_IN_ROWS) * newRow === index){
        newRow++;
      }   
      let colPos = index % cnt.ALIEN_IN_COLS;      
      let cdX = cnt.ALIEN_MATRIX_POS + (cnt.ALIEN_WIDTH + cnt.ALIEN_PADDING) * colPos;      
      let cdY = 40 + newRow * (cnt.ALIEN_WIDTH + cnt.ALIEN_PADDING);
      aliens.push({
                id: index,
                width: cnt.ALIEN_WIDTH,
                height: cnt.ALIEN_HEIGHT,
                xIni: 0,
                yIni: 0,
                x: cdX,
                y: cdY,
                isAlive: true,            
                speed: cnt.ALIEN_SPEED,
                vector: [1, 0],
                pointing: -1,
            });
    }
    return aliens;
  }
  
  handleKeyPress(event){
    let key = event.key;
    switch (key) {
      case "ArrowRight":
        this.movePlayer(15);        
        break;
      case "ArrowLeft":
        this.movePlayer(-15);
        break;
      case " ":
        this.addLaserShot(this.state.player, [0, -1]);
        break;
      case "Spacebar":
        this.addLaserShot(this.state.player, [0, -1]);
        break;
      default:
    }
  }
  
  handleTouchStart(event) {
    const touch = event.touches[0];
    this.setState({ moveX: touch.clientX });
  }
  
  handleTouchMove(event) {
    let x = event.touches[0].clientX;
    let y = event.touches[0].clientY;
    let dX = x - this.state.moveX;
    if ( dX > 0 ) {
      this.movePlayer(cnt.PLAYER_SPEED);
    }
    else {
      this.movePlayer(-cnt.PLAYER_SPEED);
    }
    this.setState({ moveX: x });
  }  
  
  handleTap(){
	this.addLaserShot(this.state.player, [0, -1]);  
  }
  
  movePlayer(dx) {
    const playerX = Number(this.state.player.x);
    let conditions = {
      cd1: playerX < cnt.CANNON_0,
      cd2: playerX > cnt.EDGE_RIGHT
    }; 
    if ( conditions.cd1 ) {
      this.setState({player: {
        ...this.state.player,
        x: cnt.CANNON_0
      }});      
    }
    else if ( conditions.cd2 ) {
      this.setState({player: {
        ...this.state.player,
        x: cnt.EDGE_RIGHT
      }});      
    }
    else{
      this.setState({player: {
          ...this.state.player,
          x: playerX + dx
        }});
    }
  }
  
  addLaserShot(shooter, vector) {        
    let cdX = shooter.x + vector[0] + shooter.width/2;
    let cdY = shooter.y + vector[1] * 3;
    this.setState({
      laserShots: [...this.state.laserShots, {      
        x: cdX,
        y: cdY,
        xIni: 0,
        yIni: 0,
        vector: vector,        
        id: "laserShot-" + new Date().getTime() + "-" + Math.random() * 1000,
        shoot: true
      }]      
    }, () => {Sound.play(this.shootSound, this.props.muted);});
  }
  
  detectCollision(obj) {
    let left = obj.x - obj.width/2;
    let right = obj.x + obj.width/2;
    let top = obj.y - obj.height/2;
    let bottom = obj.y + obj.height/2;
    for (let laserShot of this.state.laserShots) {
        let status = {
            cd1: laserShot.x >= left,
            cd2: laserShot.x <= right,
            cd3: laserShot.y >= top,
            cd4: laserShot.y <= bottom,
            cd5: (obj.pointing * laserShot.vector[1]) > 0
        };
      
        if (status.cd1 && status.cd2 && status.cd3 && status.cd4 && status.cd5) {
            if(laserShot.vector[1] < 0){
              this.props.score();
            }
            Sound.play(this.destroySound, this.props.muted);
            return true;
        }
    }
    return false;
  }
  
  isTimeFire() {  
    let aliensAlive = this.state.aliens.filter(alien => alien.isAlive).length;
    let shotsAliensMin = cnt.ALIEN_SHOTS_PER_MINUTE / aliensAlive / (cnt.MS_PER_FRAME * 60);
    return Math.random() <= shotsAliensMin;
  }

  moveAliens(){
    this.setState({aliens: this.state.aliens.filter(alien => alien.isAlive).map(alien => {      
      alien.x = alien.x + alien.vector[0] * alien.speed;
      alien.y = alien.y + alien.vector[1] * alien.speed;
      if (alien.x < cnt.EDGE || alien.x > cnt.LIMITW) {
        alien.vector[0] = -alien.vector[0];
      }

      if (this.detectCollision(alien)) {        
        alien.isAlive = false;
      }

      if (this.isTimeFire()) {
        this.addLaserShot(alien, [0, 1]);
      }
      return alien;
    })});
    
    this.setState({laserShots: this.state.laserShots.map((laserShot) => {
          laserShot.x = laserShot.x + laserShot.vector[0] * cnt.LASER_SPEED;
          laserShot.y = laserShot.y + laserShot.vector[1] * cnt.LASER_SPEED;
          return laserShot;
        })
        .filter((laserShot) => {          
          let status = {
            cd1: laserShot.x <= cnt.EDGE,
            cd2: laserShot.x >= cnt.LIMITW,
            cd3: laserShot.y <= cnt.EDGE,
            cd4: laserShot.y >= cnt.GAME_HEIGHT,
          };
          let cond = !(status.cd1 || status.cd2 || status.cd3 || status.cd4);
          return cond;
        })        
    });
    let aliensAlive = this.state.aliens.filter(alien => alien.isAlive);
    let getShot = this.detectCollision(this.state.player);
    if (( getShot|| !aliensAlive.length) && !this.ended) {      
      this.ended = true;
      this.props.gameStatus(true);
    }  
  }
  
  renderAliens(){
    return this.state.aliens.map((alien) => {            
            return <Alien key={alien.id} height={alien.height} 
                          width={alien.width} x={alien.x} 
                          y={alien.y} xIni={alien.xIni} 
                          yIni={alien.yIni}/>
          });
  }
  
  renderLaserShots(){
    return this.state.laserShots.map((laserShot) => {
            return <LaserShot key={laserShot.id} x={laserShot.x} 
                              y={laserShot.y} xIni={laserShot.xIni} 
                              yIni={laserShot.yIni}/>
          });
  }
  
  renderPlayer(){
    let player = this.state.player;
    return (<Player height={cnt.CANNON_HEIGHT} width={cnt.CANNON_WIDTH} 
             x={player.x} y={player.y} 
             xIni={player.xIni} yIni={player.yIni}/>);
  }  
  render(){    
    return (
      <DisplayScreen onTouchMove={(e) => this.handleTouchMove(e)} onClick={(e) => this.handleTap()}>
        {this.renderAliens()}
        {this.renderPlayer()}
        {this.renderLaserShots()}        
      </DisplayScreen>
    )
  }
	
}

export default Game;