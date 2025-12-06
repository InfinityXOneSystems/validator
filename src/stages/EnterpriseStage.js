import { ValidationRunner } from '../core/ValidationRunner.js';
import { 
  CodeQualityValidator, 
  SecurityValidator, 
  PerformanceValidator,
  DocumentationValidator,
  ComplianceValidator
} from '../validators/index.js';

/**
 * Enterprise Stage - Highest validation requirements for enterprise deployments
 */
export class EnterpriseStage {
  constructor(options = {}) {
    this.name = 'Enterprise';
    this.options = options;
  }

  /**
   * Create a validation runner configured for Enterprise stage
   * @returns {ValidationRunner}
   */
  createRunner() {
    const runner = new ValidationRunner({
      stopOnError: false,
      parallel: false
    });

    // Enterprise requires highest code quality
    runner.addValidator(new CodeQualityValidator({
      minCoverage: 90,
      maxComplexity: 8,
      severity: 'error'
    }));

    // Strictest security requirements
    runner.addValidator(new SecurityValidator({
      requireHttps: true,
      checkDependencies: true,
      severity: 'error'
    }));

    // Strict performance requirements
    runner.addValidator(new PerformanceValidator({
      maxResponseTime: 500,  // Faster response required
      maxMemoryUsage: 256,   // Lower memory footprint
      severity: 'error'
    }));

    // Complete documentation
    runner.addValidator(new DocumentationValidator({
      requireReadme: true,
      requireApiDocs: true,
      minDocCoverage: 90,
      severity: 'error'
    }));

    // Full compliance requirements
    runner.addValidator(new ComplianceValidator({
      requireLicense: true,
      standards: ['ISO-27001', 'SOC-2', 'GDPR'],
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
      description: 'Enterprise-grade validation stage',
      requirements: [
        'Highest code quality (90% coverage)',
        'Strictest security requirements',
        'Optimal performance (500ms response, 256MB memory)',
        'Complete documentation (90% coverage)',
        'Full compliance (ISO-27001, SOC-2, GDPR)'
      ]
    };
  }
}
