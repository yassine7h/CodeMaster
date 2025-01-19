import React from "react";
import CodeEditor from "../components/CodeEditor";
import Console from "../components/Console";
import PerformanceStats from "../components/PerformanceStats";
import Split from "react-split";

interface ConsoleMethods {
   emptyConsole: () => void;
   appendToConsole: (line: string) => void;
}

export default function SolutionPage() {
   const consoleRef = React.useRef<ConsoleMethods>();
   const [performance, setPerformance] = React.useState<{ runtime: number; memoryUsed: number } | null>(null);

   const emptyConsole = () => {
      if (consoleRef.current) {
         consoleRef.current.emptyConsole();
      }
   };
   const appendToConsole = (line: string) => {
      if (consoleRef.current) {
         consoleRef.current.appendToConsole(line);
      }
   };

   return (
      <div className="w-full h-full grid grid-cols-2 grid-rows-1">
         <div className="row-span-1 col-span-1">
            <Split
               className="flex flex-col w-full h-full"
               direction="vertical"
               sizes={[65, 35]}
               minSize={100}
               gutter={() => {
                  const gutterElement = document.createElement("div");
                  gutterElement.className = "custom-gutter";
                  gutterElement.innerHTML = `<div class="gutter-handle"></div>`;
                  return gutterElement as HTMLElement;
               }}
            >
               <div className="flex-grow flex">
                  <CodeEditor
                     emptyConsole={emptyConsole}
                     appendToConsole={appendToConsole}
                     setPerformance={setPerformance}
                  />
               </div>
               <div className="flex-grow flex">
                  <Console ref={consoleRef} />
               </div>
            </Split>
         </div>
         <div className="w-full h-full row-span-1 col-span-1 flex flex-col items-center justify-start p-4">
            <div className="mb-4">problem description, test cases</div>
            {performance && (
               <PerformanceStats runtime={performance.runtime} memoryUsed={performance.memoryUsed} />
            )}
         </div>
      </div>
   );
}

