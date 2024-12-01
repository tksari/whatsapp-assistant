import { TemplateService } from '../src/services/core/templateService.js';
import { jest, describe, expect, it, beforeEach } from '@jest/globals';
import yaml from 'js-yaml';
import path from 'path';

const mockAccess = jest.fn();
const mockReaddir = jest.fn();
const mockReadFile = jest.fn();

const mockFsPromises = {
  access: jest.fn(),
  readdir: jest.fn(),
  readFile: jest.fn(),
};

jest.mock('fs/promises', () => mockFsPromises);

jest.mock('path', () => ({
  join: (...args) => args.join('/'),
  basename: (path, ext) => path.replace(ext, ''),
}));

describe('TemplateService', () => {
  let templateService;
  let mockLogger;

  beforeEach(() => {
    jest.clearAllMocks();

    mockLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };

    templateService = new TemplateService({ logger: mockLogger });
    templateService.templateDir = path.join(process.cwd(), 'tests', 'templates');
  });

  it('should load and format template correctly', async () => {
    const templateYaml = yaml.dump({
      message: 'Hello {name}! Welcome to {city}!',
    });
    mockAccess.mockResolvedValue(undefined);
    mockReadFile.mockResolvedValue(templateYaml);

    await templateService.initialize();

    templateService.templates = {
      greetings: { message: 'Hello {name}! Welcome to {city}!' },
    };

    const result = templateService.formatTemplate('greetings', {
      name: 'Alien',
      city: 'Mars',
    });

    expect(result).toBe('Hello Alien! Welcome to Mars!');
  });

  it('should handle missing template file', async () => {
    mockAccess.mockRejectedValue(new Error('File not found'));

    const result = await templateService.loadTemplate('nonexistent');

    expect(result).toBe("Template 'nonexistent' not found");
    expect(mockLogger.warn).not.toHaveBeenCalled();
  });

  it('should handle empty template directory', async () => {
    mockAccess.mockImplementation(() => Promise.resolve());
    mockReaddir.mockImplementation(() => Promise.resolve([]));

    await templateService.initialize();

    expect(mockLogger.warn).toHaveBeenCalledWith('No template files found');
  });

  it('should get template message correctly', () => {
    templateService.templates = {
      test: { message: 'Hello {name}!' },
    };

    const result = templateService.getTemplate('test');
    expect(result).toBe('Hello {name}!');
  });
});
