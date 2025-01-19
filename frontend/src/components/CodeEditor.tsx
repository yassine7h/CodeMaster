import Editor from "@monaco-editor/react";
import React from "react";
import axios from "axios";

const defaultValue = `def solutionFunction():
   print("Hello World!")
solutionFunction()
`;

const options = {
   minimap: { enabled: false },
   scrollBeyondLastLine: false,
   theme: "vs-dark",
   wordWrap: "on",
};

interface CodeEditorProps {
   emptyConsole: () => void;
   appendToConsole: (line: string) => void;
   setPerformance: (performance: { runtime: number; memoryUsed: number } | null) => void;
}

export default function CodeEditor({ emptyConsole, appendToConsole, setPerformance }: CodeEditorProps) {
   const [codeValue, setCodeValue] = React.useState<string>(defaultValue);

   const handleEditorChange = (value: any) => {
      setCodeValue(value);
   };

   const runCode = async () => {
      try {
         emptyConsole();
         appendToConsole("Executing code...");
         setPerformance(null);

         const response = await axios.post("http://localhost:8000/executer/python/", {
            code: codeValue,
         });

         const { stdout, stderr, exit_code } = response.data;
         appendToConsole(stdout || "No output.");
         appendToConsole(stderr || "");
         appendToConsole(`Program exited with code ${exit_code}.`);

         if (response.data.performance) {
            setPerformance({
               runtime: response.data.performance.execution_time,
               memoryUsed: response.data.performance.memory_used,
            });
         }
      } catch (error) {
         emptyConsole();
         appendToConsole("Error: Unable to connect to the server.");
         console.error("Error:", error);
      }
   };

   const resetEditor = () => {
      setCodeValue(defaultValue);
   };

   return (
      <div className="h-full w-full relative bg-[#262626] border-2 rounded-lg overflow-hidden">
         <div className="h-full w-full">
            <Editor
               className="rounded-md"
               options={options}
               height="100%"
               width="100%"
               defaultLanguage="python"
               value={codeValue}
               onChange={handleEditorChange}
            />
         </div>
         <div className="z-50 absolute bottom-0 right-0 p-3 space-x-2 bg-gray-800 w-full flex justify-end">
            <button
               onClick={runCode}
               className="bg-green-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-green-700"
            >
               Run
            </button>
            <button
               onClick={resetEditor}
               className="bg-gray-600 px-4 py-2 rounded-lg text-white font-semibold hover:bg-gray-700"
            >
               Reset
            </button>
         </div>
      </div>
   );
}

