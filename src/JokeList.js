import React, { Component } from 'react';
import axios from 'axios';
import './JokeList.css';
import Joke from './Joke';

class JokeList extends Component {
  static defaultProps = {
    numJokesToGet: 10
  }
  constructor(props){
    super(props);
    this.state = {
      jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
      loading: false
    }
    this.seenJokes = new Set(this.state.jokes.map(joke => joke.id));
    this.handleVote = this.handleVote.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  componentDidMount(){
    if (this.state.jokes.length === 0) this.getJokes();
  }
  async getJokes(){
    try{
      let jokes = [];
      while(jokes.length < this.props.numJokesToGet){
        let res = await axios.get('https://icanhazdadjoke.com/', {
          headers: { Accept: 'application/json' }
        });
        let newJoke = res.data;
        if (!this.seenJokes.has(newJoke.id)) {
          jokes.push({id: newJoke.id, joke: newJoke.joke, score: 0 });
          this.seenJokes.add(newJoke.id);
        } else {
          console.log("FOUND A DUPLICATE");
          console.log(newJoke);
        }
      }
      this.setState(st => ({
        loading: false,
        jokes: [...st.jokes, ...jokes]
      }),
      () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
      );
    } catch(e) {
      alert(e);
      this.setState({ loading: false });
    }
  }
  handleVote(id, delta){
    this.setState(st => ({
      jokes: st.jokes.map(joke =>
        joke.id === id ? {...joke, score: joke.score + delta } : joke)
    }),
    () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
    );
  }
  handleClick(){
    this.setState({ loading: true }, this.getJokes)
  }
  render() {
    if (this.state.loading) {
      return (
        <div className="JokeList-spinner">
          <i className="far fa-6x fa-laugh fa-spin" />
          <h1 className="JokeList-title">Loading...</h1>
        </div>
      )
    }
    return (
      <div className="JokeList">
        <div className="JokeList-sidebar">
          <h1 className="JokeList-title"><span>Dad</span> Jokes</h1>
          <img src="https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg" alt="laughing emoji" />
          <button className="JokeList-getmore" onClick={this.handleClick}>New jokes</button>
        </div>
        <div className="JokeList-jokes">
          {this.state.jokes.map(joke => (
            <Joke
              joke={joke.joke}
              score={joke.score}
              id={joke.id}
              handleVote={this.handleVote}
              key={joke.id}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default JokeList;
