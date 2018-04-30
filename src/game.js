import React, {Component} from 'react';
import Numbers from './numbers';
import Button from './button';
import Stars from './stars';
import DoneFrame from './doneFrame';
import Answer from './answers'; 
import _ from 'lodash';
import possibleCombinationSum from './possibleNumbers';
import { button } from 'reactstrap';



class Game extends Component {

    
static randomNumber = () => 1 + Math.floor(Math.random() * 9)
static initialState = () => ({
	selectedNumbers: [],
	randomNumberOfStars: Game.randomNumber(),
	answerIsCorrect: null,
	usedNumbers: [],
	numberOfRedraws: 5,
	doneStatus: null,
})

state = Game.initialState()

resetGame = () => this.setState(Game.initialState())


selectNumber = (clickedNumber) => {
if (this.state.selectedNumbers.indexOf(clickedNumber) >= 0) {return;}
	this.setState(prevState => ({
  answerIsCorrect: null,
  selectedNumbers: prevState.selectedNumbers.concat(clickedNumber)
  }))
}

unselectNumber = (clickedNumber) => {
	this.setState(prevState =>  ({
  answerIsCorrect: null,
  	selectedNumbers: prevState.selectedNumbers.filter(number => number !== clickedNumber)
  }))
}

checkAnswer = () => {
	this.setState(prevState => ({
  answerIsCorrect: prevState.randomNumberOfStars === 
  	prevState.selectedNumbers.reduce((acc, n) => acc + n,0)
  }))
}

acceptAnswer = () => {
	this.setState(prevState => ({
  usedNumbers: prevState.usedNumbers.concat(prevState.selectedNumbers),
  selectedNumbers: [],
  answerIsCorrect: null,
  randomNumberOfStars: Game.randomNumber()
  }), this.updateDoneStatus);
}

redraw = () => {
	if (this.state.numberOfRedraws === 0) {return ''}
	this.setState(prevState => ({
  	randomNumberOfStars: Game.randomNumber(),
    answerIsCorrect: null,
    selectedNumbers: [],
    numberOfRedraws: prevState.numberOfRedraws - 1
  }), this.updateDoneStatus);
}

possibleSolutions = ({randomNumberOfStars, usedNumbers}) => {
	const possibleNumbers = _.range(1, 10).filter(number => usedNumbers.indexOf(number) === -1
  );
  return possibleCombinationSum(possibleNumbers, randomNumberOfStars);
}

updateDoneStatus = () => {
	this.setState(prevState => {
  	if (prevState.usedNumbers.length === 9) {
    return { doneStatus: 'Well done!' };
    }
    if (prevState.numberOfRedraws === 0 && !this.possibleSolutions(prevState)) {
    return { doneStatus: 'Game Over!' };
    }
  })
}


	render() {
  	return(
        <div className='container'>
          <h1>Play</h1>
          <hr />
          <div className='row'>
            <Stars numberOfStars={this.state.randomNumberOfStars}/>
            <Button selectedNumbers= {this.state.selectedNumbers}
            		checkAnswer={this.checkAnswer}
                    answerIsCorrect={this.state.answerIsCorrect}
                    acceptAnswer= {this.acceptAnswer}
                    redraw={this.redraw}
                    numberOfRedraws={this.state.numberOfRedraws}/>
            <Answer selectedNumbers= {this.state.selectedNumbers}
            		unselectNumber= {this.unselectNumber}/>
        	</div>
           	{this.state.doneStatus ?
            	<DoneFrame doneStatus={this.state.doneStatus}
              			   resetGame={this.resetGame} /> :
              <Numbers selectedNumbers= {this.state.selectedNumbers} 	
                        selectNumber={this.selectNumber} 
          				usedNumbers={this.state.usedNumbers}/>
            }
          
          
        </div>
    )
  }
}

export default Game;