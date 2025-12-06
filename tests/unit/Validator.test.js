import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Validator, ValidationResult } from '../../src/core/Validator.js';

describe('Validator', () => {
  it('should create a validator with default options', () => {
    const validator = new Validator('TestValidator');
    assert.strictEqual(validator.name, 'TestValidator');
    assert.strictEqual(validator.severity, 'error');
    assert.strictEqual(validator.enabled, true);
  });

  it('should create a validator with custom options', () => {
    const validator = new Validator('TestValidator', {
      severity: 'warning',
      enabled: false,
      custom: 'value'
    });
    assert.strictEqual(validator.severity, 'warning');
    assert.strictEqual(validator.enabled, false);
    assert.strictEqual(validator.options.custom, 'value');
  });

  it('should return correct metadata', () => {
    const validator = new Validator('TestValidator', { severity: 'warning' });
    const metadata = validator.getMetadata();
    assert.strictEqual(metadata.name, 'TestValidator');
    assert.strictEqual(metadata.severity, 'warning');
    assert.strictEqual(metadata.enabled, true);
  });

  it('should check if validator should run', () => {
    const enabledValidator = new Validator('Test1', { enabled: true });
    const disabledValidator = new Validator('Test2', { enabled: false });
    
    assert.strictEqual(enabledValidator.shouldRun({}), true);
    assert.strictEqual(disabledValidator.shouldRun({}), false);
  });

  it('should throw error if validate is not implemented', async () => {
    const validator = new Validator('TestValidator');
    await assert.rejects(
      async () => await validator.validate({}),
      /validate\(\) method must be implemented/
    );
  });
});

describe('ValidationResult', () => {
  it('should create a validation result', () => {
    const result = new ValidationResult('TestValidator', true, 'All checks passed');
    assert.strictEqual(result.validator, 'TestValidator');
    assert.strictEqual(result.passed, true);
    assert.strictEqual(result.message, 'All checks passed');
    assert.ok(result.timestamp);
  });

  it('should include details in result', () => {
    const details = { issues: ['issue1', 'issue2'] };
    const result = new ValidationResult('TestValidator', false, 'Failed', details);
    assert.deepStrictEqual(result.details, details);
  });

  it('should convert to JSON', () => {
    const result = new ValidationResult('TestValidator', true, 'Passed', { key: 'value' });
    const json = result.toJSON();
    assert.strictEqual(json.validator, 'TestValidator');
    assert.strictEqual(json.passed, true);
    assert.strictEqual(json.message, 'Passed');
    assert.deepStrictEqual(json.details, { key: 'value' });
    assert.ok(json.timestamp);
  });
});
