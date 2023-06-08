import { Citation, CitationAuthor, initDatabase } from "../database/db";
// import { decode } from "html-entities";

import authors from "../../data/CitationAuthors.json";
import citations from "../../data/Citations.json";

(async () => {
	await initDatabase();

	citations.forEach((citation) => {
		const foundCitation = new Citation({
			id: citation.id,
			text: citation.text,
			year: citation.year,
		});
		foundCitation.save();
	});

	authors.forEach((author) => {
		const foundAuthor = new CitationAuthor({
			citationId: author.citationId,
			authorName: author.authorName,
		});
		foundAuthor.save();
	});
})();
