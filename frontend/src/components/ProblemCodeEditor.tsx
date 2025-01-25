import Editor from '@monaco-editor/react';
import React from 'react';
import { http } from '../utils/HttpClient';
import TestsResults from './TestsResults';
import SplitPanel from './SplitPanel';

type Language = 'python' | 'java';

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

export default function ProblemCodeEditor() {
   const [codeValue, setCodeValue] = React.useState<string>(defaultValues.python);
   const [language, setLanguage] = React.useState<Language>('python');
   const [testsResults, setTestsResults] = React.useState<any[]>([]);
   const [message, setMessage] = React.useState<string | undefined>();

   const onSelectLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedLanguage = event.target.value as Language;
      setLanguage(selectedLanguage);
      setCodeValue(defaultValues[selectedLanguage]);
   };

   const runCode = () => {
      setTestsResults([]);
      setMessage('Running test cases...');
      http
         .post('run_test_cases/' + language, { code: codeValue })
         .then((response: any) => {
            const testResults = response.data || [];
            console.log('Test Results:', testResults);
            setMessage(undefined);
            setTestsResults(testResults);
         })
         .catch((error) => {
            setTestsResults([]);
            setMessage('Error running test cases');
            console.error('Error:', error);
         });
   };

   return (
      <div className="w-full h-full border-r-2 border-black">
         <SplitPanel>
            <div className="w-full h-full grid grid-rows-[auto_1fr]">
               <div className="row-span-1 w-full flex justify-between items-center p-3 border-b-2 border-black">
                  <select className="bg-black text-white ring-1 ring-white rounded px-1" onChange={onSelectLanguage} value={language}>
                     <option value="java">Java 17</option>
                     <option value="python">Python 3.9</option>
                  </select>
                  <button onClick={runCode} className="bg-black hover:bg-blue-500 px-3 py-1 rounded-lg text-white font-semibold flex items-center justify-center">
                     Run
                  </button>
               </div>
               <div className="row-span-2 w-full h-full overflow-hidden">
                  <Editor
                     options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                     }}
                     height="100%"
                     width="100%"
                     language={language}
                     value={codeValue}
                     theme="vs-dark"
                     onChange={(value: any) => {
                        setCodeValue(value);
                     }}
                  />
               </div>
            </div>
            <div className="w-full h-full">
               <TestsResults testResults={testsResults} message={message} />
            </div>
         </SplitPanel>
      </div>
   );
}
