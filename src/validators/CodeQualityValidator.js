import { Validator, ValidationResult } from '../core/Validator.js';

/**
 * Validates code quality standards
 */
export class CodeQualityValidator extends Validator {
  constructor(options = {}) {
    super('CodeQuality', options);
    this.minCoverage = options.minCoverage || 80;
    this.maxComplexity = options.maxComplexity || 10;
  }

  async validate(context) {
    const issues = [];

    // Check test coverage if available
    if (context.coverage !== undefined) {
      if (context.coverage < this.minCoverage) {
        issues.push(`Test coverage ${context.coverage}% is below minimum ${this.minCoverage}%`);
      }
    }

    // Check code complexity if available
    if (context.complexity !== undefined) {
      if (context.complexity > this.maxComplexity) {
        issues.push(`Code complexity ${context.complexity} exceeds maximum ${this.maxComplexity}`);
      }
    }

    const passed = issues.length === 0;
    const message = passed 
      ? 'Code quality checks passed' 
      : `Code quality issues found: ${issues.join(', ')}`;

    return new ValidationResult(this.name, passed, message, {
      issues,
      coverage: context.coverage,
      complexity: context.complexity
    });
  }
}
