import { describe, it } from 'node:test';
import assert from 'node:assert';
import { MVPStage, ProductionStage, EnterpriseStage } from '../../src/stages/index.js';

describe('MVPStage', () => {
  it('should create MVP stage with correct metadata', () => {
    const stage = new MVPStage();
    const metadata = stage.getMetadata();
    
    assert.strictEqual(metadata.name, 'MVP');
    assert.ok(metadata.description);
    assert.ok(Array.isArray(metadata.requirements));
  });

  it('should create runner with MVP validators', () => {
    const stage = new MVPStage();
    const runner = stage.createRunner();
    
    assert.ok(runner);
    assert.ok(runner.validators.length > 0);
  });

  it('should pass MVP validation with acceptable context', async () => {
    const stage = new MVPStage();
    const runner = stage.createRunner();
    
    const context = {
      coverage: 65,
      complexity: 12,
      protocol: 'http',
      vulnerabilities: [],
      hasSecrets: false,
      hasReadme: true,
      docCoverage: 55
    };
    
    const report = await runner.run(context);
    assert.strictEqual(report.passed, true);
  });
});

describe('ProductionStage', () => {
  it('should create Production stage with correct metadata', () => {
    const stage = new ProductionStage();
    const metadata = stage.getMetadata();
    
    assert.strictEqual(metadata.name, 'Production');
    assert.ok(metadata.description);
    assert.ok(Array.isArray(metadata.requirements));
  });

  it('should create runner with Production validators', () => {
    const stage = new ProductionStage();
    const runner = stage.createRunner();
    
    assert.ok(runner);
    assert.ok(runner.validators.length > 0);
  });

  it('should pass Production validation with high-quality context', async () => {
    const stage = new ProductionStage();
    const runner = stage.createRunner();
    
    const context = {
      coverage: 85,
      complexity: 9,
      protocol: 'https',
      vulnerabilities: [],
      hasSecrets: false,
      responseTime: 800,
      memoryUsage: 400,
      hasReadme: true,
      hasApiDocs: true,
      docCoverage: 82,
      hasLicense: true
    };
    
    const report = await runner.run(context);
    assert.strictEqual(report.passed, true);
  });

  it('should fail Production validation with low coverage', async () => {
    const stage = new ProductionStage();
    const runner = stage.createRunner();
    
    const context = {
      coverage: 70,  // Below production threshold
      protocol: 'https',
      vulnerabilities: [],
      hasSecrets: false
    };
    
    const report = await runner.run(context);
    assert.strictEqual(report.passed, false);
  });
});

describe('EnterpriseStage', () => {
  it('should create Enterprise stage with correct metadata', () => {
    const stage = new EnterpriseStage();
    const metadata = stage.getMetadata();
    
    assert.strictEqual(metadata.name, 'Enterprise');
    assert.ok(metadata.description);
    assert.ok(Array.isArray(metadata.requirements));
  });

  it('should create runner with Enterprise validators', () => {
    const stage = new EnterpriseStage();
    const runner = stage.createRunner();
    
    assert.ok(runner);
    assert.ok(runner.validators.length > 0);
  });

  it('should pass Enterprise validation with excellent context', async () => {
    const stage = new EnterpriseStage();
    const runner = stage.createRunner();
    
    const context = {
      coverage: 92,
      complexity: 7,
      protocol: 'https',
      vulnerabilities: [],
      hasSecrets: false,
      responseTime: 450,
      memoryUsage: 200,
      hasReadme: true,
      hasApiDocs: true,
      docCoverage: 92,
      hasLicense: true,
      standards: ['ISO-27001', 'SOC-2', 'GDPR']
    };
    
    const report = await runner.run(context);
    assert.strictEqual(report.passed, true);
  });

  it('should fail Enterprise validation with insufficient standards', async () => {
    const stage = new EnterpriseStage();
    const runner = stage.createRunner();
    
    const context = {
      coverage: 92,
      complexity: 7,
      protocol: 'https',
      vulnerabilities: [],
      hasSecrets: false,
      responseTime: 450,
      memoryUsage: 200,
      hasReadme: true,
      hasApiDocs: true,
      docCoverage: 92,
      hasLicense: true,
      standards: ['ISO-27001']  // Missing SOC-2 and GDPR
    };
    
    const report = await runner.run(context);
    assert.strictEqual(report.passed, false);
  });
});
