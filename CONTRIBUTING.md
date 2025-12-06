# Contributing to Validator Modular System

Thank you for your interest in contributing to the Validator Modular System! This document provides guidelines for contributing to the project.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/validator.git`
3. Install dependencies: `npm install`
4. Create a new branch: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running Tests

```bash
npm test
```

### Running Examples

```bash
npm run example:mvp
npm run example:production
npm run example:enterprise
```

### Running the CLI

```bash
npm run validate <stage> <format>
```

## Project Structure

```
validator/
├── src/
│   ├── core/              # Core validation framework
│   ├── validators/        # Built-in validators
│   ├── stages/            # Pre-configured stages
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration examples
│   ├── index.js           # Main exports
│   └── cli.js             # CLI interface
├── tests/
│   ├── unit/              # Unit tests
│   └── integration/       # Integration tests
├── examples/              # Usage examples
└── docs/                  # Documentation

```

## Creating a New Validator

1. Create a new file in `src/validators/`
2. Extend the `Validator` base class
3. Implement the `validate()` method
4. Export your validator in `src/validators/index.js`
5. Add tests in `tests/unit/`

Example:

```javascript
import { Validator, ValidationResult } from '../core/Validator.js';

export class MyValidator extends Validator {
  constructor(options = {}) {
    super('MyValidator', options);
    // Initialize your options
  }

  async validate(context) {
    const issues = [];
    
    // Your validation logic
    
    const passed = issues.length === 0;
    return new ValidationResult(
      this.name,
      passed,
      passed ? 'Validation passed' : 'Validation failed',
      { issues }
    );
  }
}
```

## Creating a New Stage

1. Create a new file in `src/stages/`
2. Configure validators for the stage
3. Export your stage in `src/stages/index.js`
4. Add tests in `tests/integration/`

Example:

```javascript
import { ValidationRunner } from '../core/ValidationRunner.js';
import { CodeQualityValidator } from '../validators/index.js';

export class MyStage {
  constructor(options = {}) {
    this.name = 'MyStage';
    this.options = options;
  }

  createRunner() {
    const runner = new ValidationRunner();
    runner.addValidator(new CodeQualityValidator({ minCoverage: 70 }));
    return runner;
  }

  getMetadata() {
    return {
      name: this.name,
      description: 'My custom stage',
      requirements: ['Requirement 1', 'Requirement 2']
    };
  }
}
```

## Testing Guidelines

- Write tests for all new features
- Ensure all tests pass before submitting a PR
- Follow the existing test structure
- Use descriptive test names
- Test both success and failure cases

## Code Style

- Use ES6+ features
- Follow existing code formatting
- Use meaningful variable and function names
- Add JSDoc comments for public APIs
- Keep functions small and focused

## Commit Messages

Use clear and descriptive commit messages:

- `feat: Add new validator for X`
- `fix: Correct issue with Y`
- `docs: Update README with Z`
- `test: Add tests for W`
- `refactor: Improve V implementation`

## Pull Request Process

1. Update documentation if needed
2. Add tests for new features
3. Ensure all tests pass
4. Update CHANGELOG.md if applicable
5. Submit PR with clear description
6. Link related issues

## Code Review

All submissions require review. We use GitHub pull requests for this purpose. Reviewers will check:

- Code quality and style
- Test coverage
- Documentation
- Backwards compatibility
- Performance implications

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Publish to npm (maintainers only)

## Questions?

Open an issue for questions or discussions about:
- Feature requests
- Bug reports
- Design decisions
- Implementation details

## License

By contributing, you agree that your contributions will be licensed under the ISC License.

## Thank You!

Your contributions help make this project better for everyone!
