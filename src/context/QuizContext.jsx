import { createContext, useContext, useReducer, useEffect } from "react";

const SECONDS_PER_QUESTION = 30;
const QuizContext = createContext();
const initialState = {
  questions: [],
  status: "loading" | "error" | "ready" | "finished" | "active",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        status: "ready",
        questions: action.payload,
      };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaining: state.questions.length * SECONDS_PER_QUESTION,
      };
    case "newAnswer":
      const question = state.questions.at(state.index);
      const points =
        action.payload === question.correctOption
          ? state.points + question.points
          : state.points;
      return {
        ...state,
        answer: action.payload,
        points: points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finishQuiz":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        highscore: state.highscore,
        status: "ready",
      };
    case "updateTimer":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Unknown Action");
  }
}

function QuizProvider({ children }) {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );

  function onNewAnswer(option) {
    dispatch({ type: "newAnswer", payload: option });
  }

  function gameStart() {
    dispatch({ type: "start" });
  }

  function onNextQuestion() {
    dispatch({
      type: "nextQuestion",
    });
  }

  function onFinishQuiz() {
    dispatch({
      type: "finishQuiz",
    });
  }

  function onRestart() {
    dispatch({
      type: "restart",
    });
  }
  const value = {
    questions,
    status,
    index,
    answer,
    points,
    highscore,
    secondsRemaining,
    numQuestions,
    maxPossiblePoints,
    gameStart,
    onNewAnswer,
    onNextQuestion,
    onFinishQuiz,
    onRestart,
  };

  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  useEffect(
    function () {
      const timer = setInterval(() => {
        dispatch({ type: "updateTimer" });
      }, 1000);

      return () => clearInterval(timer); // cleanup function
    },
    [dispatch]
  );
  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

function useQuiz() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error("QuizContext was used outside the QuizProvider");

  return context;
}

export { useQuiz, QuizProvider };
