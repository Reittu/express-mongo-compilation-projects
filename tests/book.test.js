// Sample database testing (in-memory)

const BookModel = require('../models/book.model');
const dbHandler = require('./db-handler');

dbHandler.setupTestLifeCycle();

describe('insert', () => {
    it('Create and save a valid book', async () => {
        const validBook = new BookModel({ title: "test book" });
        const savedBook = await validBook.save();
        expect(savedBook._id).toBeDefined();
        expect(savedBook.title).toBe("test book");
        expect(Array.isArray(savedBook.comments)).toBe(true);
        expect(savedBook.comments).toHaveLength(0);
    });
    it('Create and save an invalid book', async () => {
        let error = null;
        try {
            const invalidBook = new BookModel({ name: "test book" });
            await invalidBook.validate(); // or .save()
        } catch (e) {
            error = e;
        }
        expect(error).not.toBeNull();
    });
});

