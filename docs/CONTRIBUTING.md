# Contributing Guide

## Code Style

- Use ES Modules (import/export)
- Follow ESLint rules (see `.eslintrc.js`)
- Use async/await over promises
- Prefer const over let/var
- Use meaningful variable names
- Comment complex logic

## Git Workflow

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -m "feat: description"`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Example:
```
feat(resume): add PDF parsing for resume analysis
```

## Backend Development

### Adding a New Agent

1. Create file in `server/src/agents/`: `newAgent.js`
2. Create prompt template in `server/prompts/`: `newAgent.txt`
3. Import and use in controller
4. Add route in appropriate router file
5. Add tests in `server/tests/`

Example Agent:
```javascript
import { loadPrompt, generateAIResponse } from '../services/aiClient.js';

const myAgent = async (context) => {
  const prompt = await loadPrompt('myAgent.txt');
  const aiRaw = await generateAIResponse(prompt, context);
  try {
    return JSON.parse(aiRaw);
  } catch (error) {
    throw new Error('My agent returned invalid JSON');
  }
};

export default myAgent;
```

### Adding a New Route

1. Create controller in `server/src/controllers/`: `newController.js`
2. Create route file in `server/src/routes/`: `newRouter.js`
3. Register route in `server/src/app.js`
4. Add validation schema in `server/src/utils/validators.js`

### Adding a New Model

1. Create schema in `server/src/models/`: `NewModel.js`
2. Follow Mongoose best practices
3. Add indexes for frequently queried fields
4. Document the schema in `docs/DATABASE_SCHEMA.md`

### Testing Backend

Run tests:
```bash
npm --prefix server run test
```

Write tests in `server/tests/`:
```javascript
import request from 'supertest';
import app from '../src/app.js';

describe('My API', () => {
  it('should do something', async () => {
    const response = await request(app)
      .post('/api/endpoint')
      .send({ data: 'test' });
    expect(response.status).toBe(200);
  });
});
```

## Frontend Development

### Adding a New Page

1. Create component in `client/src/pages/`: `NewPage.jsx`
2. Add route in `client/src/App.jsx`
3. Add navigation link in `client/src/components/Layout.jsx`
4. Use existing hooks for API calls

### Adding a New Hook

1. Create file in `client/src/hooks/`: `useNewFeature.js`
2. Export hook and use in components
3. Handle loading and error states
4. Return data, loading, error

Example Hook:
```javascript
import { useState, useCallback } from 'react';
import api from '../api/apiClient.js';

export const useNewFeature = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (param) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/endpoint', { param });
      return response.data.data;
    } catch (err) {
      setError(err.response?.data?.error?.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { fetch, loading, error };
};
```

### Styling

- Use Tailwind CSS classes
- Custom colors in `tailwind.config.js`
- Use brand color for primary actions
- Responsive design: mobile-first approach

## Documentation

- Keep `docs/` files updated
- Document new APIs in `docs/API.md`
- Add database schema changes to `docs/DATABASE_SCHEMA.md`
- Update `README.md` for major changes

## Code Review

Before merging:
- Tests pass: `npm run test`
- Linting passes: `npm run lint`
- No console.log() in production code
- Error messages are user-friendly
- API errors follow standard format

## Reporting Bugs

1. Check existing issues
2. Provide steps to reproduce
3. Include error messages/logs
4. Specify environment (OS, Node version)
5. Add screenshots if UI-related

## Performance

- Minimize API calls
- Use React.memo for expensive components
- Lazy load routes
- Optimize MongoDB queries with indexes
- Cache AI responses for common requests

## Security

- Never commit `.env` files
- Sanitize user inputs
- Use HTTPS in production
- Validate JWT tokens
- Hash passwords with bcrypt
- Use CORS appropriately

## Questions?

- Check `docs/` folder
- Read existing code
- Open a GitHub issue
