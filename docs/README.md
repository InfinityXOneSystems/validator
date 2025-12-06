# Validator Modular System Documentation

## Overview

The Validator Modular System is a comprehensive validation framework designed to ensure that all systems meet the required quality, security, performance, and compliance standards before progressing through different deployment stages (MVP, Production, and Enterprise).

## Architecture

### Core Components

1. **Validator**: Base class for all validators
2. **ValidationRunner**: Orchestrates the execution of multiple validators
3. **ValidationResult**: Standardized result format from validators
4. **ValidationReport**: Aggregates results from all validators

### Built-in Validators

- **CodeQualityValidator**: Validates code quality metrics (coverage, complexity)
- **SecurityValidator**: Validates security requirements (HTTPS, vulnerabilities, secrets)
- **PerformanceValidator**: Validates performance metrics (response time, memory usage)
- **DocumentationValidator**: Validates documentation completeness
- **ComplianceValidator**: Validates compliance and regulatory requirements

### Validation Stages

#### MVP Stage
- **Purpose**: Minimum viable product validation
- **Requirements**:
  - Basic code quality (60% coverage)
  - Security vulnerability checks
  - README documentation
- **Suitable for**: Initial development, prototypes, proof of concepts

#### Production Stage
- **Purpose**: Production-ready validation
- **Requirements**:
  - High code quality (80% coverage)
  - Strict security (HTTPS required)
  - Performance requirements met
  - Comprehensive documentation
  - License file required
- **Suitable for**: Production deployments, customer-facing applications

#### Enterprise Stage
- **Purpose**: Enterprise-grade validation
- **Requirements**:
  - Highest code quality (90% coverage)
  - Strictest security requirements
  - Optimal performance (500ms response, 256MB memory)
  - Complete documentation (90% coverage)
  - Full compliance (ISO-27001, SOC-2, GDPR)
- **Suitable for**: Enterprise deployments, regulated industries, mission-critical systems

## Installation

```bash
npm install @infinityxonesystems/validator
```

## Usage

### Using Pre-configured Stages

```javascript
import { MVPStage } from '@infinityxonesystems/validator';
import { ReportFormatter } from '@infinityxonesystems/validator';

// Create MVP stage
const mvpStage = new MVPStage();

// Create validation context with your metrics
const context = {
  coverage: 65,
  complexity: 12,
  protocol: 'http',
  vulnerabilities: [],
  hasSecrets: false,
  hasReadme: true,
  docCoverage: 55
};

// Run validation
const runner = mvpStage.createRunner();
const report = await runner.run(context);

// Display results
console.log(ReportFormatter.formatText(report));
```

### Creating Custom Validators

```javascript
import { Validator, ValidationResult } from '@infinityxonesystems/validator';

class DatabaseValidator extends Validator {
  constructor(options = {}) {
    super('Database', options);
    this.requireBackups = options.requireBackups !== false;
  }

  async validate(context) {
    const issues = [];

    if (this.requireBackups && !context.hasBackups) {
      issues.push('Database backups are not configured');
    }

    const passed = issues.length === 0;
    return new ValidationResult(
      this.name,
      passed,
      passed ? 'Database checks passed' : 'Database issues found',
      { issues }
    );
  }
}
```

### Creating Custom Validation Pipelines

```javascript
import { ValidationRunner } from '@infinityxonesystems/validator';
import { CodeQualityValidator, SecurityValidator } from '@infinityxonesystems/validator';

const runner = new ValidationRunner({
  stopOnError: false,
  parallel: true  // Run validators in parallel for better performance
});

runner.addValidator(new CodeQualityValidator({ minCoverage: 75 }));
runner.addValidator(new SecurityValidator({ requireHttps: true }));

const report = await runner.run(context);
```

## CLI Usage

Run validation from the command line:

```bash
# Run MVP validation
npm run validate mvp

# Run Production validation
npm run validate production text

# Run Enterprise validation with JSON output
npm run validate enterprise json

# Run Enterprise validation with HTML output
npm run validate enterprise html
```

### Output Formats

- **text**: Human-readable text format (default)
- **json**: JSON format for integration with other tools
- **markdown**: Markdown format for documentation
- **html**: HTML format with styling for reports

## API Reference

### Validator

```javascript
class Validator {
  constructor(name, options = {})
  async validate(context): Promise<ValidationResult>
  shouldRun(context): boolean
  getMetadata(): Object
}
```

### ValidationRunner

```javascript
class ValidationRunner {
  constructor(options = {})
  addValidator(validator: Validator): void
  addValidators(validators: Array<Validator>): void
  async run(context): Promise<ValidationReport>
  getValidators(): Array<Validator>
  clear(): void
}
```

### ValidationResult

```javascript
class ValidationResult {
  constructor(validator, passed, message, details)
  toJSON(): Object
}
```

### ValidationReport

```javascript
class ValidationReport {
  constructor(results, duration)
  getSummary(): Object
  getFailures(): Array<ValidationResult>
  toJSON(): Object
}
```

## Examples

See the `examples/` directory for complete examples:

- `mvp-validation.js`: MVP stage validation
- `production-validation.js`: Production stage validation
- `enterprise-validation.js`: Enterprise stage validation
- `custom-validation.js`: Custom validators and pipelines

## Testing

Run the test suite:

```bash
npm test
```

## Best Practices

1. **Start with MVP**: Begin with MVP validation and progressively move to higher stages
2. **Customize for Your Needs**: Extend validators or create custom ones for specific requirements
3. **Automate in CI/CD**: Integrate validation into your CI/CD pipeline
4. **Monitor Trends**: Track validation results over time to identify improvements or regressions
5. **Document Requirements**: Clearly document what each validation stage requires

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: Validation

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run validate production json > validation-report.json
      - uses: actions/upload-artifact@v2
        with:
          name: validation-report
          path: validation-report.json
```

## Contributing

Contributions are welcome! Please follow the coding standards and add tests for any new features.

## License

ISC
