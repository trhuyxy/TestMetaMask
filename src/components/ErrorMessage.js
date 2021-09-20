export default function ErrorMessage({ message }) {
  if (!message) return null;

  return (
    <label>{message}</label>
  );
}
