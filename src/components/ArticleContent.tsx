import { Children, isValidElement, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import { rehypeHighlightMinimal } from '@/lib/highlight';
import { CodeBlock } from './CodeBlock';
import { Callout, type CalloutType } from './Callout';

interface ArticleContentProps {
  content: string;
}

function getPlainText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(getPlainText).join('');
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return getPlainText(props.children);
  }
  return '';
}

function Paragraph({ children }: { children?: ReactNode }) {
  const items = Children.toArray(children);
  const firstText = getPlainText(items[0]).trim();
  const match = firstText.match(/^(TIP|NOTE|WARNING|FUN FACT):$/i);
  const type = match ? (match[1].toLowerCase() as CalloutType) : null;

  if (type) {
    const rest = items.slice(1);
    return <Callout type={type}>{rest}</Callout>;
  }

  return <p>{children}</p>;
}

function Pre({ children }: { children?: ReactNode }) {
  const codeEl = Array.isArray(children) ? children[0] : children;
  if (!isValidElement(codeEl)) return <pre>{children}</pre>;

  const props = codeEl.props as { className?: string; children?: ReactNode };
  const raw = getPlainText(props.children);
  return (
    <CodeBlock className={props.className} rawText={raw}>
      {props.children}
    </CodeBlock>
  );
}

export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="prose-nexus">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug, rehypeHighlightMinimal]}
        components={{
          p: Paragraph,
          pre: Pre,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
