import { Citation, CitationAuthor, initDatabase } from "../database/db";

(async () => {
	await initDatabase();

	Citation.findAll({ include: [CitationAuthor] }).then((citations) => {
		for (const citation of citations) {
			console.log(citation.text);
			var description = "";
			if (citation.authors.length > 0) {
				description = "— ";
				description += citation.authors[0].authorName;
				for (var i = 1; i < citation.authors.length; i++) {
					description += ", " + citation.authors[i].authorName;
				}
				description += " ";
			}
			if (citation.year) {
				description += "~ " + citation.year;
			}
			console.log(description);
			console.log();
		}
	});
})();
