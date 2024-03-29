#!/usr/bin/env node

import express from "express";
import { initDatabase } from "./database/db";
import { port } from "../config.json";
import {
	getCitations,
	getRandomCitation,
	getCitationById,
	postCitation,
	putCitation,
	deleteCitation,
} from "./handlers";

const app = express();
const PORT = port || 3000;

(async () => {
	await initDatabase();
})();

app.use(express.json());

app.get("/citations", getCitations); // Returns all citations, can be filtered by id, author or year
app.get("/citations/random", getRandomCitation); // Returns a random citation
app.get("/citations/:id", getCitationById); // Returns the citation with the given id
app.post("/citations", postCitation); // Creates a new citation
app.put("/citations/:id", putCitation); // Updates the citation with the given id
app.delete("/citations/:id", deleteCitation); // Deletes the citation with the given id

app.listen(PORT, () => {
	console.log(`Citations server running at http://localhost:${PORT}`);
}).setTimeout(60_000);