import { useQuiz } from "../context/QuizContext";

function Options() {
  const { questions, index, onNewAnswer, answer } = useQuiz();
  const question = questions[index];
  const hasAnswered = answer !== null;
  return (
    <div className="options">
      {question.options.map((option, index) => (
        <button
          className={`btn btn-option ${index === answer ? "answer" : ""} ${
            answer !== null
              ? index === question.correctOption
                ? "correct"
                : "wrong"
              : ""
          }`}
          disabled={hasAnswered}
          key={(option, index)}
          onClick={() => onNewAnswer(index)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

export default Options;
