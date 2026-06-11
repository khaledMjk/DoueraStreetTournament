import { inputClass, labelClass } from "./styles";

export default function FormField({ label, children }) {
  return (
    <div>
      {label && <label className={labelClass}>{label}</label>}
      {children}
    </div>
  );
}

export function TextInput(props) {
  return <input {...props} className={`${inputClass} ${props.className || ""}`} />;
}

export function SelectInput({ children, ...props }) {
  return (
    <select {...props} className={`${inputClass} ${props.className || ""}`}>
      {children}
    </select>
  );
}

export function TextArea(props) {
  return <textarea {...props} className={`${inputClass} ${props.className || ""}`} />;
}
