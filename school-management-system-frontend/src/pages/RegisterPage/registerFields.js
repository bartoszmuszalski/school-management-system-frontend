const registerFields = [
  { name: "firstName", type: "text", label: "First name", required: true },
  { name: "lastName", type: "text", label: "Last name", required: true },
  { name: "email", type: "email", label: "Email", required: true },
  { name: "password", type: "password", label: "Password", required: true },
  {
    name: "confirmPassword",
    type: "password",
    label: "Confirm password",
    required: true,
  },
];

export default registerFields;
