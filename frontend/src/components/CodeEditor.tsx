import Editor from "@monaco-editor/react";
import React from "react";
import axios from "axios";

type Language = "python" | "java";

const defaultValues = {
   python: `def solveMeFirst(a,b):
   return a + b

num1 = int(input())
num2 = int(input())
res = solveMeFirst(num1,num2)
print(res)
`,
   java: `public class Solution {
   int solveMeFirst(int a, int b) {
       return a + b;
   }
   public static void main(String[] args) {
       Scanner in = new Scanner(System.in);
       int a = in.nextInt();
       int b = in.nextInt();
       Solution sol = new Solution();
       int sum = sol.solveMeFirst(a, b);
       System.out.println(sum);
   }
}`,
};

export default function CodeEditor({ emptyConsole, appendToConsole, appendTestResults }: any) {
   const [codeValue, setCodeValue] = React.useState<string>(defaultValues.python);
   const [language, setLanguage] = React.useState<Language>("python");

   const onSelectLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedLanguage = event.target.value as Language;
      setLanguage(selectedLanguage);
      setCodeValue(defaultValues[selectedLanguage]);
   };

   const runCode = async () => {
      try {
         const response = await axios.post("http://localhost:8000/run_test_cases/" + language, {
            code: codeValue,
         });

         // Clear the console before displaying new output
         emptyConsole();

         // Debugging logs to verify the response structure
         console.log("Response from server:", response.data);

         // If stdout is returned, display it
         if (response.data.stdout) {
            appendToConsole(`Output: ${response.data.stdout}`);
         }

         // If stderr is returned (error), display it
         if (response.data.stderr) {
            appendToConsole(`Error: ${response.data.stderr}`);
         }

         // If test results are available, display them
         const testResults = response.data.tests || [];
         console.log("Test Results:", testResults); // Debugging the test results
         appendTestResults(testResults); // Pass the test results to the Console component
      } catch (error) {
         emptyConsole();
         appendToConsole("Network Connection Error");
         console.error("Error:", error);
      }
   };

   return (
      <div className="h-full w-full border-2 relative">
         <div className="z-50 absolute top-0 right-0 m-3 border-2 rounded-md border-gray-300">
            <div className="flex w-full justify-end p-1 bg-gray-400">
               <select className="bg-gray-400" onChange={onSelectLanguage} value={language}>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
               </select>
            </div>
         </div>
         <div className="h-full w-full">
            <Editor
               className="rounded-md"
               options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
               }}
               height="100%"
               width="100%"
               language={language}
               value={codeValue}
               onChange={(value: any) => {
                  setCodeValue(value);
               }}
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
