export const saveUser = (req, res) => {
  const { uid, fullName, email } = req.body;
  console.log("Saving user to MySQL:", { uid, fullName, email });

  // TODO: Insert into MySQL
  res.json({ success: true, message: "User saved successfully" });
};

export const getUser = (req, res) => {
  const { uid } = req.params;
  console.log("Fetching user:", uid);

  // TODO: Query MySQL
  res.json({ success: true, user: { uid, name: "Test User" } });
};
