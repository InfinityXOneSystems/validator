import { ValidationRunner } from '../core/ValidationRunner.js';
import { 
  CodeQualityValidator, 
  SecurityValidator, 
  DocumentationValidator 
} from '../validators/index.js';

/**
 * MVP Stage - Basic validation requirements for minimum viable product
 */
export class MVPStage {
  constructor(options = {}) {
    this.name = 'MVP';
    this.options = options;
  }

  /**
   * Create a validation runner configured for MVP stage
   * @returns {ValidationRunner}
   */
  createRunner() {
    const runner = new ValidationRunner({
      stopOnError: false,
      parallel: false
    });

    // MVP requires basic code quality
    runner.addValidator(new CodeQualityValidator({
      minCoverage: 60,  // Lower bar for MVP
      maxComplexity: 15,
      severity: 'warning'
    }));

    // Basic security checks
    runner.addValidator(new SecurityValidator({
      requireHttps: false,  // Can be relaxed for MVP
      checkDependencies: true,
      severity: 'error'
    }));

    // Basic documentation
    runner.addValidator(new DocumentationValidator({
      requireReadme: true,
      requireApiDocs: false,  // Not required for MVP
      minDocCoverage: 50,
      severity: 'warning'
    }));

    return runner;
  }

  /**
   * Get stage metadata
   * @returns {Object}
   */
  getMetadata() {
    return {
      name: this.name,
      description: 'Minimum Viable Product validation stage',
      requirements: [
        'Basic code quality (60% coverage)',
        'Security vulnerability checks',
        'README documentation'
      ]
    };
  }
}
