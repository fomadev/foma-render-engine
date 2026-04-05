export class FomaParser {
  // Le mot-clé STATIC est obligatoire ici
  static parse(template: string, data: Record<string, any>): string {
    let result = template;
    
    for (const [key, value] of Object.entries(data)) {
      // Regex pour capturer {{ key }} ou {{key}}
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      result = result.replace(regex, String(value));
    }
    
    return result;
  }
}