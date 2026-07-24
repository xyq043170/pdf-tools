import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const sourceRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..'
);

describe('user-authored PDF inputs', () => {
  it.each(['index.html', 'simple-index.html'])(
    'prevents autofill in the %s tool search',
    (filename) => {
      const page = fs.readFileSync(
        path.join(sourceRoot, '..', filename),
        'utf8'
      );
      const searchInput = page.match(
        /<input[\s\S]*?id="search-bar"[\s\S]*?\/>/
      )?.[0];

      expect(searchInput).toBeDefined();
      expect(searchInput).toContain('type="search"');
      expect(searchInput).toContain('autocomplete="off"');
      expect(searchInput).not.toMatch(/value=/);
    }
  );

  it('does not prefill watermark or Bates text', () => {
    const watermarkPage = fs.readFileSync(
      path.join(sourceRoot, 'pages/add-watermark.html'),
      'utf8'
    );
    const batesPage = fs.readFileSync(
      path.join(sourceRoot, 'pages/bates-numbering.html'),
      'utf8'
    );

    expect(watermarkPage).not.toMatch(
      /id="watermark-overlay"[^>]*>\s*CONFIDENTIAL/
    );
    expect(batesPage).not.toMatch(
      /id="bates-template"[\s\S]*?value="\[BATES\]"/
    );
    expect(batesPage).toMatch(
      /id="bates-template"[\s\S]*?placeholder="\[BATES\]"/
    );
  });

  it('does not initialize newly created barcodes with sample content', () => {
    const formCreator = fs.readFileSync(
      path.join(sourceRoot, 'js/logic/form-creator.ts'),
      'utf8'
    );

    expect(formCreator).toContain(
      "barcodeValue: type === 'barcode' ? '' : undefined"
    );
    expect(formCreator).not.toContain(
      "barcodeValue: type === 'barcode' ? 'https://example.com' : undefined"
    );
  });
});
