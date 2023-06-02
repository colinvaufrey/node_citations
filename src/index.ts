import express from "express";

const app = express();
const PORT = 3501;

app.get("/citations", (req, res) => {
	res.send("Hello World!");
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
});
