import Editor from "@monaco-editor/react";
import React from "react";
import axios from "axios";

// const defaultValue = `class Solution{
//     private String field;
//     public void solutionFunction(int n){
//         System.out.println("N value=", n);
//     }
// }`;

const defaultValue = `def solutionFunction():
   print("hello world!");
solutionFunction();
`;
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
export default function CodeEditor({ emptyConsole, appendToConsole }: any) {
   const [codeValue, setCodeValue] = React.useState<string>(defaultValue);
   const handleEditorChange = (value: any) => {
      setCodeValue(value);
   };
   const runCode = async () => {
      try {
         const response = await axios.post("http://localhost:8000/submit", {
            code: codeValue,
         });
         console.log(response.data);
         emptyConsole();
         appendToConsole(response.data.stdout);
         appendToConsole(response.data.sterr);
         appendToConsole(`Program exited with code ${response.data.exit_code}.`);
      } catch (error) {
         emptyConsole();
         appendToConsole("Network Connection");
         console.error("Error:", error);
      }
   };
   return (
      <div className="h-full w-full border-2 relative">
         <div className="h-full w-full">
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
         <div className="z-50 absolute bottom-0 right-0 p-3">
            <button onClick={runCode} className="bg-green-600 px-3 py-2 rounded-lg text-white font-semibold flex items-center justify-center">
               Run
            </button>
         </div>
      </div>
   );
}
