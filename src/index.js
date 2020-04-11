import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const millisToString = (duration) => {
  console.log("duration", duration);
  const millis_t = 1;
  const seconds_t = 1000 * millis_t;
  const minutes_t = 60 * seconds_t;
  const hours_t = 60 * minutes_t;
  const days_t = 24 * hours_t;

  const days = Math.floor(duration / days_t);
  const hours = Math.floor(duration / hours_t);
  const minutes = Math.floor(duration / minutes_t);
  const seconds = duration / seconds_t;

  return `${hours}:${minutes}:${seconds}`;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [],
      count: 0,
    };
  }

  handleClick = () => {
    const history = this.state.history;
    const new_count = this.state.count + 1;

    this.setState({
      history: history.concat([Date.now()]), //[...history, squares],
      count: new_count,
    });
  };

  render() {
    const history = this.state.history;
    const times = history
      .map((v, i, arr) => {
        if (i > 0) {
          return (          
              <div className="time-block" key={i}>
                {i} - {millisToString(arr[i] - arr[i - 1])}
              </div>            
          );
        }
      })
      .reverse();

    return (
      <div onClick={this.handleClick}>
        <div className="count-block">{this.state.count || "START"}</div>
        {times}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
