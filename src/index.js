import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const minIndex = (arr) => {
  let min_value = Number.MAX_SAFE_INTEGER;
  let min_index = -1;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] <= min_value) {
      min_value = arr[i];
      min_index = i;
    }
  }

  console.log("minIndex => ", min_index, min_value);
  return min_index;
};

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
  const seconds = (duration / seconds_t).toFixed(3);

  return `${minutes} min ${seconds} sec`;
};

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: Date.now(),
      start: props.start || 0,
    };
  }
  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 100);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }
  tick() {
    this.setState({
      time: Date.now(),
      start: this.state.start,
    });
  }
  render() {
    const { time, start } = this.state;
    const time_text = `TOTAL: ${millisToString(time - start)}`;
    return <div className="time-block">{time_text}</div>;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: null,
      prev_time: null,
      count: null,
    };
  }

  handleClick = () => {
    if (this.state.count === null) {
      // first click
      this.setState({
        history: [],
        count: 1,
        prev_time: Date.now(),
      });
    } else {
      const now = Date.now();
      const new_time = now - this.state.prev_time;

      this.setState({
        history: this.state.history.concat([new_time]), //[...history, squares],
        count: this.state.count + 1,
        prev_time: now,
      });
    }
  };

  render() {
    if (this.state.count === null) {
      return (
        <div onClick={this.handleClick}>
          <div className="count-block">{"GO"}</div>
        </div>
      );
    }

    const history = this.state.history;
    const fastest_lap = minIndex(history);
    const fastest_text = `FASTEST: ${fastest_lap + 1} - ${millisToString(
      history[fastest_lap]
    )}`;
    const fastest =
      fastest_lap >= 0 ? (
        <div className="fastest-block">{fastest_text}</div>
      ) : null;

    const times = history
      .map((v, i) => {
        const cls = i === fastest_lap ? "fastest-block" : "time-block";

        return (
          <div className={cls} key={i}>
            {i + 1} - {millisToString(v)}
          </div>
        );
      })
      .reverse();

    return (
      <div onClick={this.handleClick}>
        <div className="count-block">{this.state.count || "GO"}</div>
        <Clock className="time-block" start={Date.now()} />
        {fastest}
        {times}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
