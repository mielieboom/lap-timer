import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

const click_time_tol = 100;

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
  const millis_t = 1;
  const seconds_t = 1000 * millis_t;
  const minutes_t = 60 * seconds_t;
  const hours_t = 60 * minutes_t;
  const days_t = 24 * hours_t;

  const days = Math.floor(duration / days_t);
  const hours = Math.floor((duration % days_t) / hours_t);
  const minutes = Math.floor((duration % hours_t) / minutes_t).to;
  const seconds = ((duration % minutes_t) / seconds_t).toFixed(3);

  let result = `${minutes || 0}m ${seconds}s`;
  result = hours ? `${hours}h ` + result : result;
  result = days ? `${days}d ` + result : result;

  return result;
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: null,
      prev_time: null,
      count: null,
      current_time: Date.now(),
      prev_event_time: Date.now(),
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
      ...this.state,
      current_time: Date.now(),
    });
  }

  handleClick = () => {
    const { prev_event_time } = this.state;
    const now = Date.now();
    const delta_time = now - prev_event_time;

    if (delta_time < click_time_tol) {
      return; // debounce double events like onTouchUp and onClick
    }

    if (this.state.count === null) {
      // first click
      this.setState({
        ...this.state,
        history: [],
        count: 1,
        prev_time: now,
        prev_event_time: now,
        current_time: now,
      });
    } else {
      const new_time = now - this.state.prev_time;

      this.setState({
        ...this.state,
        history: this.state.history.concat([new_time]), //[...history, squares],
        count: this.state.count + 1,
        prev_time: now,
        prev_event_time: now,
        current_time: now,
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

    const { current_time, prev_event_time } = this.state;
    const current_lap = (
      <div className="time-block">
        CURRENT: {millisToString(current_time - prev_event_time)}
      </div>
    );

    return (
      <div
        onClick={() => this.handleClick()}
        onTouchEnd={() => this.handleClick()}
      >
        <div className="count-block">{this.state.count || "GO"}</div>
        {fastest}
        {current_lap}
        {times}
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
