import fs from 'fs/promises';
import path from 'path';
import yaml from 'js-yaml';

export class TemplateService {
  constructor({ logger }) {
    this.templates = {};
    this.logger = logger;
    this.templateDir = path.join(process.cwd(), 'src', 'templates');
  }

  async loadTemplate(templateName) {
    try {
      const templatePath = path.join(this.templateDir, `${templateName}.yml`);

      try {
        await fs.access(templatePath);
      } catch {
        return `Template '${templateName}' not found`;
      }

      const templateContent = await fs.readFile(templatePath, 'utf-8');
      return yaml.load(templateContent);
    } catch {
      return `Error loading template '${templateName}'`;
    }
  }

  async initialize() {
    try {
      try {
        await fs.access(this.templateDir);
      } catch {
        this.logger.warn('Templates directory not found');
        return;
      }

      const files = await fs.readdir(this.templateDir);
      const ymlFiles = files.filter((file) => file.endsWith('.yml'));

      if (ymlFiles.length === 0) {
        this.logger.warn('No template files found');
        return;
      }

      const templateLoads = ymlFiles.map(async (file) => {
        const templateName = path.basename(file, '.yml');
        const content = await this.loadTemplate(templateName);
        return [templateName, content];
      });

      const loadedTemplates = await Promise.all(templateLoads);
      this.templates = Object.fromEntries(loadedTemplates);

      this.logger.info(`Loaded ${Object.keys(this.templates).length} templates`);
    } catch (error) {
      this.logger.error('Template initialization failed:', error);
    }
  }

  getTemplate(name) {
    return this.templates[name]?.message || `Template '${name}' not found`;
  }

  formatTemplate(name, variables = {}) {
    let template = this.getTemplate(name);
    return Object.entries(variables).reduce((text, [key, value]) => {
      return text.replace(new RegExp(`{${key}}`, 'g'), value);
    }, template);
  }
}
