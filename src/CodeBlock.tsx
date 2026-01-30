import { Light as SyntaxHighlighter } from "react-syntax-highlighter"
import tsx from "react-syntax-highlighter/dist/esm/languages/hljs/typescript"
import { vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs"

SyntaxHighlighter.registerLanguage("tsx", tsx)

interface CodeBlockProps {
  code: string
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  return (
    <SyntaxHighlighter
      language="tsx"
      style={vs2015}
      customStyle={{
        whiteSpace: "pre-wrap",
        borderRadius: "10px",
        padding: "20px",
        fontSize: "16px",
      }}
    >
      {code}
    </SyntaxHighlighter>
  )
}
