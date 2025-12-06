import { ValidationRunner } from '../core/ValidationRunner.js';
import { 
  CodeQualityValidator, 
  SecurityValidator, 
  PerformanceValidator,
  DocumentationValidator,
  ComplianceValidator
} from '../validators/index.js';

/**
 * Production Stage - Stricter validation requirements for production deployments
 */
export class ProductionStage {
  constructor(options = {}) {
    this.name = 'Production';
    this.options = options;
  }

  /**
   * Create a validation runner configured for Production stage
   * @returns {ValidationRunner}
   */
  createRunner() {
    const runner = new ValidationRunner({
      stopOnError: false,
      parallel: false
    });

    // Production requires high code quality
    runner.addValidator(new CodeQualityValidator({
      minCoverage: 80,
      maxComplexity: 10,
      severity: 'error'
    }));

    // Strict security requirements
    runner.addValidator(new SecurityValidator({
      requireHttps: true,
      checkDependencies: true,
      severity: 'error'
    }));

    // Performance requirements
    runner.addValidator(new PerformanceValidator({
      maxResponseTime: 1000,
      maxMemoryUsage: 512,
      severity: 'error'
    }));

    // Comprehensive documentation
    runner.addValidator(new DocumentationValidator({
      requireReadme: true,
      requireApiDocs: true,
      minDocCoverage: 80,
      severity: 'error'
    }));

    // Basic compliance
    runner.addValidator(new ComplianceValidator({
      requireLicense: true,
      severity: 'error'
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
      description: 'Production-ready validation stage',
      requirements: [
        'High code quality (80% coverage)',
        'Strict security (HTTPS required)',
        'Performance requirements met',
        'Comprehensive documentation',
        'License file required'
      ]
    };
  }
}
