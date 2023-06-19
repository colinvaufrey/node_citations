import { Request, Response } from "express";
import { Citation, CitationAuthor } from "./database/db";
import { Op } from "sequelize";

function getCitations(req: Request, res: Response) {
	const author = req.query.author;
	const year = req.query.year;

	const where = {};
	const include = [];
	if (year) {
		where["year"] = year;
	}
	if (author) {
		include.push({
			model: CitationAuthor,
			where: {
				authorName: {
					[Op.like]: `%${author}%`,
				},
			},
		});
	} else {
		include.push(CitationAuthor);
	}

	// Bit of a workaround I guess (I'm sure there's a better way to do this)

	// Needed because when we include the CitationAuthor model in our query to
	// check for the author name, it only includes that author and not the others.

	// First, we get all the IDs of the citations that include the author we're
	// looking for.
	Citation.findAll({ where, include, attributes: ["id"] }).then((results) => {
		const ids = results.map((result) => result.id);
		// Then, we get all the citations that have those IDs, and include all
		// their authors.
		Citation.findAll({
			where: { id: ids },
			include: [CitationAuthor],
		}).then((citations) => {
			res.status(200).json(citations);
		});
	});
}

function getRandomCitation(req: Request, res: Response) {
	Citation.findOne({
		order: Citation.sequelize.random(),
		include: [CitationAuthor],
	}).then((citation) => {
		res.status(200).json(citation);
	});
}

function getCitationById(req: Request, res: Response) {
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
	Citation.create(citation, { include: [CitationAuthor] })
		.then((citation) => {
			res.status(201).json(citation);
		})
		.catch((error) => {
			res.status(400).json({
				error: error.message,
			});
			console.log("Error while creating citation");
			console.log(error);
		});
}

function putCitation(req: Request, res: Response) {
	const id = req.params.id;
	const citation = req.body;

	Citation.update(citation, { where: { id } }).then((result) => {
		if (result[0] === 1) {
			// Delete all the authors of the citation
			CitationAuthor.destroy({ where: { citationId: id } })
				.then(() => {
					// Then, create the new authors
					const authors = citation.authors.map(
						(author: CitationAuthor) => {
							return {
								citationId: id,
								authorName: author.authorName,
							};
						}
					);

					CitationAuthor.bulkCreate(authors)
						.then(() => {
							// Finally, get the updated citation and send it back
							Citation.findByPk(id, {
								include: [CitationAuthor],
							})
								.then((citation) => {
									res.status(200).json(citation);
								})
								.catch((error) => {
									res.status(400).json({
										error: error.message,
									});
									console.log(
										"Error while getting updated citation"
									);
									console.log(error);
								});
						})
						.catch((error) => {
							res.status(400).json({
								error: error.message,
							});
							console.log("Error while creating authors");
							console.log(error);
						});
				})
				.catch((error) => {
					res.status(400).json({
						error: error.message,
					});
					console.log("Error while deleting authors");
					console.log(error);
				});
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

export {
	getCitations,
	getRandomCitation,
	getCitationById,
	postCitation,
	putCitation,
	deleteCitation,
};
