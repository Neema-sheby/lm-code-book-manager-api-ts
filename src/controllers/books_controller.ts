import { Request, Response } from "express";
import * as bookService from "../services/books";

export const getBooks = async (req: Request, res: Response) => {
	const books = await bookService.getBooks();
	res.json(books).status(200);
};

export const getBook = async (req: Request, res: Response) => {
	const bookId = req.params.bookId;
	const book = await bookService.getBook(Number(bookId));

	if (book) {
		res.json(book).status(200);
	} else {
		res.status(404).json("Not found");
	}
};

export const saveBook = async (req: Request, res: Response) => {
	const bookToBeSaved = req.body;
	const books = await bookService.getBooks();

	const isBookExisting = books.some(
		(book) =>
			book.title === bookToBeSaved.title && book.author === bookToBeSaved.author
	);

	if (!isBookExisting) {
		try {
			const book = await bookService.saveBook(bookToBeSaved);
			res.status(201).json(book);
		} catch (error) {
			res.status(400).json({ message: (error as Error).message });
		}
	} else {
		res
			.status(400)
			.json(
				"This book already exists! Please choose a different title or author for your book."
			);
	}
};

// User Story 4 - Update Book By Id Solution
export const updateBook = async (req: Request, res: Response) => {
	const bookUpdateData = req.body;
	const bookId = Number.parseInt(req.params.bookId);

	const book = await bookService.updateBook(bookId, bookUpdateData);
	res.status(204).json(book);
};

// User Story 5 - Delete book by it's Id
export const deleteBook = async (req: Request, res: Response) => {
	const bookId = Number.parseInt(req.params.bookId);

	const response = await bookService.deleteBook(bookId);

	if (response === 1) {
		res.status(200).json("Deleted book");
	} else {
		res.status(404).json("Cannot find book");
	}
};
