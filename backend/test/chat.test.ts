import request = require('supertest');
import app from '../src/app';
import * as openaiService from '../src/services/openai.service';

jest.mock('../src/services/openai.service');

describe('POST /api/chat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('The chat should respond to our messages', async () => {
    const mockResponse = 'Hey there Univerbal!';
    (openaiService.getAIResponse as jest.Mock).mockResolvedValue(mockResponse);

    const response = await request(app)
      .post('/api/chat')
      .send({ userMessage: 'Hello', language: 'en', cefrLevel: 'B1' })
      .expect('Content-Type', /json/)
      .expect(200);

    expect(response.body).toHaveProperty('response');
    expect(response.body.response).toBe(mockResponse);
    expect(openaiService.getAIResponse).toHaveBeenCalled();
  });

  it('should handle a missing message', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({})
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return error 400 for an invalid language', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ userMessage: 'Hello', language: 'test' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return error 400 for empty userMessage', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ userMessage: '  ' })
      .expect('Content-Type', /json/)
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });

  it('should return 404 for unknown endpoints', async () => {
    const response = await request(app)
      .get('/api/unknown')
      .expect('Content-Type', /json/)
      .expect(404);

    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Endpoint not found.');
  });
});
