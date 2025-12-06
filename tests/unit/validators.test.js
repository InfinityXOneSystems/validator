import { describe, it } from 'node:test';
import assert from 'node:assert';
import {
  CodeQualityValidator,
  SecurityValidator,
  PerformanceValidator,
  DocumentationValidator,
  ComplianceValidator
} from '../../src/validators/index.js';

describe('CodeQualityValidator', () => {
  it('should pass with good code quality', async () => {
    const validator = new CodeQualityValidator({ minCoverage: 80, maxComplexity: 10 });
    const context = { coverage: 85, complexity: 8 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, true);
    assert.strictEqual(result.validator, 'CodeQuality');
  });

  it('should fail with low coverage', async () => {
    const validator = new CodeQualityValidator({ minCoverage: 80 });
    const context = { coverage: 70 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('coverage'));
  });

  it('should fail with high complexity', async () => {
    const validator = new CodeQualityValidator({ maxComplexity: 10 });
    const context = { complexity: 15 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('complexity'));
  });
});

describe('SecurityValidator', () => {
  it('should pass with secure configuration', async () => {
    const validator = new SecurityValidator();
    const context = { protocol: 'https', vulnerabilities: [], hasSecrets: false };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, true);
  });

  it('should fail with http protocol', async () => {
    const validator = new SecurityValidator({ requireHttps: true });
    const context = { protocol: 'http' };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('HTTPS'));
  });

  it('should fail with critical vulnerabilities', async () => {
    const validator = new SecurityValidator();
    const context = {
      vulnerabilities: [{ severity: 'critical', package: 'test' }]
    };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('vulnerabilities'));
  });

  it('should fail with secrets detected', async () => {
    const validator = new SecurityValidator();
    const context = { hasSecrets: true };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('Secrets'));
  });
});

describe('PerformanceValidator', () => {
  it('should pass with good performance', async () => {
    const validator = new PerformanceValidator({ maxResponseTime: 1000, maxMemoryUsage: 512 });
    const context = { responseTime: 500, memoryUsage: 300 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, true);
  });

  it('should fail with slow response time', async () => {
    const validator = new PerformanceValidator({ maxResponseTime: 1000 });
    const context = { responseTime: 1500 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('Response time'));
  });

  it('should fail with high memory usage', async () => {
    const validator = new PerformanceValidator({ maxMemoryUsage: 512 });
    const context = { memoryUsage: 600 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('Memory usage'));
  });
});

describe('DocumentationValidator', () => {
  it('should pass with complete documentation', async () => {
    const validator = new DocumentationValidator();
    const context = { hasReadme: true, hasApiDocs: false, docCoverage: 80 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, true);
  });

  it('should fail without README', async () => {
    const validator = new DocumentationValidator({ requireReadme: true });
    const context = { hasReadme: false };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('README'));
  });

  it('should fail without API docs when required', async () => {
    const validator = new DocumentationValidator({ requireApiDocs: true });
    const context = { hasApiDocs: false };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('API documentation'));
  });

  it('should fail with low doc coverage', async () => {
    const validator = new DocumentationValidator({ minDocCoverage: 80 });
    const context = { docCoverage: 60 };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('Documentation coverage'));
  });
});

describe('ComplianceValidator', () => {
  it('should pass with compliance met', async () => {
    const validator = new ComplianceValidator();
    const context = { hasLicense: true };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, true);
  });

  it('should fail without license', async () => {
    const validator = new ComplianceValidator({ requireLicense: true });
    const context = { hasLicense: false };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('LICENSE'));
  });

  it('should fail with non-compliant standards', async () => {
    const validator = new ComplianceValidator({ standards: ['ISO-27001', 'SOC-2'] });
    const context = { standards: ['ISO-27001'] };
    const result = await validator.validate(context);
    
    assert.strictEqual(result.passed, false);
    assert.ok(result.message.includes('SOC-2'));
  });
});
