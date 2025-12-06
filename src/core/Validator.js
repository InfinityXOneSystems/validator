/**
 * Base Validator class that all validators must extend
 */
export class Validator {
  constructor(name, options = {}) {
    this.name = name;
    this.options = options;
    this.severity = options.severity || 'error'; // error, warning, info
    this.enabled = options.enabled !== false;
  }

  /**
   * Validate method to be implemented by child classes
   * @param {Object} context - Validation context
   * @returns {Promise<ValidationResult>}
   */
  async validate(context) {
    throw new Error(`validate() method must be implemented by ${this.name}`);
  }

  /**
   * Check if this validator should run
   * @param {Object} context - Validation context
   * @returns {boolean}
   */
  shouldRun(context) {
    return this.enabled;
  }

  /**
   * Get validator metadata
   * @returns {Object}
   */
  getMetadata() {
    return {
      name: this.name,
      severity: this.severity,
      enabled: this.enabled,
      options: this.options
    };
  }
}

/**
 * ValidationResult class to standardize validator outputs
 */
export class ValidationResult {
  constructor(validator, passed, message = '', details = {}) {
    this.validator = validator;
    this.passed = passed;
    this.message = message;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      validator: this.validator,
      passed: this.passed,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}
