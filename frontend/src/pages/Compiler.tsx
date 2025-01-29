import React from 'react';
import Layout from '../layouts/Layout';
import { Editor } from '@monaco-editor/react';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';

type Language = 'python' | 'java';

const Compiler: React.FC = () => {
   const handleHttpError = useHttpErrorHandler();

   const [codeValue, setCodeValue] = React.useState<string>('# Write your code here');
   const [language, setLanguage] = React.useState<Language>('python');
   const [message, setMessage] = React.useState<String>('No output yet');
   const [stdout, setStdout] = React.useState<String>();
   const [stderr, setStdErr] = React.useState<String>();
   const [exitCode, setExitCode] = React.useState<String>();

   const onSelectLanguage = (event: React.ChangeEvent<HTMLSelectElement>) => {
      setLanguage(event.target.value as Language);
   };
   const run = async () => {
      setMessage('Running...');
      setStdout('');
      setStdErr('');
      setExitCode('');
      http
         .post('executor/' + language, {
            code: codeValue,
         })
         .then((response: any) => {
            setStdout(response.data.stdout);
            setStdErr(response.data.stderr);
            setExitCode(`Exit code ${response.data.status_code}`);
         })
         .catch(handleHttpError)
         .finally(() => {
            setMessage('');
         });
   };
   return (
      <Layout>
         <div className="w-full h-full flex">
            <div className="block w-1/2 h-full bg-gray-900">
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
                  theme="vs-dark"
                  onChange={(value: any) => {
                     setCodeValue(value);
                  }}
               />
            </div>
            <div className="flex flex-col w-1/2 h-full bg-gray-900">
               <div className="w-full flex justify-between py-4 px-6">
                  <div className="flex items-end gap-3">
                     <p className="text-white text-sm font-semibold">Compiler:</p>
                     <select className="bg-black text-white ring-1 ring-white rounded px-1" onChange={onSelectLanguage} value={language}>
                        <option value="java">Java 17</option>
                        <option value="python">Python 3.9</option>
                     </select>
                  </div>
                  <button onClick={run} className="bg-blue-500 text-white font-semibold rounded-md px-4 py-2 hover:bg-blue-600">
                     Run
                  </button>
               </div>
               <div className="px-6 pb-6 w-full h-full">
                  <div className="w-full h-full bg-black text-white p-2 text-sm overflow-auto">
                     <pre className="text-gray-400">{message}</pre>
                     <pre>{stdout}</pre>
                     <pre className="text-red-400">{stderr}</pre>
                     <pre className="text-gray-400">{exitCode}</pre>
                  </div>
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default Compiler;
