import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function MarkdownMessage({ content }) {
  const { theme } = useTheme();
  const [copiedCode, setCopiedCode] = React.useState(null);

  const copyCode = async (code) => {
    await navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="prose prose-sm max-w-none dark:prose-invert">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            const code = String(children).replace(/\n$/, '');

            if (!inline && (match || code.includes('\n'))) {
              return (
                <div className="relative group my-4">
                  <div className="flex items-center justify-between bg-gray-800 dark:bg-gray-900 text-gray-200 px-4 py-2 text-sm rounded-t-lg">
                    <span className="font-medium">{language || 'code'}</span>
                    <button
                      onClick={() => copyCode(code)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-600 hover:bg-orange-700 rounded transition-colors"
                    >
                      {copiedCode === code ? (
                        <>
                          <Check size={12} />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={theme === 'dark' ? oneDark : oneLight}
                    language={language || 'text'}
                    PreTag="div"
                    className="!mt-0 !rounded-t-none !bg-gray-50 dark:!bg-gray-900"
                    customStyle={{
                      margin: 0,
                      borderTopLeftRadius: 0,
                      borderTopRightRadius: 0,
                      fontSize: '14px',
                      lineHeight: '1.5'
                    }}
                    {...props}
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
              <code
                className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-1.5 py-0.5 rounded text-sm font-mono border border-orange-200 dark:border-orange-800"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre({ children }) {
            return <div className="overflow-x-auto">{children}</div>;
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300 rounded-r">
                {children}
              </blockquote>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="min-w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                  {children}
                </table>
              </div>
            );
          },
          th({ children }) {
            return (
              <th className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300">
                {children}
              </td>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4 mt-6 border-b border-gray-200 dark:border-gray-700 pb-2">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3 mt-5">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2 mt-4">
                {children}
              </h3>
            );
          },
          p({ children }) {
            return (
              <p className="text-gray-700 dark:text-gray-300 mb-3 leading-relaxed">
                {children}
              </p>
            );
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside mb-3 text-gray-700 dark:text-gray-300 space-y-1">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside mb-3 text-gray-700 dark:text-gray-300 space-y-1">
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className="text-gray-700 dark:text-gray-300">
                {children}
              </li>
            );
          },
          a({ children, href }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 underline font-medium"
              >
                {children}
              </a>
            );
          },
          strong({ children }) {
            return (
              <strong className="font-semibold text-gray-900 dark:text-gray-100">
                {children}
              </strong>
            );
          },
          em({ children }) {
            return (
              <em className="italic text-gray-700 dark:text-gray-300">
                {children}
              </em>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}