import React, { forwardRef, useImperativeHandle } from "react";

const ConsoleLine = ({ value }: any) => {
   return (
      <div>
         <code className="font-serif whitespace-pre">
            {/* <span className="text-red-500">&#8658;</span> */}
            {value}
         </code>
      </div>
   );
};

const Console = forwardRef((props, ref) => {
   const consoleRef = React.useRef<HTMLDivElement>(null);
   const [lines, setLines] = React.useState<string[]>([]);
   useImperativeHandle(ref, () => ({
      emptyConsole() {
         setLines(() => []);
         console.log(lines);
      },
      appendToConsole(line: string) {
         setLines((lines) => [...lines, line]);
      },
   }));
   return (
      <div className="w-full h-full bg-gray-600 text-gray-100">
         <div className="font-semibold bg-gray-800 w-full px-3 py-2">Output</div>
         <div ref={consoleRef} className="w-full h-full p-4 overflow-x-scroll">
            {lines.map((line, index) => (line != "" ? <ConsoleLine key={index} value={line} /> : null))}
         </div>
      </div>
   );
});
export default Console;
