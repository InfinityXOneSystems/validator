/**
 * Example configuration file for the Validator system
 * Copy this file to validator.config.js and customize as needed
 */

export default {
  // General settings
  stage: 'production', // mvp, production, or enterprise
  parallel: false, // Run validators in parallel
  stopOnError: false, // Stop on first error

  // Code Quality settings
  codeQuality: {
    enabled: true,
    minCoverage: 80,
    maxComplexity: 10,
    severity: 'error'
  },

  // Security settings
  security: {
    enabled: true,
    requireHttps: true,
    checkDependencies: true,
    severity: 'error'
  },

  // Performance settings
  performance: {
    enabled: true,
    maxResponseTime: 1000, // ms
    maxMemoryUsage: 512, // MB
    severity: 'error'
  },

  // Documentation settings
  documentation: {
    enabled: true,
    requireReadme: true,
    requireApiDocs: true,
    minDocCoverage: 80,
    severity: 'error'
  },

  // Compliance settings
  compliance: {
    enabled: true,
    requireLicense: true,
    standards: ['ISO-27001', 'SOC-2', 'GDPR'],
    severity: 'error'
  },

  // Report settings
  report: {
    format: 'text', // text, json, markdown, html
    outputFile: null // null for stdout, or provide file path
  }
};
