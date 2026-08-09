export function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      {hint && <small>{hint}</small>}
    </label>
  );
}

export function TextInput(props) {
  return <input className="input" {...props} />;
}

export function SelectInput({ children, ...props }) {
  return <select className="input" {...props}>{children}</select>;
}

export function TextArea(props) {
  return <textarea className="input textarea" rows="3" {...props} />;
}
