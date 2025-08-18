import { join } from 'path';

export const replaceTemplateString = <T extends Record<string, string>>(
  template: string,
  replace: T
): string => template.replace(/\$\{(\w+)}/g, (_, key) => replace[key] ?? '');

export const getPathTemplates = (fileName: string) => join(process.cwd(), 'templates', fileName);
