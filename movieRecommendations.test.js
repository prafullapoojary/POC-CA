const axios = require('axios');
const { validationResult } = require('express-validator');
const { movieRecommendations,isShowingSoon } = require('./utils');

const req = {
    body: {
        genres: 'animation',
        time: '12:00'
    }
};

const res = {
    status: jest.fn(() => res),
    json: jest.fn(data => data)
};

const moviesData = [
    {
        name: 'Zootopia',
        rating: 92,
        genres: ['Action & Adventure', 'Animation', 'Comedy'],
        showings: ['19:00:00+11:00', '21:00:00+11:00']
    },
    {
        name: 'Shaun The Sheep',
        rating: 80,
        genres: ['Animation', 'Comedy'],
        showings: ['19:00:00+11:00']
    }
];

jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({ isEmpty: jest.fn(() => true), errors: [] }))
}));

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve({ data: moviesData }))
}));

describe('POST /movieRecommendations', () => {
    test('should return movie recommendations', async () => {
        await movieRecommendations(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: 'success', data: expect.any(Array) });
    });

    test('should return error if validation fails', async () => {
        validationResult.mockReturnValueOnce({ isEmpty: jest.fn(() => false), errors: [{ msg: 'Validation error' }] });
        await movieRecommendations(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ status: false, message: 'Validation error' });
    });
});
