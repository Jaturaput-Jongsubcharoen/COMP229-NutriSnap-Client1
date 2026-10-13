export default function Feedback({ error, message, loading }) {
  return (
    <>
      {error && (
        <p className="feedback error" role="alert">
          {error}
        </p>
      )}
      {message && (
        <p className="feedback success" role="status">
          {message}
        </p>
      )}
      {loading && (
        <p className="feedback" role="status">
          <span className="loading-dot" /> Working on it…
        </p>
      )}
    </>
  );
}
