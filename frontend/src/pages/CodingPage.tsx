import CodeEditor from "../components/CodeEditor";
import TerminalController from "../components/TerminalController";
import Split from "react-split";

export default function CodingPage() {
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
                  <CodeEditor />
               </div>
               <div className="flex-grow flex">
                  <TerminalController />
               </div>
            </Split>
         </div>
         <div className="w-full h-full row-span-1 col-span-1">problem description, test cases</div>
      </div>
   );
}
