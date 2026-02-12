import { type ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react';

function cx(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(' ');
}

export function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cx('mt-9', className)}>
      <div className='mb-2 flex items-center gap-3'>
        <h2 className='text-[0.8125rem] leading-none font-[560] tracking-[-0.005em] text-heading-secondary'>
          {title}
        </h2>
        <span className='h-px flex-1 bg-divider' />
      </div>
      {children}
    </section>
  );
}

type Token = { type: string; value: string };

const S: Record<string, string | undefined> = {
  keyword: 'var(--code-keyword)',
  string: 'var(--code-string)',
  tag: 'var(--code-tag)',
  htmlTag: 'var(--code-punctuation)',
  attrName: 'var(--code-attr-name)',
  htmlAttrName: 'var(--code-punctuation)',
  attrValue: 'var(--code-attr-value)',
  comment: 'var(--code-comment)',
  punctuation: 'var(--code-punctuation)',
  urlPath: 'var(--code-url-path)',
  urlParamKey: 'var(--code-url-param-key)',
  urlParamValue: 'var(--code-url-param-value)',
  urlHost: 'var(--code-keyword)',
};

function highlightURL(url: string): Token[] {
  const tokens: Token[] = [];

  // Split protocol + host from path + query
  const protoMatch = url.match(/^(https?:\/\/[^/?#]+)(.*)/);
  if (!protoMatch) return [{ type: 'plain', value: url }];

  const [, host, rest] = protoMatch;
  tokens.push({ type: 'urlHost', value: host });

  if (!rest) return tokens;

  const qIdx = rest.indexOf('?');
  const path = qIdx >= 0 ? rest.slice(0, qIdx) : rest;
  const query = qIdx >= 0 ? rest.slice(qIdx) : '';

  if (path) {
    tokens.push({ type: 'urlPath', value: path });
  }

  if (query) {
    tokens.push({ type: 'punctuation', value: '?' });
    const params = query.slice(1).split('&');
    params.forEach((param, i) => {
      if (i > 0) tokens.push({ type: 'punctuation', value: '&' });
      const eqIdx = param.indexOf('=');
      if (eqIdx >= 0) {
        tokens.push({ type: 'urlParamKey', value: param.slice(0, eqIdx) });
        tokens.push({ type: 'punctuation', value: '=' });
        tokens.push({ type: 'urlParamValue', value: param.slice(eqIdx + 1) });
      } else {
        tokens.push({ type: 'urlParamKey', value: param });
      }
    });
  }

  return tokens;
}

function tokenizeJSX(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Comments: // ... or {/* ... */}
    if (code.startsWith('//', i)) {
      const end = code.indexOf('\n', i);
      const commentEnd = end === -1 ? code.length : end;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // HTML comments: <!-- ... -->
    if (code.startsWith('<!--', i)) {
      const end = code.indexOf('-->', i);
      const commentEnd = end === -1 ? code.length : end + 3;
      tokens.push({ type: 'comment', value: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Keywords: import, from, const, export
    const kwMatch = code.slice(i).match(/^(import|from|const|export|function|return)\b/);
    if (kwMatch && (i === 0 || /[\s;{\n(]/.test(code[i - 1]!))) {
      tokens.push({ type: 'keyword', value: kwMatch[0] });
      i += kwMatch[0].length;
      continue;
    }

    // Strings (double or single quoted) — check for URLs inside
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i]!;
      let end = i + 1;
      while (end < code.length && code[end] !== quote) {
        if (code[end] === '\\') end++;
        end++;
      }
      end++; // include closing quote
      const full = code.slice(i, end);
      const inner = full.slice(1, -1);

      // Check if this string is an attribute value (preceded by =)
      const prevNonSpace = tokens.length > 0 ? tokens[tokens.length - 1] : null;
      const isAttrValue =
        prevNonSpace && prevNonSpace.type === 'punctuation' && prevNonSpace.value.endsWith('=');

      if (inner.match(/^https?:\/\//)) {
        // URL string — highlight internals
        tokens.push({ type: isAttrValue ? 'attrValue' : 'string', value: quote });
        tokens.push(...highlightURL(inner));
        tokens.push({ type: isAttrValue ? 'attrValue' : 'string', value: quote });
      } else if (isAttrValue) {
        tokens.push({ type: 'attrValue', value: full });
      } else {
        tokens.push({ type: 'string', value: full });
      }
      i = end;
      continue;
    }

    // JSX expression values: ={...}
    if (code[i] === '=' && code[i + 1] === '{') {
      tokens.push({ type: 'punctuation', value: '={' });
      let depth = 1;
      let j = i + 2;
      while (j < code.length && depth > 0) {
        if (code[j] === '{') depth++;
        if (code[j] === '}') depth--;
        j++;
      }
      const inner = code.slice(i + 2, j - 1);
      // Highlight arrays/values inside
      tokens.push({ type: 'attrValue', value: inner });
      tokens.push({ type: 'punctuation', value: '}' });
      i = j;
      continue;
    }

    // Tag open: < followed by tag name (including self-closing />)
    if (code[i] === '<') {
      const tagMatch = code.slice(i).match(/^(<\/?)([A-Za-z][A-Za-z0-9]*)/);
      if (tagMatch) {
        const tagName = tagMatch[2];
        const isHtml = tagName[0] === tagName[0].toLowerCase();
        tokens.push({ type: 'punctuation', value: tagMatch[1] });
        tokens.push({ type: isHtml ? 'htmlTag' : 'tag', value: tagName });
        i += tagMatch[0].length;

        // Parse attributes until > or />
        while (i < code.length) {
          // Whitespace
          const wsMatch = code.slice(i).match(/^\s+/);
          if (wsMatch) {
            tokens.push({ type: 'plain', value: wsMatch[0] });
            i += wsMatch[0].length;
            continue;
          }

          // End of tag
          if (code[i] === '>' || code.startsWith('/>', i)) {
            const closing = code[i] === '>' ? '>' : '/>';
            tokens.push({ type: 'punctuation', value: closing });
            i += closing.length;
            break;
          }

          // Attribute name
          const attrMatch = code.slice(i).match(/^[A-Za-z_][\w-]*/);
          if (attrMatch) {
            tokens.push({ type: isHtml ? 'htmlAttrName' : 'attrName', value: attrMatch[0] });
            i += attrMatch[0].length;

            if (code[i] === '=') {
              tokens.push({ type: 'punctuation', value: '=' });
              i++;

              // Quoted attribute value
              if (code[i] === '"' || code[i] === "'") {
                const quote = code[i]!;
                let qEnd = i + 1;
                while (qEnd < code.length && code[qEnd] !== quote) {
                  if (code[qEnd] === '\\') qEnd++;
                  qEnd++;
                }
                qEnd++;
                const inner = code.slice(i + 1, qEnd - 1);

                if (inner.match(/^https?:\/\//)) {
                  tokens.push({ type: 'string', value: quote });
                  tokens.push(...highlightURL(inner));
                  tokens.push({ type: 'string', value: quote });
                } else {
                  tokens.push({ type: 'attrValue', value: code.slice(i, qEnd) });
                }
                i = qEnd;
              }
              // Expression value ={...}
              else if (code[i] === '{') {
                tokens.push({ type: 'punctuation', value: '{' });
                let depth = 1;
                let j = i + 1;
                while (j < code.length && depth > 0) {
                  if (code[j] === '{') depth++;
                  if (code[j] === '}') depth--;
                  j++;
                }
                tokens.push({ type: 'attrValue', value: code.slice(i + 1, j - 1) });
                tokens.push({ type: 'punctuation', value: '}' });
                i = j;
              }
            }
            continue;
          }

          // Fallback — single char
          tokens.push({ type: 'plain', value: code[i]! });
          i++;
        }
        continue;
      }
    }

    // Punctuation
    if (/[{}();,=[\]<>/]/.test(code[i]!)) {
      tokens.push({ type: 'punctuation', value: code[i]! });
      i++;
      continue;
    }

    // Plain text (batch together)
    let end = i + 1;
    while (
      end < code.length &&
      !/[<"'{}();,=[\]/]/.test(code[end]!) &&
      !code.slice(end).match(/^(import|from|const|export|function|return)\b/)
    ) {
      end++;
    }
    tokens.push({ type: 'plain', value: code.slice(i, end) });
    i = end;
  }

  return tokens;
}

function renderTokens(tokens: Token[]): ReactNode[] {
  return tokens.map((tok, i) => {
    const color = S[tok.type];
    if (!color) return <span key={`${i}-${tok.value}`}>{tok.value}</span>;
    return (
      <span key={`${i}-${tok.value}`} style={{ color }}>
        {tok.value}
      </span>
    );
  });
}

export function CodeBlock({ children }: { children: string }) {
  const tokens = tokenizeJSX(children);
  const ref = useRef<HTMLPreElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (el.scrollWidth <= el.clientWidth) return;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) {
      el.style.paddingBottom = '6px';
    }
  }, [children]);

  return (
    <pre
      ref={ref}
      className='my-2 last:mb-0 overflow-x-auto rounded-lg border border-border bg-code-background px-4 py-3 font-mono text-xs leading-[1.6] text-code-block-foreground'
    >
      <code>{renderTokens(tokens)}</code>
    </pre>
  );
}

export function ScrollFade({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useLayoutEffect(() => {
    update();
  }, [update, children]);

  return (
    <div className={cx('relative', className)}>
      {canScrollLeft && (
        <div className='pointer-events-none absolute top-0 left-0 z-10 h-full w-6 bg-gradient-to-r from-background to-transparent' />
      )}
      <div ref={ref} className='overflow-x-auto' onScroll={update}>
        {children}
      </div>
      {canScrollRight && (
        <div className='pointer-events-none absolute top-0 right-0 z-10 h-full w-6 bg-gradient-to-l from-background to-transparent' />
      )}
    </div>
  );
}
