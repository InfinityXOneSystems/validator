import { Validator, ValidationResult } from '../core/Validator.js';

/**
 * Validates compliance and regulatory requirements
 */
export class ComplianceValidator extends Validator {
  constructor(options = {}) {
    super('Compliance', options);
    this.requireLicense = options.requireLicense !== false;
    this.standards = options.standards || [];
  }

  async validate(context) {
    const issues = [];

    // Check license file
    if (this.requireLicense && !context.hasLicense) {
      issues.push('LICENSE file is required');
    }

    // Check compliance with specific standards
    for (const standard of this.standards) {
      if (context.standards && !context.standards.includes(standard)) {
        issues.push(`Non-compliant with ${standard} standard`);
      }
    }

    // Check audit logs if required
    if (context.requireAuditLogs && !context.hasAuditLogs) {
      issues.push('Audit logging is required but not implemented');
    }

    const passed = issues.length === 0;
    const message = passed 
      ? 'Compliance checks passed' 
      : `Compliance issues found: ${issues.join(', ')}`;

    return new ValidationResult(this.name, passed, message, {
      issues,
      hasLicense: context.hasLicense,
      standards: this.standards
    });
  }
}
