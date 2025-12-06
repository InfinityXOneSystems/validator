import { ValidationResult } from './Validator.js';

/**
 * ValidationRunner orchestrates the execution of validators
 */
export class ValidationRunner {
  constructor(options = {}) {
    this.validators = [];
    this.stopOnError = options.stopOnError || false;
    this.parallel = options.parallel || false;
  }

  /**
   * Register a validator
   * @param {Validator} validator
   */
  addValidator(validator) {
    this.validators.push(validator);
  }

  /**
   * Register multiple validators
   * @param {Array<Validator>} validators
   */
  addValidators(validators) {
    this.validators.push(...validators);
  }

  /**
   * Run all registered validators
   * @param {Object} context - Validation context
   * @returns {Promise<ValidationReport>}
   */
  async run(context = {}) {
    const results = [];
    const startTime = Date.now();

    // Filter validators that should run
    const activeValidators = this.validators.filter(v => v.shouldRun(context));

    if (this.parallel) {
      // Run validators in parallel
      const promises = activeValidators.map(async (validator) => {
        try {
          return await validator.validate(context);
        } catch (error) {
          return new ValidationResult(
            validator.name,
            false,
            `Validator failed with error: ${error.message}`,
            { error: error.stack }
          );
        }
      });
      results.push(...await Promise.all(promises));
    } else {
      // Run validators sequentially
      for (const validator of activeValidators) {
        try {
          const result = await validator.validate(context);
          results.push(result);

          // Stop on first error if configured
          if (this.stopOnError && !result.passed) {
            break;
          }
        } catch (error) {
          const result = new ValidationResult(
            validator.name,
            false,
            `Validator failed with error: ${error.message}`,
            { error: error.stack }
          );
          results.push(result);

          if (this.stopOnError) {
            break;
          }
        }
      }
    }

    const endTime = Date.now();
    return new ValidationReport(results, endTime - startTime);
  }

  /**
   * Get all registered validators
   * @returns {Array<Validator>}
   */
  getValidators() {
    return this.validators;
  }

  /**
   * Clear all registered validators
   */
  clear() {
    this.validators = [];
  }
}

/**
 * ValidationReport aggregates results from all validators
 */
export class ValidationReport {
  constructor(results, duration) {
    this.results = results;
    this.duration = duration;
    this.passed = results.every(r => r.passed);
    this.totalValidators = results.length;
    this.passedValidators = results.filter(r => r.passed).length;
    this.failedValidators = results.filter(r => !r.passed).length;
    this.timestamp = new Date().toISOString();
  }

  /**
   * Get summary of the validation report
   * @returns {Object}
   */
  getSummary() {
    return {
      passed: this.passed,
      total: this.totalValidators,
      passed_count: this.passedValidators,
      failed_count: this.failedValidators,
      duration_ms: this.duration,
      timestamp: this.timestamp
    };
  }

  /**
   * Get failed validation results
   * @returns {Array<ValidationResult>}
   */
  getFailures() {
    return this.results.filter(r => !r.passed);
  }

  /**
   * Convert report to JSON
   * @returns {Object}
   */
  toJSON() {
    return {
      summary: this.getSummary(),
      results: this.results.map(r => r.toJSON())
    };
  }
}
