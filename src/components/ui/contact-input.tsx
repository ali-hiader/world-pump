import TextField from "@mui/material/TextField";

export interface ContactInputProps {
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  defaultValue?: string;
}

export default function ContactInput({
  name,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
  defaultValue,
}: ContactInputProps) {
  // Use controlled if value and onChange are provided, otherwise uncontrolled
  const isControlled = value !== undefined && onChange !== undefined;

  return (
    <TextField
      id={name}
      name={name}
      variant="standard"
      fullWidth
      size="small"
      slotProps={{
        input: {
          sx: { fontSize: 14 }, // input text font size
        },
        inputLabel: {
          sx: { fontSize: 14 }, // label font size
        },
      }}
      required={required}
      placeholder={placeholder}
      type={type}
      {...(isControlled
        ? { value: value, onChange: onChange }
        : { defaultValue: defaultValue })}
    />
  );
}
