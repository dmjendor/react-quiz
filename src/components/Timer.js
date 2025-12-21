import { useEffect } from "react";

function Timer({ dispatch, secondsRemaining }) {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = Math.floor(secondsRemaining % 60);
  useEffect(
    function () {
      const timer = setInterval(() => {
        dispatch({ type: "updateTimer" });
      }, 1000);

      return () => clearInterval(timer); // cleanup function
    },
    [dispatch]
  );
  return (
    <div className="timer">
      {minutes < 10 && "0"}
      {minutes}:{seconds < 10 && "0"}
      {seconds}
    </div>
  );
}

export default Timer;
