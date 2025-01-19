import React from "react";
import CodeEditor from "../components/CodeEditor"; 
import Console from "../components/Console"; 
import PerformanceStats from "../components/PerformanceStats"; 
import ProblemDescription from "../components/ProblemDescription"; 
import Split from "react-split"; 

interface ConsoleMethods {
   emptyConsole: () => void;
   appendToConsole: (line: string) => void;
}

export default function CodingPage() {
   const consoleRef = React.useRef<ConsoleMethods>();
   const [performance, setPerformance] = React.useState<{ runtime: number; memoryUsed: number } | null>(null);

   const problemData = {
      title: "2425. Bitwise XOR of All Pairings",
      description:
         "You are given two 0-indexed arrays, nums1 and nums2, consisting of non-negative integers. There exists another array, nums3, which contains the bitwise XOR of all pairings of integers between nums1 and nums2 (every integer in nums1 is paired with every integer in nums2 exactly once). Return the bitwise XOR of all integers in nums3.",
      examples: [
         {
            input: "nums1 = [2,1,3], nums2 = [10,2,5,0]",
            output: "13",
            explanation:
               "A possible nums3 array is [8,0,7,2,11,3,4,1,9,1,6,3]. The bitwise XOR of all these numbers is 13, so we return 13.",
         },
         {
            input: "nums1 = [1,2], nums2 = [3,4]",
            output: "0",
            explanation:
               "All possible pairs of bitwise XORs are nums1[0] ^ nums2[0], nums1[0] ^ nums2[1], and nums1[1] ^ nums2[0]. Thus, one possible nums3 array is [2,5,1,6]. 2 ^ 5 ^ 1 ^ 6 = 0, so we return 0.",
         },

      ],
   };

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

   const handleRunCode = () => {
      appendToConsole("Running code...");
      appendToConsole("Test case 1: nums1 = [2,1,3], nums2 = [10,2,5,0], Output = 13");
      appendToConsole("Test case 2: nums1 = [1,2], nums2 = [3,4], Output = 0");
      setPerformance({ runtime: 200, memoryUsed: 50 });
   };

   return (
      <div className=" bg-black text-800 text-white w-full h-full grid grid-cols-2 grid-rows-1 gap-4 p-6">
            <ProblemDescription
               title={problemData.title}
               description={problemData.description}
               examples={problemData.examples}
            />
            {performance && (
               <PerformanceStats runtime={performance.runtime} memoryUsed={performance.memoryUsed} />
            )}
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
      </div>
   );
}

