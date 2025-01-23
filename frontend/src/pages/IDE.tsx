import React, { useState } from "react";
import CodeEditor from "../components/CodeEditor";

const IDE: React.FC = () => {
   const [code, setCode] = useState<string>("");
   const [output, setOutput] = useState<string>("");

   const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(event.target.value);
   };

   const runCode = () => {
      // Simulate running code and setting output
      setOutput(`Output:\n${code}`);
   };

   return (
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
         <div style={{ flex: 1 }}></div>
         <button onClick={runCode} style={{ padding: "10px", margin: "10px" }}>
            Run Code
         </button>
         <div style={{ flex: 1, backgroundColor: "#f5f5f5", padding: "10px", overflowY: "auto" }}>
            <pre>{output}</pre>
         </div>
      </div>
   );
};

export default IDE;
