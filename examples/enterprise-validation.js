import { EnterpriseStage } from '../src/stages/EnterpriseStage.js';
import { ReportFormatter } from '../src/utils/ReportFormatter.js';

/**
 * Example: Running Enterprise stage validation
 */
async function runEnterpriseValidation() {
  console.log('Running Enterprise Stage Validation\n');
  
  // Create Enterprise stage
  const enterpriseStage = new EnterpriseStage();
  
  // Display stage information
  const metadata = enterpriseStage.getMetadata();
  console.log(`Stage: ${metadata.name}`);
  console.log(`Description: ${metadata.description}\n`);
  console.log('Requirements:');
  metadata.requirements.forEach(req => console.log(`  - ${req}`));
  console.log('\n' + '='.repeat(60) + '\n');
  
  // Create validation context
  const context = {
    // Code quality metrics
    coverage: 92,
    complexity: 7,
    
    // Security checks
    protocol: 'https',
    vulnerabilities: [],
    hasSecrets: false,
    
    // Performance metrics
    responseTime: 450,
    memoryUsage: 200,
    
    // Documentation
    hasReadme: true,
    hasApiDocs: true,
    docCoverage: 91,
    
    // Compliance
    hasLicense: true,
    standards: ['ISO-27001', 'SOC-2', 'GDPR'],
    requireAuditLogs: true,
    hasAuditLogs: true
  };
  
  // Run validation
  const runner = enterpriseStage.createRunner();
  const report = await runner.run(context);
  
  // Display report
  console.log(ReportFormatter.formatText(report));
  
  // Return exit code
  return report.passed ? 0 : 1;
}

// Run example
runEnterpriseValidation()
  .then(exitCode => process.exit(exitCode))
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
