import React, { forwardRef, useImperativeHandle } from "react";

const ConsoleLine = ({ value }: any) => {
   return (
      <div>
         <code className="font-serif whitespace-pre">{value}</code>
      </div>
   );
};

const Console = forwardRef((props, ref) => {
   const consoleRef = React.useRef<HTMLDivElement>(null);
   const [lines, setLines] = React.useState<string[]>([]);
   
   useImperativeHandle(ref, () => ({
      emptyConsole() {
         setLines(() => []);
      },
      appendToConsole(line: string) {
         setLines((prevLines) => [...prevLines, line]);
         if (consoleRef.current) {
            consoleRef.current.scrollTop = consoleRef.current.scrollHeight; // Scroll automatique
         }
      },
   }));

   return (
      <div className="w-full h-full bg-gray-600 text-gray-100">
         <div className="font-semibold bg-gray-800 w-full px-3 py-2">Output</div>
         <div ref={consoleRef} className="w-full h-full p-4 overflow-x-auto overflow-y-scroll">
            {lines.map((line, index) => (line !== "" ? <ConsoleLine key={index} value={line} /> : null))}
         </div>
      </div>
   );
});

export default Console;
