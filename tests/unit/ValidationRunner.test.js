import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ValidationRunner, ValidationReport } from '../../src/core/ValidationRunner.js';
import { Validator, ValidationResult } from '../../src/core/Validator.js';

class MockValidator extends Validator {
  constructor(name, shouldPass = true) {
    super(name);
    this.shouldPass = shouldPass;
  }

  async validate(context) {
    return new ValidationResult(
      this.name,
      this.shouldPass,
      this.shouldPass ? 'Passed' : 'Failed'
    );
  }
}

describe('ValidationRunner', () => {
  it('should create a runner with default options', () => {
    const runner = new ValidationRunner();
    assert.strictEqual(runner.stopOnError, false);
    assert.strictEqual(runner.parallel, false);
    assert.strictEqual(runner.validators.length, 0);
  });

  it('should add validators', () => {
    const runner = new ValidationRunner();
    const validator = new MockValidator('Test');
    
    runner.addValidator(validator);
    assert.strictEqual(runner.validators.length, 1);
    assert.strictEqual(runner.validators[0], validator);
  });

  it('should add multiple validators', () => {
    const runner = new ValidationRunner();
    const validators = [
      new MockValidator('Test1'),
      new MockValidator('Test2')
    ];
    
    runner.addValidators(validators);
    assert.strictEqual(runner.validators.length, 2);
  });

  it('should run validators and return report', async () => {
    const runner = new ValidationRunner();
    runner.addValidator(new MockValidator('Test1', true));
    runner.addValidator(new MockValidator('Test2', true));
    
    const report = await runner.run();
    assert.ok(report instanceof ValidationReport);
    assert.strictEqual(report.results.length, 2);
    assert.strictEqual(report.passed, true);
  });

  it('should handle failing validators', async () => {
    const runner = new ValidationRunner();
    runner.addValidator(new MockValidator('Test1', true));
    runner.addValidator(new MockValidator('Test2', false));
    
    const report = await runner.run();
    assert.strictEqual(report.passed, false);
    assert.strictEqual(report.failedValidators, 1);
  });

  it('should stop on error when configured', async () => {
    const runner = new ValidationRunner({ stopOnError: true });
    runner.addValidator(new MockValidator('Test1', false));
    runner.addValidator(new MockValidator('Test2', true));
    
    const report = await runner.run();
    assert.strictEqual(report.results.length, 1);
  });

  it('should skip disabled validators', async () => {
    const runner = new ValidationRunner();
    const validator = new MockValidator('Test1', true);
    validator.enabled = false;
    
    runner.addValidator(validator);
    runner.addValidator(new MockValidator('Test2', true));
    
    const report = await runner.run();
    assert.strictEqual(report.results.length, 1);
  });

  it('should clear validators', () => {
    const runner = new ValidationRunner();
    runner.addValidator(new MockValidator('Test'));
    assert.strictEqual(runner.validators.length, 1);
    
    runner.clear();
    assert.strictEqual(runner.validators.length, 0);
  });
});

describe('ValidationReport', () => {
  it('should create a report with correct summary', () => {
    const results = [
      new ValidationResult('Test1', true, 'Passed'),
      new ValidationResult('Test2', false, 'Failed')
    ];
    const report = new ValidationReport(results, 100);
    
    assert.strictEqual(report.results.length, 2);
    assert.strictEqual(report.passed, false);
    assert.strictEqual(report.totalValidators, 2);
    assert.strictEqual(report.passedValidators, 1);
    assert.strictEqual(report.failedValidators, 1);
    assert.strictEqual(report.duration, 100);
  });

  it('should get summary', () => {
    const results = [
      new ValidationResult('Test1', true, 'Passed')
    ];
    const report = new ValidationReport(results, 50);
    const summary = report.getSummary();
    
    assert.strictEqual(summary.passed, true);
    assert.strictEqual(summary.total, 1);
    assert.strictEqual(summary.passed_count, 1);
    assert.strictEqual(summary.failed_count, 0);
    assert.strictEqual(summary.duration_ms, 50);
  });

  it('should get failures', () => {
    const results = [
      new ValidationResult('Test1', true, 'Passed'),
      new ValidationResult('Test2', false, 'Failed'),
      new ValidationResult('Test3', false, 'Failed')
    ];
    const report = new ValidationReport(results, 100);
    const failures = report.getFailures();
    
    assert.strictEqual(failures.length, 2);
    assert.strictEqual(failures[0].validator, 'Test2');
    assert.strictEqual(failures[1].validator, 'Test3');
  });

  it('should convert to JSON', () => {
    const results = [
      new ValidationResult('Test1', true, 'Passed')
    ];
    const report = new ValidationReport(results, 100);
    const json = report.toJSON();
    
    assert.ok(json.summary);
    assert.ok(json.results);
    assert.strictEqual(json.results.length, 1);
  });
});
