import { createLowlight } from 'lowlight';
import bash from 'highlight.js/lib/languages/bash';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import yaml from 'highlight.js/lib/languages/yaml';
import { visit } from 'unist-util-visit';
import { toText } from 'hast-util-to-text';
import type { Root, Element, ElementContent } from 'hast';

const lowlight = createLowlight();
lowlight.register({ bash, typescript, javascript, python, yaml });

const PREFIX = 'hljs-';

/**
 * A trimmed-down stand-in for rehype-highlight that only registers the
 * handful of languages this blog actually uses. rehype-highlight's default
 * `languages` option statically imports all 37 "common" hljs languages,
 * which bloats the client bundle far more than a self-hosted phone server
 * should have to serve.
 */
export function rehypeHighlightMinimal() {
  return (tree: Root) => {
    visit(tree, 'element', (node: Element, _index, parent) => {
      if (node.tagName !== 'code' || !parent || (parent as Element).tagName !== 'pre') {
        return;
      }

      const classNames = (node.properties?.className as string[] | undefined) ?? [];
      const langClass = classNames.find((c) => c.startsWith('language-'));
      const lang = langClass?.replace('language-', '');
      if (!lang || !lowlight.registered(lang)) return;

      const text = toText(node, { whitespace: 'pre' });

      try {
        const result = lowlight.highlight(lang, text, { prefix: PREFIX });
        node.children = result.children as ElementContent[];
        node.properties = {
          ...node.properties,
          className: [...classNames, 'hljs'],
        };
      } catch {
        // If highlighting fails for any reason, leave the code block as
        // plain text rather than breaking the whole article render.
      }
    });
  };
}
