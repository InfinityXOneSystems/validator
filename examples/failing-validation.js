import { ProductionStage } from '../src/stages/ProductionStage.js';
import { ReportFormatter } from '../src/utils/ReportFormatter.js';

/**
 * Example: Demonstrating a failing validation
 * This shows what happens when a system does not meet production requirements
 */
async function runFailingValidation() {
  console.log('Running Production Stage Validation (with failures)\n');
  
  // Create Production stage
  const prodStage = new ProductionStage();
  
  // Display stage information
  const metadata = prodStage.getMetadata();
  console.log(`Stage: ${metadata.name}`);
  console.log(`Description: ${metadata.description}\n`);
  console.log('Requirements:');
  metadata.requirements.forEach(req => console.log(`  - ${req}`));
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Create validation context with FAILING criteria
  const context = {
    // Code quality metrics - TOO LOW
    coverage: 65,  // Below 80% requirement
    complexity: 15,  // Above 10 maximum
    
    // Security checks - INSECURE
    protocol: 'http',  // HTTPS required for production!
    vulnerabilities: [
      { severity: 'critical', package: 'old-library', cve: 'CVE-2023-1234' },
      { severity: 'critical', package: 'unsafe-lib', cve: 'CVE-2023-5678' }
    ],
    hasSecrets: true,  // Secrets detected!
    
    // Performance metrics - TOO SLOW
    responseTime: 1500,  // Above 1000ms limit
    memoryUsage: 600,  // Above 512MB limit
    
    // Documentation - INCOMPLETE
    hasReadme: true,
    hasApiDocs: false,  // API docs required for production!
    docCoverage: 60,  // Below 80% requirement
    
    // Compliance - MISSING
    hasLicense: false  // License required for production!
  };
  
  // Run validation
  const runner = prodStage.createRunner();
  const report = await runner.run(context);
  
  // Display report
  console.log(ReportFormatter.formatText(report));
  
  console.log('\n' + '='.repeat(60));
  console.log('FAILURE SUMMARY');
  console.log('='.repeat(60));
  
  const failures = report.getFailures();
  console.log(`\n${failures.length} validator(s) failed:\n`);
  
  failures.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure.validator}`);
    if (failure.details.issues) {
      failure.details.issues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    }
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('ACTION REQUIRED');
  console.log('='.repeat(60));
  console.log('\nThis system does NOT meet production requirements.');
  console.log('Please address the issues above before deploying to production.');
  console.log('');
  
  // Return exit code
  return report.passed ? 0 : 1;
}

// Run example
runFailingValidation()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
