import { MVPStage } from '../src/stages/MVPStage.js';
import { ReportFormatter } from '../src/utils/ReportFormatter.js';

/**
 * Example: Running MVP stage validation
 */
async function runMVPValidation() {
  console.log('Running MVP Stage Validation\n');
  
  // Create MVP stage
  const mvpStage = new MVPStage();
  
  // Display stage information
  const metadata = mvpStage.getMetadata();
  console.log(`Stage: ${metadata.name}`);
  console.log(`Description: ${metadata.description}\n`);
  console.log('Requirements:');
  metadata.requirements.forEach(req => console.log(`  - ${req}`));
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Create validation context
  const context = {
    // Code quality metrics
    coverage: 65,
    complexity: 12,
    
    // Security checks
    protocol: 'http',  // HTTP is acceptable for MVP
    vulnerabilities: [
      { severity: 'low', package: 'example-lib' }
    ],
    hasSecrets: false,
    
    // Documentation
    hasReadme: true,
    hasApiDocs: false,  // Not required for MVP
    docCoverage: 55
  };
  
  // Run validation
  const runner = mvpStage.createRunner();
  const report = await runner.run(context);
  
  // Display report
  console.log(ReportFormatter.formatText(report));
  
  // Return exit code
  return report.passed ? 0 : 1;
}

// Run example
runMVPValidation()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
