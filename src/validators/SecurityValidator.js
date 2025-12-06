import { Validator, ValidationResult } from '../core/Validator.js';

/**
 * Validates security requirements
 */
export class SecurityValidator extends Validator {
  constructor(options = {}) {
    super('Security', options);
    this.requireHttps = options.requireHttps !== false;
    this.checkDependencies = options.checkDependencies !== false;
  }

  async validate(context) {
    const issues = [];

    // Check HTTPS requirement
    if (this.requireHttps && context.protocol) {
      if (context.protocol === 'http') {
        issues.push('HTTPS is required but HTTP protocol detected');
      }
    }

    // Check for vulnerable dependencies
    if (this.checkDependencies && context.vulnerabilities) {
      const criticalVulns = context.vulnerabilities.filter(v => v.severity === 'critical');
      if (criticalVulns.length > 0) {
        issues.push(`${criticalVulns.length} critical vulnerabilities found in dependencies`);
      }
    }

    // Check for secrets in code
    if (context.hasSecrets) {
      issues.push('Secrets or sensitive data detected in code');
    }

    const passed = issues.length === 0;
    const message = passed 
      ? 'Security checks passed' 
      : `Security issues found: ${issues.join(', ')}`;

    return new ValidationResult(this.name, passed, message, {
      issues,
      requireHttps: this.requireHttps,
      checkDependencies: this.checkDependencies
    });
  }
}
