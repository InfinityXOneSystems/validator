import { Validator, ValidationResult } from '../core/Validator.js';

/**
 * Validates documentation requirements
 */
export class DocumentationValidator extends Validator {
  constructor(options = {}) {
    super('Documentation', options);
    this.requireReadme = options.requireReadme !== false;
    this.requireApiDocs = options.requireApiDocs || false;
    this.minDocCoverage = options.minDocCoverage || 70;
  }

  async validate(context) {
    const issues = [];

    // Check README existence
    if (this.requireReadme && !context.hasReadme) {
      issues.push('README.md file is required');
    }

    // Check API documentation
    if (this.requireApiDocs && !context.hasApiDocs) {
      issues.push('API documentation is required');
    }

    // Check documentation coverage
    if (context.docCoverage !== undefined) {
      if (context.docCoverage < this.minDocCoverage) {
        issues.push(`Documentation coverage ${context.docCoverage}% is below minimum ${this.minDocCoverage}%`);
      }
    }

    const passed = issues.length === 0;
    const message = passed 
      ? 'Documentation checks passed' 
      : `Documentation issues found: ${issues.join(', ')}`;

    return new ValidationResult(this.name, passed, message, {
      issues,
      hasReadme: context.hasReadme,
      hasApiDocs: context.hasApiDocs,
      docCoverage: context.docCoverage
    });
  }
}
