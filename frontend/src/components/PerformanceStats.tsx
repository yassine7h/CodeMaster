import React from "react";

interface PerformanceStatsProps {
   runtime: number; 
   memoryUsed: number; 
}

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ runtime, memoryUsed }) => {
   if (runtime === null || memoryUsed === null) {
      return null; 
   }

   return (
      <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
         <h3 className="text-lg font-semibold mb-2">Performance</h3>
         <div className="mb-2">
            <strong>Runtime:</strong> {runtime.toFixed(2)} ms
         </div>
         <div>
            <strong>Memory Used:</strong> {memoryUsed.toFixed(2)} MB
         </div>
      </div>
   );
};

export default PerformanceStats;
