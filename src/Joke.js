import React, { Component } from 'react';

class Joke extends Component {
  constructor(props){
    super(props);
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  }
  handleUpvote(evt){
    this.props.handleVote(this.props.id, 1);
  }
  handleDownvote(evt){
    this.props.handleVote(this.props.id, -1);
  }
  render() {
    const {joke, score} = this.props;
    return (
      <div className="Joke">
        <div className="Joke-buttons">
          <i className="fas fa-arrow-up" onClick={this.handleUpvote}></i>
            {score}
          <i className="fas fa-arrow-down" onClick={this.handleDownvote}></i>
        </div>
        <div className="Joke-text">{joke}</div>
      </div>
    );
  }
}

export default Joke;
