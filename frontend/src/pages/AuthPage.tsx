import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { http } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';
import { useGlobalContext, User } from '../contexts/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { Role } from '../ProtectedRoute';
import { AxiosResponse } from 'axios';
import Layout from '../layouts/Layout';
import { djangoAdminAuth } from '../utils/DjangoAdminAuth';

interface LoginFormInputs {
   email: string;
   password: string;
}

interface SignupFormInputs {
   email: string;
   password: string;
   username: string;
   roles: Role[];
}

type AuthFormInputs = LoginFormInputs & SignupFormInputs;

export default function AuthPage({ isLogin }: { isLogin: boolean }) {
   const handleHttpError = useHttpErrorHandler();
   const { setUser } = useGlobalContext();
   const navigate = useNavigate();

   const [showMessage, setShowMessage] = useState(true);
   const [message, setMessage] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const {
      register,
      handleSubmit,
      watch,
      formState: { errors },
   } = useForm<AuthFormInputs>();

   const onSubmit: SubmitHandler<AuthFormInputs> = (data: AuthFormInputs) => {
      if (isLogin) {
         const formdata: LoginFormInputs = { email: data.email, password: data.password };
         http.post('/accounts/signin', formdata).then(handleAuth).catch(handleHttpError);
      } else {
         const formdata: SignupFormInputs = { ...data, roles: [data.roles as any] as Role[] };
         http.post('/accounts/signup', formdata).then(handleAuth).catch(handleHttpError);
      }
   };
   const handleAuth = (response: AxiosResponse<unknown, any>) => {
      const data = response?.data as any;
      if (data?.message) {
         setMessage(data.message);
         setShowMessage(true);
         navigate('/auth/signin');
         return;
      }
      const user: User = data.user;
      const isAdmin = user.roles.includes('ADMIN');
      const isLearner = user.roles.includes('LEARNER');
      const isCreator = user.roles.includes('CREATOR');
      http.setToken(data.token);
      setUser(user);

      if (isAdmin) {
         setIsLoading(true);
         djangoAdminAuth
            .login(user.username, watch('password'))
            .then(() => {
               navigate('/admin/dashboard');
            })
            .finally(() => {
               setIsLoading(false);
            });
      } else if (isCreator) navigate('/creator/dashboard');
      else if (isLearner) navigate('/');
   };
   if (isLoading)
      return (
         <Layout>
            <div className="w-full h-full flex justify-center items-center text-xl text-white font-semibold">Loading...</div>
         </Layout>
      );
   return (
      <Layout>
         <div className="w-full h-full flex justify-center items-center bg-gray-900">
            <div className="p-8 bg-gray-800 rounded-md w-96">
               <h2 className="text-white text-2xl font-bold text-center mb-6">{isLogin ? 'Sign In' : 'Sign Up'}</h2>
               <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                     <label className="block text-sm font-medium text-gray-400">Email</label>
                     <input
                        type="email"
                        {...register('email', { required: 'Email is required' })}
                        className="w-full mt-1 px-3 py-2  bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                  </div>
                  {!isLogin && (
                     <div>
                        <label className="block text-sm font-medium text-gray-400">Username</label>
                        <input
                           type="text"
                           {...register('username', { required: 'Username is required' })}
                           className="w-full mt-1 px-3 py-2  bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors.username && <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>}
                     </div>
                  )}
                  <div>
                     <label className="block text-sm font-medium text-gray-400">Password</label>
                     <input
                        type="password"
                        {...register('password', {
                           required: isLogin ? 'Password is required' : undefined,
                        })}
                        className="w-full mt-1 px-3 py-2  bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                     />
                     {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
                  </div>
                  {!isLogin && (
                     <div className="w-full">
                        <label className="block text-sm font-medium text-gray-400">You are</label>
                        <div className="bg-gray-700 border border-gray-600 mt-1 flex rounded-md px-4 py-3 space-x-4 text-white text-sm w-full justify-around">
                           <label className="flex items-center">
                              <input type="radio" value="LEARNER" {...register('roles', { required: 'A role selection is required' })} className="mr-2 accent-blue-500" />
                              Learner
                           </label>
                           <label className="flex items-center">
                              <input type="radio" value="CREATOR" {...register('roles', { required: 'A role selection is required' })} className="mr-2 accent-blue-500" />
                              Creator
                           </label>
                        </div>
                        {errors.roles && <p className="text-red-400 text-sm mt-1">{errors.roles.message}</p>}
                     </div>
                  )}

                  <button type="submit" className="w-full bg-black text-blue-500 font-semibold py-2 rounded-md hover:bg-blue-500 hover:text-white transition">
                     {isLogin ? 'Sign In' : 'Sign Up'}
                  </button>
               </form>

               <p className="text-sm font-semibold text-gray-400 text-center mt-4">
                  {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                  <span
                     onClick={() => {
                        isLogin ? navigate('/auth/signup') : navigate('/auth/signin');
                     }}
                     className="text-blue-500 hover:underline cursor-pointer"
                  >
                     {isLogin ? 'Sign Up' : 'Sign In'}
                  </span>
               </p>
            </div>
            {showMessage && (
               <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                  <div className="bg-gray-800 p-6 rounded-md shadow-lg w-[500px]">
                     <h2 className="text-xl text-white font-bold mb-4">Message</h2>
                     <div className="text-white whitespace-pre-wrap">{message}</div>
                     <div className="mt-4 flex justify-end">
                        <button
                           onClick={() => {
                              setShowMessage(false);
                           }}
                           className="text-white font-semibold px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md"
                        >
                           Ok
                        </button>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </Layout>
   );
}
