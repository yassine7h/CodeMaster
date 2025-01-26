import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../contexts/GlobalContext';
import { http } from '../utils/HttpClient';
import Layout from '../layouts/Layout';

export default function Home() {
   const navigate = useNavigate();
   const { value } = useGlobalContext();

   const gotoAuthPage = (path: string) => {
      navigate(path);
   };

   return (
      <Layout>
         <div className="w-full h-full">
            {/* Call to Action Section */}
            {value.user ? (
               <div className="w-full bg-blue-500 text-white text-center py-12">
                  <h2 className="text-3xl font-bold mb-4">Welcome back, {value.user.username}!</h2>
                  <p className="text-lg mb-6">Continue your coding journey by exploring new challenges.</p>
               </div>
            ) : (
               <div className="w-full bg-blue-500 text-white text-center py-12">
                  <h2 className="text-3xl font-bold mb-4">Ready to start your coding journey?</h2>
                  <p className="text-lg mb-6">Join thousands of developers improving their skills every day.</p>
                  <div className="flex justify-center gap-6">
                     <button onClick={() => gotoAuthPage('/auth/signin')} className="px-8 py-3 bg-black text-white font-semibold rounded hover:bg-gray-200 hover:text-blue-500">
                        Sign In Now
                     </button>
                     <button onClick={() => gotoAuthPage('/auth/signup')} className="px-8 py-3 bg-black text-white font-semibold rounded hover:bg-gray-200 hover:text-blue-500">
                        Sign Up Now
                     </button>
                  </div>
               </div>
            )}

            {/* Features Section */}
            <div className="max-w-6xl mx-auto py-12 px-6">
               <h2 className="text-2xl font-bold text-white text-center mb-8">Features</h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div
                     onClick={() => {
                        if (!value.user) navigate('/auth/signin');
                        else navigate('/problems');
                     }}
                     className="bg-blue-500 rounded-lg p-6 text-center cursor-pointer hover:ring-2 hover:scale-105 transform transition"
                  >
                     <h3 className="text-xl font-semibold text-white mb-3">Problem Solving</h3>
                     <p className="text-gray-100">Solve challenging problems and improve your coding skills.</p>
                  </div>
                  <div
                     onClick={() => {
                        navigate('/compiler');
                     }}
                     className="bg-blue-500 rounded-lg p-6 text-center cursor-pointer hover:ring-2 hover:scale-105 transform transition"
                  >
                     <h3 className="text-xl font-semibold text-white mb-3">Online Compiler</h3>
                     <p className="text-gray-100">Practice with our integrated online compiler.</p>
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-4 mx-10 py-10 bg-white justify-center items-center">
               <pre>{'USER=' + JSON.stringify(value.user, null, 2)}</pre>
               <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                     http
                        .get('/test_token')
                        .then((response: any) => {
                           console.log('test_token:', response.data);
                        })
                        .catch((error) => {
                           console.error('Error:', error);
                        });
                  }}
               >
                  Test Api Call
               </button>
            </div>
         </div>
      </Layout>
   );
}
