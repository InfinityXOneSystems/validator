import { ValidationRunner } from '../src/core/ValidationRunner.js';
import { Validator, ValidationResult } from '../src/core/Validator.js';
import { ReportFormatter } from '../src/utils/ReportFormatter.js';

/**
 * Example: Creating custom validators
 */

// Custom validator for database checks
class DatabaseValidator extends Validator {
  constructor(options = {}) {
    super('Database', options);
    this.requireBackups = options.requireBackups !== false;
    this.maxConnections = options.maxConnections || 100;
  }

  async validate(context) {
    const issues = [];

    if (this.requireBackups && !context.hasBackups) {
      issues.push('Database backups are not configured');
    }

    if (context.activeConnections > this.maxConnections) {
      issues.push(`Active connections (${context.activeConnections}) exceed maximum (${this.maxConnections})`);
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

// Custom validator for API checks
class APIValidator extends Validator {
  constructor(options = {}) {
    super('API', options);
    this.requireVersioning = options.requireVersioning !== false;
    this.requireRateLimiting = options.requireRateLimiting !== false;
  }

  async validate(context) {
    const issues = [];

    if (this.requireVersioning && !context.hasApiVersioning) {
      issues.push('API versioning is not implemented');
    }

    if (this.requireRateLimiting && !context.hasRateLimiting) {
      issues.push('Rate limiting is not implemented');
    }

    const passed = issues.length === 0;
    return new ValidationResult(
      this.name,
      passed,
      passed ? 'API checks passed' : 'API issues found',
      { issues }
    );
  }
}

async function runCustomValidation() {
  console.log('Running Custom Validation\n');
  
  // Create validation runner
  const runner = new ValidationRunner({
    stopOnError: false,
    parallel: true  // Run validators in parallel
  });

  // Add custom validators
  runner.addValidator(new DatabaseValidator({
    requireBackups: true,
    maxConnections: 50
  }));

  runner.addValidator(new APIValidator({
    requireVersioning: true,
    requireRateLimiting: true
  }));

  // Create validation context
  const context = {
    hasBackups: true,
    activeConnections: 35,
    hasApiVersioning: true,
    hasRateLimiting: false
  };

  // Run validation
  const report = await runner.run(context);

  // Display report in markdown format
  console.log(ReportFormatter.formatMarkdown(report));

  return report.passed ? 0 : 1;
}

// Run example
runCustomValidation()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
