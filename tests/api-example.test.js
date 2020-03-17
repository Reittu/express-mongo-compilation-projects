const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');

afterAll(done => {
    mongoose.connection.close()
    done()
})

describe('Conversion API fetches', () => {
    it('Valid query (gal)', async () => {
        const res = await request(app)
            .get('/api/convert?input=5/4gal');
        expect(res.statusCode).toEqual(200);
    });
    it('Invalid query: no unit', async () => {
        const res = await request(app)
            .get('/api/convert?input=5/4');
        expect(res.statusCode).toEqual(400);
    });
    it('Invalid query: invalid number', async () => {
        const res = await request(app)
            .get('/api/convert?input=5.2.3');
        expect(res.statusCode).toEqual(400);
    });
}); 
