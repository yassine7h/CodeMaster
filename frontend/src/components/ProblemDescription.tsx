import React from "react";

interface ProblemDescriptionProps {
   title: string;
   description: string;
   examples: { input: string; output: string; explanation?: string }[];
}

const ProblemDescription: React.FC<ProblemDescriptionProps> = ({ title, description, examples }) => {
   return (
      <div className="bg-[#262626] text-white p-6 rounded-lg shadow-md w-full">
         <h2 className="text-2xl font-bold mb-4">{title}</h2>
         <p className="mb-6">{description}</p>

         <h3 className="text-xl font-semibold mb-4">Examples</h3>
         <div className="space-y-4">
            {examples.map((example, index) => (
               <div key={index} className="border-t border-gray-600 pt-4">
                  <div className="mb-2">
                     <strong>Input:</strong> {example.input}
                  </div>
                  <div className="mb-2">
                     <strong>Output:</strong> {example.output}
                  </div>
                  {example.explanation && (
                     <div className="mt-2">
                        <strong>Explanation:</strong> {example.explanation}
                     </div>
                  )}
               </div>
            ))}
         </div>
      </div>
   );
};

export default ProblemDescription;
