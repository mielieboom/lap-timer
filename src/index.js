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

function Counter(props) {
  return (
    <button
      className="count-block"
      onClick={() => props.handler()}
      onTouchEnd={() => props.handler()}
    >
      {props.count || "GO"}
    </button>
  );
}

function TimeInfo(props) {
  return (
    <div className="time-block">
      {props.name}: {millisToString(props.duration)}
    </div>
  );
}

function TimeList(props) {
  const { history } = props;
  const fastest_lap = minIndex(history);

  return history
    .map((v, i) => {
      const cls = i === fastest_lap ? "fastest-block" : "time-block";

      return (
        <div className={cls} key={i}>
          {i + 1} - {millisToString(v)}
        </div>
      );
    })
    .reverse();
}

function StartStop(props) {
  const { handler, is_running } = props;
  const [cls, text] = is_running
    ? ["fastest-block", "STOP"]
    : ["info-block", "RESUME"];

  return (
    <button className={cls} onClick={handler}>
      {text}
    </button>
  );
}

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
      is_running: false,
    };
  }

  componentDidMount() {
    this.intervalID = setInterval(() => this.tick(), 100);
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    const { is_running } = this.state;
    if (is_running) {
      this.setState({
        ...this.state,
        current_time: Date.now(),
      });
    }
  }

  handleStartStop = () => {
    const now = Date.now();
    if (this.state.is_running) {
      this.setState({
        ...this.setState,
        is_running: !this.state.is_running,
      });
    } else {
      this.setState({
        ...this.setState,
        is_running: !this.state.is_running,
        prev_event_time: now,
        current_time: now,
      });
    }
  };

  handleClick = () => {
    const { prev_event_time, is_running, count, history } = this.state;
    const now = Date.now();
    const delta_time = now - prev_event_time;

    if (!is_running && count != null) {
      this.handleStartStop();
      return;
    }

    if (delta_time < click_time_tol) {
      return; // debounce double events like onTouchUp and onClick
    }

    if (count === null) {
      // first click
      this.setState({
        ...this.state,
        history: [],
        count: 1,
        prev_time: now,
        prev_event_time: now,
        current_time: now,
        start_time: now,
        is_running: true,
      });
    } else {
      this.setState({
        ...this.state,
        history: history.concat([delta_time]), //[...history, squares],
        count: count + 1,
        prev_time: now,
        prev_event_time: now,
        current_time: now,
      });
    }
  };

  render() {
    if (this.state.count === null) {
      return (
        <button onClick={this.handleClick} className="count-block">
          {"GO"}
        </button>
      );
    }

    const {
      history,
      current_time,
      start_time,
      prev_event_time,
      is_running,
    } = this.state;

    return (
      <div>
        <Counter count={this.state.count} handler={this.handleClick} />
        <StartStop is_running={is_running} handler={this.handleStartStop} />
        <TimeInfo name={"TOTAL"} duration={current_time - start_time} />
        <TimeInfo name={"CURRENT"} duration={current_time - prev_event_time} />
        <TimeList history={history} />
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<App />, document.getElementById("root"));
