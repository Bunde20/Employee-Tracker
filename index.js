//List of questions to ask the user
const questions = [
    {
      type: "input",
      name: "text",
      message: "Enter up to 3 characters.",
      validate: (text) =>
        text.length <= 3 ||
        "Please keep input to 3 characters or less, for a text value.",
    },
    {
      type: "input",
      name: "textColor",
      message: "Enter a standard or hexidecimal color for your text.",
    },
    {
      type: "list",
      name: "shape",
      message: "Select the shape you would like to use:",
      choices: ["Circle", "Square", "Triangle"],
    },
    {
      type: "input",
      name: "shapeColor",
      message: "Enter a standard or hexidecimal color for your shape.",
    },
  ];