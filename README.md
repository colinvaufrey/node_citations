# node_citations

This is a Node.js server that serves a REST API for a citations database. It is a simple example of a REST API server that uses a database.
It is written TypeScript in Node.js and uses the Express framework. It uses a SQLite database.

## Database

The database is a SQLite database. It is in the file `database.sqlite`.
The tables are as follows:

**Citations**(<ins>id: integer</ins>, text: string, year: integer)
**CitationAuthors**(<ins>#citationId: integer, authorName: string</ins>)