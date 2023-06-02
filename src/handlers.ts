import { Request, Response } from "express";
import { Citation, CitationAuthor } from "./database/db";

function getCitations(req: Request, res: Response) {
	const id = req.query.id;
	const author = req.query.author;
	const year = req.query.year;

	const where = {};
	const include = [];
	if (id) {
		where["id"] = id;
	}
	if (year) {
		where["year"] = year;
	}
	if (author) {
		include.push({
			model: CitationAuthor,
			where: {
				authorName: author,
			},
		});
	} else {
		include.push(CitationAuthor);
	}

	Citation.findAll({ where, include }).then((citations) => {
		res.status(200).json(citations);
	});
}

function getCitation(req: Request, res: Response) {
	const id = req.params.id;
	Citation.findByPk(id, { include: [CitationAuthor] }).then((citation) => {
		if (citation) {
			res.status(200).json(citation);
		} else {
			res.status(404).json({ error: "Citation not found" });
		}
	});
}

function postCitation(req: Request, res: Response) {
	const citation = req.body;
	Citation.create(citation).then((citation) => {
		res.status(201).json(citation);
	});
}

function putCitation(req: Request, res: Response) {
	const id = req.params.id;
	const citation = req.body;
	Citation.update(citation, { where: { id } }).then((result) => {
		if (result[0] === 1) {
			res.status(200).json({ message: "Citation updated" });
		} else {
			res.status(404).json({ error: "Citation not found" });
		}
	});
}

function deleteCitation(req: Request, res: Response) {
	const id = req.params.id;
	Citation.destroy({ where: { id } }).then((result) => {
		if (result === 1) {
			res.status(200).json({ message: "Citation deleted" });
		} else {
			res.status(404).json({ error: "Citation not found" });
		}
	});
}

export { getCitations, getCitation, postCitation, putCitation, deleteCitation };
