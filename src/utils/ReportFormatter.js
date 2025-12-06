/**
 * Formats validation reports for different output formats
 */
export class ReportFormatter {
  /**
   * Format report as plain text
   * @param {ValidationReport} report
   * @returns {string}
   */
  static formatText(report) {
    const lines = [];
    const summary = report.getSummary();
    
    lines.push('='.repeat(60));
    lines.push('VALIDATION REPORT');
    lines.push('='.repeat(60));
    lines.push('');
    lines.push(`Status: ${summary.passed ? '✓ PASSED' : '✗ FAILED'}`);
    lines.push(`Total Validators: ${summary.total}`);
    lines.push(`Passed: ${summary.passed_count}`);
    lines.push(`Failed: ${summary.failed_count}`);
    lines.push(`Duration: ${summary.duration_ms}ms`);
    lines.push(`Timestamp: ${summary.timestamp}`);
    lines.push('');
    lines.push('='.repeat(60));
    lines.push('RESULTS');
    lines.push('='.repeat(60));
    
    for (const result of report.results) {
      const status = result.passed ? '✓' : '✗';
      lines.push('');
      lines.push(`${status} ${result.validator}`);
      lines.push(`  ${result.message}`);
      
      if (result.details && result.details.issues && result.details.issues.length > 0) {
        lines.push('  Issues:');
        for (const issue of result.details.issues) {
          lines.push(`    - ${issue}`);
        }
      }
    }
    
    lines.push('');
    lines.push('='.repeat(60));
    
    return lines.join('\n');
  }

  /**
   * Format report as JSON
   * @param {ValidationReport} report
   * @returns {string}
   */
  static formatJSON(report) {
    return JSON.stringify(report.toJSON(), null, 2);
  }

  /**
   * Format report as markdown
   * @param {ValidationReport} report
   * @returns {string}
   */
  static formatMarkdown(report) {
    const lines = [];
    const summary = report.getSummary();
    
    lines.push('# Validation Report');
    lines.push('');
    lines.push('## Summary');
    lines.push('');
    lines.push(`- **Status**: ${summary.passed ? '✓ PASSED' : '✗ FAILED'}`);
    lines.push(`- **Total Validators**: ${summary.total}`);
    lines.push(`- **Passed**: ${summary.passed_count}`);
    lines.push(`- **Failed**: ${summary.failed_count}`);
    lines.push(`- **Duration**: ${summary.duration_ms}ms`);
    lines.push(`- **Timestamp**: ${summary.timestamp}`);
    lines.push('');
    lines.push('## Results');
    lines.push('');
    
    for (const result of report.results) {
      const status = result.passed ? '✓' : '✗';
      lines.push(`### ${status} ${result.validator}`);
      lines.push('');
      lines.push(result.message);
      lines.push('');
      
      if (result.details && result.details.issues && result.details.issues.length > 0) {
        lines.push('**Issues:**');
        lines.push('');
        for (const issue of result.details.issues) {
          lines.push(`- ${issue}`);
        }
        lines.push('');
      }
    }
    
    return lines.join('\n');
  }

  /**
   * Format report as HTML
   * @param {ValidationReport} report
   * @returns {string}
   */
  static formatHTML(report) {
    const summary = report.getSummary();
    const statusClass = summary.passed ? 'success' : 'failure';
    const statusText = summary.passed ? 'PASSED' : 'FAILED';
    
    let html = `
<!DOCTYPE html>
<html>
<head>
  <title>Validation Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
    .container { max-width: 900px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    h1 { color: #333; border-bottom: 3px solid #007bff; padding-bottom: 10px; }
    .summary { background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .summary-item { margin: 8px 0; }
    .status { font-size: 24px; font-weight: bold; padding: 10px; border-radius: 5px; text-align: center; margin: 20px 0; }
    .success { background: #d4edda; color: #155724; }
    .failure { background: #f8d7da; color: #721c24; }
    .result { margin: 20px 0; padding: 15px; border-left: 4px solid #007bff; background: #f8f9fa; border-radius: 5px; }
    .result.passed { border-left-color: #28a745; }
    .result.failed { border-left-color: #dc3545; }
    .result-header { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
    .result-message { margin: 10px 0; color: #666; }
    .issues { margin-top: 10px; }
    .issues ul { margin: 5px 0; padding-left: 20px; }
    .issues li { color: #d9534f; margin: 5px 0; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Validation Report</h1>
    
    <div class="status ${statusClass}">${statusText}</div>
    
    <div class="summary">
      <h2>Summary</h2>
      <div class="summary-item"><strong>Total Validators:</strong> ${summary.total}</div>
      <div class="summary-item"><strong>Passed:</strong> ${summary.passed_count}</div>
      <div class="summary-item"><strong>Failed:</strong> ${summary.failed_count}</div>
      <div class="summary-item"><strong>Duration:</strong> ${summary.duration_ms}ms</div>
      <div class="summary-item"><strong>Timestamp:</strong> ${summary.timestamp}</div>
    </div>
    
    <h2>Results</h2>
`;
    
    for (const result of report.results) {
      const resultClass = result.passed ? 'passed' : 'failed';
      const statusIcon = result.passed ? '✓' : '✗';
      
      html += `
    <div class="result ${resultClass}">
      <div class="result-header">${statusIcon} ${result.validator}</div>
      <div class="result-message">${result.message}</div>
`;
      
      if (result.details && result.details.issues && result.details.issues.length > 0) {
        html += `
      <div class="issues">
        <strong>Issues:</strong>
        <ul>
`;
        for (const issue of result.details.issues) {
          html += `          <li>${issue}</li>\n`;
        }
        html += `
        </ul>
      </div>
`;
      }
      
      html += `    </div>\n`;
    }
    
    html += `
  </div>
</body>
</html>
`;
    
    return html;
  }
}
