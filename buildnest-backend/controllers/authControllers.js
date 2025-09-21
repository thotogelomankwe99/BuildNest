export const manualSignup = (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("Manual signup:", { fullName, email, password });
  
  // TODO: Insert into MySQL
  res.json({ success: true, message: "Signup successful" });
};

export const manualLogin = (req, res) => {
  const { email, password } = req.body;
  console.log("Manual login:", { email, password });

  // TODO: Check in MySQL
  res.json({ success: true, message: "Login successful", user: { email } });
};