import React from 'react';

// default values

const defaultPlayerStatus = "You are alive and kicking!";
const defaultHP = 1000;
const stomachCapacity = 75;
const defaultDecayModifier = 20;

const initialState = {
    isPaused: false,
    hp: defaultHP,
    food: 0,
    hpDownPerSecond: 1, //base decay
    stomachCapacity,
    stomach: stomachCapacity,
    decayModifier: defaultDecayModifier,
    playerStatus: defaultPlayerStatus,
}

class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.hpTimerID = setInterval(
      () => this.tick(),
      1000
    );  
  }

  tick() {
    const {hp, food, stomach, decayModifier, hpDownPerSecond, isPaused} = this.state;
    let newPlayerStatus = defaultPlayerStatus;
    
    if(hp > 0 && isPaused===false){
      let amountToDecay = hpDownPerSecond;
      let newStomach = 0;
      let newHP = 0;

      // decay from hunger
      if(stomach > 0){
        newStomach = stomach - hpDownPerSecond;
      } else {
        amountToDecay = amountToDecay*decayModifier;
        newPlayerStatus = "You're starving!"
      }

      // total decay
      newHP = hp - amountToDecay;
      if(newHP < 0){newHP = 0}
      this.setState({hp: newHP, stomach: newStomach, playerStatus:newPlayerStatus, food: food+.5})
    
    } else { // game is paused or player is dead
      if(hp <= 0){
        newPlayerStatus = "Oh noes you died!";
        clearInterval(this.hpTimerID);
      }
      this.setState({isPaused:true, playerStatus: newPlayerStatus})
    }
  };

  eat() {
    const {food, hp, isPaused} = this.state;
      console.log("food", food)
    if(food >= 1 && hp > 0 && !isPaused){
      const foodValue = 5;
      const newFood = food - 1;
      const {stomach, stomachCapacity, playerStatus} = this.state;
      let newStomach = stomach;
      let newPlayerStatus = playerStatus;
      if(newStomach + foodValue > stomachCapacity) {
        newStomach = stomachCapacity;
        newPlayerStatus = "You're stuffed!";
      } else {
        newStomach = stomach + foodValue;
        newPlayerStatus = defaultPlayerStatus;
      }
      this.setState({stomach: newStomach, playerStatus: newPlayerStatus, food:newFood})
    }
  }

  togglePause = (pause) => {
    this.setState({isPaused: pause});
  }

  componentWillUnmount() {
    clearInterval(this.hpTimerID);
  }

  restartGame() {
    clearInterval(this.hpTimerID);
    this.setState({...initialState});
    this.hpTimerID = setInterval(
      () => this.tick(),
      1000
    );  
  }

  returnPauseOrRestartButton() {
    const {isPaused, hp} = this.state;
    const pauseLabel = isPaused ? "UNPAUSE GAME" : "PAUSE GAME";
    const restartLabel = "RESPAWN";
    const playerIsAlive = hp > 0;

    const label = playerIsAlive ?
      pauseLabel : restartLabel;
    console.log("label", label, "playerIsAlive", playerIsAlive, "hp", hp)
    const onClickHandler = () => {
      playerIsAlive ?
      this.togglePause(!isPaused) : this.restartGame()
    }

    return <button onClick={onClickHandler}>{label}</button>
  }

  render() {
    const {hp, playerStatus, food} = this.state;
    const formattedFood = Number(food.toFixed(1));
    
    return <div>
      <h4>You are a simple organism. All you can do is eat the particles that settle around you to hold off death a little longer.</h4>
      <h5>{playerStatus}</h5>
      <br/>
      {this.returnPauseOrRestartButton()}
      <br/>
      Current HP : [ {hp}  ]
      <br/>
      Current Hunger : [ {this.state.stomach}  ]
      <br/>
      <button onClick={() => {this.eat()}} disabled={formattedFood < 1}>EAT </button> ({formattedFood} FOOD HAS SETTLED AROUND YOU)
    </div>;
  }
}

export default Game;
