// src/pages/Home.tsx
import { useNavigate } from "react-router-dom";

export default function Home() {
   const navigate = useNavigate();

   const gotoAuthPage = (path: string) => {
      navigate(path);
   };

   return (
      <div className="w-full h-full bg-gray-50">
         {/* Features Section */}
         <div className="max-w-6xl mx-auto py-12 px-6">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Features</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               <div className="bg-white shadow-md rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Problem Solving</h3>
                  <p className="text-gray-700">Solve challenging problems and improve your coding skills.</p>
               </div>
               <div className="bg-white shadow-md rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Code Editor</h3>
                  <p className="text-gray-700">Practice with our integrated code editor and terminal.</p>
               </div>
               <div className="bg-white shadow-md rounded-lg p-6 text-center">
                  <h3 className="text-xl font-semibold text-blue-600 mb-3">Leaderboard</h3>
                  <p className="text-gray-700">Compete with others and climb the ranks on the leaderboard.</p>
               </div>
            </div>
         </div>

         {/* Call to Action Section */}
         <div className="w-full bg-blue-500 text-white text-center py-12">
            <h2 className="text-3xl font-bold mb-4">Ready to start your coding journey?</h2>
            <p className="text-lg mb-6">Join thousands of developers improving their skills every day.</p>
            <div className="flex justify-center gap-6">
               <button
                  onClick={() => gotoAuthPage("/auth/signin")}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100"
               >
                  Sign In Now
               </button>
               <button
                  onClick={() => gotoAuthPage("/auth/signup")}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded hover:bg-gray-100"
               >
                  Sign Up Now
               </button>
            </div>
         </div>
      </div>
   );
}
