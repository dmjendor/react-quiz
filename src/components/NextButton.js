import { useQuiz } from "../context/QuizContext";

export default function NextButton() {
  const { answer, index, numQuestions, onNextQuestion, onFinishQuiz } =
    useQuiz();
  if (answer === null) return null;

  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={onNextQuestion}
      >
        Next
      </button>
    );
  }
  if (index === numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={onFinishQuiz}
      >
        Finish
      </button>
    );
  }
}
