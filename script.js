import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import { PiPlayPauseFill } from "https://esm.sh/react-icons/pi";
import { FiRefreshCw } from "https://esm.sh/react-icons/fi";

function App() {
  return (
    <div className="App">
      <Pomodoro />
    </div>
  );
}

class Pomodoro extends React.Component {
  interval;
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      timerType: "Session"
    };
  }

  componentDidMount() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      timerType: "Session"
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.timer <= 0 && prevState.timerType === "Session") {
      this.stopTimer();
      this.buzzer();
      this.setState(
        {
          timer: this.state.breakLength * 60,
          timerType: "Break"
        },
        this.startTimer
      );
    } else if (prevState.timer <= 0 && prevState.timerType === "Break") {
      this.stopTimer();
      this.buzzer();
      this.setState(
        {
          timer: this.state.sessionLength * 60,
          timerType: "Session"
        },
        this.startTimer
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  breakDecrement = () => {
    if (this.state.breakLength < 2) return;
    this.setState((prevState) => ({
      breakLength: prevState.breakLength - 1
    }));
  };

  breakIncrement = () => {
    if (this.state.breakLength > 59) return;
    this.setState((prevState) => ({
      breakLength: prevState.breakLength + 1
    }));
  };

  sessionDecrement = () => {
    if (this.state.sessionLength < 2) return;
    this.setState((prevState) => ({
      sessionLength: prevState.sessionLength - 1,
      timer: prevState.timer - 60
    }));
  };

  sessionIncrement = () => {
    if (this.state.sessionLength > 59) return;
    this.setState((prevState) => ({
      sessionLength: prevState.sessionLength + 1,
      timer: prevState.timer + 60
    }));
  };

  tick = () => {
    this.setState((prevState) => ({ timer: prevState.timer - 1 }));
  };

  startTimer = () => {
    if (this.interval) return;
    this.interval = setInterval(this.tick, 1000);
  };

  stopTimer = () => {
    clearInterval(this.interval);
    this.interval = null;
  };

  toggleTimer = () => {
    if (!this.interval) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  };

  resetTimer = () => {
    this.stopTimer();
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timer: 1500,
      timerType: "Session"
    });
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  };

  buzzer = () => {
    this.audioBeep.play();
  };

  clockify = () => {
    const { timer } = this.state;
    let minutes = Math.floor(timer / 60);
    let seconds = timer % 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${minutes}:${seconds}`;
  };

  render() {
    const { breakLength, sessionLength, timerType } = this.state;
    return (
      <div className="container-fluid">
        <div id="button-box1">
          <div id="well1">
            <span id="break-label">Break Length</span>
            <br />
            <button
              id="break-increment"
              onClick={this.breakIncrement}
              className="btn btn-default"
            >
              ↑
            </button>
            <span id="break-length">{breakLength}</span>
            <button
              id="break-decrement"
              onClick={this.breakDecrement}
              className="btn btn-default"
            >
              ↓
            </button>
          </div>
          <div id="well2">
            <span id="session-label">Session Length</span>
            <br />
            <button
              id="session-increment"
              onClick={this.sessionIncrement}
              className="btn btn-default"
            >
              ↑
            </button>
            <span id="session-length">{sessionLength}</span>
            <button
              id="session-decrement"
              onClick={this.sessionDecrement}
              className="btn btn-default"
            >
              ↓
            </button>
          </div>
        </div>
        <div id="timer">
          <p id="timer-label" className="text-center">
            {timerType}
          </p>
          <p id="time-left" className="text-center">
            {this.clockify()}
          </p>
        </div>
        <div id="button-box2">
          <button
            id="start_stop"
            onClick={this.toggleTimer}
            className="btn btn-default"
          >
            <PiPlayPauseFill />
          </button>
          <button
            id="reset"
            onClick={this.resetTimer}
            className="btn btn-default"
          >
            <FiRefreshCw />
          </button>
        </div>
        <audio
          id="beep"
          preload="auto"
          ref={(audio) => {
            this.audioBeep = audio;
          }}
          src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
        />
      </div>
    );
  }
}

ReactDOM.render(<Pomodoro />, document.getElementById("root"));
