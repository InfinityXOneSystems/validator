import { ProductionStage } from '../src/stages/ProductionStage.js';
import { ReportFormatter } from '../src/utils/ReportFormatter.js';

/**
 * Example: Running Production stage validation
 */
async function runProductionValidation() {
  console.log('Running Production Stage Validation\n');
  
  // Create Production stage
  const prodStage = new ProductionStage();
  
  // Display stage information
  const metadata = prodStage.getMetadata();
  console.log(`Stage: ${metadata.name}`);
  console.log(`Description: ${metadata.description}\n`);
  console.log('Requirements:');
  metadata.requirements.forEach(req => console.log(`  - ${req}`));
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Create validation context
  const context = {
    // Code quality metrics
    coverage: 82,
    complexity: 9,
    
    // Security checks
    protocol: 'https',  // HTTPS required for production
    vulnerabilities: [],
    hasSecrets: false,
    
    // Performance metrics
    responseTime: 800,
    memoryUsage: 450,
    
    // Documentation
    hasReadme: true,
    hasApiDocs: true,
    docCoverage: 82,
    
    // Compliance
    hasLicense: true
  };
  
  // Run validation
  const runner = prodStage.createRunner();
  const report = await runner.run(context);
  
  // Display report
  console.log(ReportFormatter.formatText(report));
  
  // Return exit code
  return report.passed ? 0 : 1;
}

// Run example
runProductionValidation()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
