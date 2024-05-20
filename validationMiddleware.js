// validateQuizMiddleware.js
export const validateQuizFields = (req, res, next) => {
  const { title, options, correct } = req.body;

  if (!title || typeof title !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'title'" });
  }

  if (
    !Array.isArray(options) ||
    options.length < 2 ||
    !options.every((option) => typeof option === "string")
  ) {
    return res.status(400).json({
      error:
        "Invalid or missing 'options'. It should be an array of strings with at least 2 options.",
    });
  }

  if (!correct || typeof correct !== "string" || !options.includes(correct)) {
    return res.status(400).json({
      error:
        "Invalid or missing 'correct'. It should be a string and one of the 'options'.",
    });
  }

  next();
};
