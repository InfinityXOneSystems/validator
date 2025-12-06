import { Validator, ValidationResult } from '../core/Validator.js';

/**
 * Validates performance requirements
 */
export class PerformanceValidator extends Validator {
  constructor(options = {}) {
    super('Performance', options);
    this.maxResponseTime = options.maxResponseTime || 1000; // ms
    this.maxMemoryUsage = options.maxMemoryUsage || 512; // MB
  }

  async validate(context) {
    const issues = [];

    // Check response time
    if (context.responseTime !== undefined) {
      if (context.responseTime > this.maxResponseTime) {
        issues.push(`Response time ${context.responseTime}ms exceeds maximum ${this.maxResponseTime}ms`);
      }
    }

    // Check memory usage
    if (context.memoryUsage !== undefined) {
      if (context.memoryUsage > this.maxMemoryUsage) {
        issues.push(`Memory usage ${context.memoryUsage}MB exceeds maximum ${this.maxMemoryUsage}MB`);
      }
    }

    const passed = issues.length === 0;
    const message = passed 
      ? 'Performance checks passed' 
      : `Performance issues found: ${issues.join(', ')}`;

    return new ValidationResult(this.name, passed, message, {
      issues,
      responseTime: context.responseTime,
      memoryUsage: context.memoryUsage
    });
  }
}
