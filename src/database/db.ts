import {
	Sequelize,
	Table,
	Column,
	Model,
	ForeignKey,
	BelongsTo,
	HasMany,
} from "sequelize-typescript";
import fs from "fs";
import path from "path";

import { databaseFolder, databaseFile } from "../../config.json";

@Table
class Citation extends Model {
	@Column({ primaryKey: true, autoIncrement: true })
	public id: number;

	@Column({ allowNull: false })
	public text: string;

	@Column
	public year: number;

	@HasMany(() => CitationAuthor)
	public authors: CitationAuthor[];
}

@Table
class CitationAuthor extends Model {
	@ForeignKey(() => Citation)
	@Column
	public citationId: number;

	@Column
	public authorName: string;

	@BelongsTo(() => Citation)
	public citation: Citation;
}

async function initDatabase() {
	// Ensure that the database folder exists
	const databaseFolderPath = path.join(__dirname, "../../", databaseFolder);
	if (!fs.existsSync(databaseFolderPath)) {
		fs.mkdirSync(databaseFolderPath);
	}

	// Iniialise the database from the configurated file (creates it if it doesn't exist)
	const databaseFilePath = path.join(databaseFolderPath, databaseFile);
	const sequelize = new Sequelize({
		dialect: "sqlite",
		storage: databaseFilePath,
	});

	sequelize.addModels([Citation, CitationAuthor]);

	// Creates the tables if they don't exist
	await sequelize.sync();
}

export { Citation, CitationAuthor, initDatabase };
