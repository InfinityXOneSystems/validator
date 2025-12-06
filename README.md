# Validator Modular System

A comprehensive modular validation system for ensuring code quality, security, performance, and compliance standards before progressing through MVP, Production, and Enterprise deployment stages.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run MVP validation
npm run validate mvp

# Run Production validation
npm run validate production

# Run Enterprise validation
npm run validate enterprise

# Run tests
npm test
```

## 📋 Overview

The Validator Modular System provides a flexible, extensible framework for validating projects against configurable standards. It includes:

- **Three pre-configured stages**: MVP, Production, and Enterprise
- **Five built-in validators**: Code Quality, Security, Performance, Documentation, and Compliance
- **Multiple output formats**: Text, JSON, Markdown, and HTML
- **Extensible architecture**: Easy to create custom validators
- **Parallel execution**: Run validators concurrently for faster results

## 🎯 Validation Stages

### MVP Stage
Basic validation for minimum viable products:
- ✓ Basic code quality (60% coverage)
- ✓ Security vulnerability checks
- ✓ README documentation

### Production Stage
Stricter validation for production deployments:
- ✓ High code quality (80% coverage)
- ✓ Strict security (HTTPS required)
- ✓ Performance requirements
- ✓ Comprehensive documentation
- ✓ License file required

### Enterprise Stage
Highest validation for enterprise deployments:
- ✓ Highest code quality (90% coverage)
- ✓ Strictest security requirements
- ✓ Optimal performance (500ms response, 256MB memory)
- ✓ Complete documentation (90% coverage)
- ✓ Full compliance (ISO-27001, SOC-2, GDPR)

## 📖 Usage

### Using Pre-configured Stages

```javascript
import { ProductionStage, ReportFormatter } from '@infinityxonesystems/validator';

const stage = new ProductionStage();
const runner = stage.createRunner();

const context = {
  coverage: 85,
  complexity: 9,
  protocol: 'https',
  vulnerabilities: [],
  hasSecrets: false,
  responseTime: 800,
  memoryUsage: 400,
  hasReadme: true,
  hasApiDocs: true,
  docCoverage: 82,
  hasLicense: true
};

const report = await runner.run(context);
console.log(ReportFormatter.formatText(report));
```

### Creating Custom Validators

```javascript
import { Validator, ValidationResult } from '@infinityxonesystems/validator';

class CustomValidator extends Validator {
  constructor(options = {}) {
    super('Custom', options);
  }

  async validate(context) {
    const passed = context.customCheck === true;
    return new ValidationResult(
      this.name,
      passed,
      passed ? 'Custom check passed' : 'Custom check failed'
    );
  }
}
```

## 🔧 Built-in Validators

- **CodeQualityValidator**: Test coverage, code complexity
- **SecurityValidator**: HTTPS, vulnerabilities, secrets detection
- **PerformanceValidator**: Response time, memory usage
- **DocumentationValidator**: README, API docs, doc coverage
- **ComplianceValidator**: License, compliance standards, audit logs

## 📊 Output Formats

Generate reports in multiple formats:

```bash
npm run validate production text      # Text (default)
npm run validate production json      # JSON
npm run validate production markdown  # Markdown
npm run validate production html      # HTML
```

## 🧪 Examples

See the `examples/` directory for complete examples:
- `mvp-validation.js`
- `production-validation.js`
- `enterprise-validation.js`
- `custom-validation.js`

Run examples:
```bash
npm run example:mvp
npm run example:production
npm run example:enterprise
```

## 📚 Documentation

See the [full documentation](docs/README.md) for:
- Architecture details
- API reference
- Best practices
- CI/CD integration
- Advanced usage

## 🧪 Testing

Run the test suite:

```bash
npm test
```

## 🤝 Contributing

Contributions are welcome! The validator system is designed to be extensible, so you can:
- Add new validators
- Create new validation stages
- Improve existing validators
- Add new output formats

## 📄 License

ISC

## 🔗 Links

- [Documentation](docs/README.md)
- [Examples](examples/)
- [Tests](tests/)