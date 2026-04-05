import { describe, it, expect } from 'vitest';
import { FomaRender } from '../src/index';

describe('FomaRender Engine V1', () => {
  it('doit injecter le code de confirmation correctement', () => {
    const template = "<h1>Bienvenue !</h1><p>Votre code est {{code}}</p>";
    const data = { code: '8842' };
    
    const result = FomaRender.render(template, { data });
    
    expect(result).toContain('8842');
    expect(result).not.toContain('{{code}}');
  });
});