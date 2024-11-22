import Editor from "@monaco-editor/react";

const defaultValue = `class Solution{
    private String field;
    public void solutionFunction(int n){
        System.out.println("N value=", n);
    }
}`;
const options = {
   // selectOnLineNumbers: true,      // Makes line numbers selectable
   minimap: { enabled: false }, // Disables the minimap
   // wordBasedSuggestions: false,    // Disables word-based suggestions
   // quickSuggestions: false,        // Disables quick suggestions (auto-completion)
   // parameterHints: false,          // Disables parameter hints
   // autoClosingBrackets: false,     // Disables auto-closing brackets
   // autoClosingQuotes: false,       // Disables auto-closing quotes
   // autoIndent: false,              // Disables auto indentation
   // autoIndentation: 'none',        // Prevents automatic indentation
   // readOnly: false,                // Can make the editor read-only if needed
   scrollBeyondLastLine: false, // Disable scrolling beyond the last line
};
export default function CodeEditor() {
   function handleEditorChange(value: any) {
      console.log("here is the current model value:", value);
   }
   return (
      <div className="h-full w-full border-2">
         <Editor
            className="rounded-md"
            options={options}
            height="100%"
            width="100%"
            defaultLanguage="java"
            //theme="vs-dark"
            defaultValue={defaultValue}
            onChange={handleEditorChange}
         />
      </div>
   );
}
