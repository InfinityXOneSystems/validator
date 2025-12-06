#!/usr/bin/env node

import { MVPStage, ProductionStage, EnterpriseStage } from './stages/index.js';
import { ReportFormatter } from './utils/ReportFormatter.js';

/**
 * CLI for running validation stages
 */
async function main() {
  const args = process.argv.slice(2);
  const stage = args[0] || 'mvp';
  const format = args[1] || 'text';

  console.log(`Running ${stage.toUpperCase()} validation...\n`);

  let stageInstance;
  switch (stage.toLowerCase()) {
    case 'mvp':
      stageInstance = new MVPStage();
      break;
    case 'production':
      stageInstance = new ProductionStage();
      break;
    case 'enterprise':
      stageInstance = new EnterpriseStage();
      break;
    default:
      console.error(`Unknown stage: ${stage}`);
      console.error('Valid stages: mvp, production, enterprise');
      process.exit(1);
  }

  // Show stage metadata
  const metadata = stageInstance.getMetadata();
  console.log(`Stage: ${metadata.name}`);
  console.log(`Description: ${metadata.description}`);
  console.log('\nRequirements:');
  metadata.requirements.forEach(req => console.log(`  - ${req}`));
  console.log('\n' + '='.repeat(60) + '\n');

  // Create runner and execute validation
  const runner = stageInstance.createRunner();
  
  // Example context - in real usage, this would come from analyzing the project
  const context = {
    // Code quality
    coverage: 85,
    complexity: 8,
    
    // Security
    protocol: 'https',
    vulnerabilities: [],
    hasSecrets: false,
    
    // Performance
    responseTime: 450,
    memoryUsage: 200,
    
    // Documentation
    hasReadme: true,
    hasApiDocs: true,
    docCoverage: 85,
    
    // Compliance
    hasLicense: true,
    standards: ['ISO-27001', 'SOC-2', 'GDPR'],
    hasAuditLogs: true
  };

  const report = await runner.run(context);

  // Format and display report
  let output;
  switch (format.toLowerCase()) {
    case 'json':
      output = ReportFormatter.formatJSON(report);
      break;
    case 'markdown':
      output = ReportFormatter.formatMarkdown(report);
      break;
    case 'html':
      output = ReportFormatter.formatHTML(report);
      break;
    case 'text':
    default:
      output = ReportFormatter.formatText(report);
      break;
  }

  console.log(output);

  // Exit with appropriate code
  process.exit(report.passed ? 0 : 1);
}

// Run CLI
main().catch(error => {
  console.error('Error running validation:', error);
  process.exit(1);
});
