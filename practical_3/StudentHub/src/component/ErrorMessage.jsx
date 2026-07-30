function ErrorMessage({ message, onRetry }) {
  return (
    <div>
      <h2>Something went Wrong: {message}</h2>
      {onRetry && <button onClick={onRetry}>Retry</button>}
    </div>
  );
}

export default ErrorMessage;