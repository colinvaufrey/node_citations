import { Citation, CitationAuthor, initDatabase } from "../database/db";
import { decode } from "html-entities";

import authors from "../../data/Auteur.json";
import citations from "../../data/Citation.json";

(async () => {
	await initDatabase();

	citations.forEach((citation) => {
		const foundCitation = new Citation({
			id: citation.ref,
			text: decode(citation.citation),
			year: citation.annee,
		});
		foundCitation.save();
	});

	authors.forEach((author) => {
		const foundAuthor = new CitationAuthor({
			citationId: author.refCitation,
			authorName: decode(author.nom),
		});
		foundAuthor.save();
	});
})();
