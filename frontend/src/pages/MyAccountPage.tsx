import React from 'react';
import { FaCamera } from 'react-icons/fa';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useGlobalContext } from '../contexts/GlobalContext';
import Layout from '../layouts/Layout';
import { http, API_BASE_URL } from '../utils/HttpClient';
import { useHttpErrorHandler } from '../hooks/httpErrorHandler';
import { makeImageSquare } from '../utils/image-tools';

type UpdatePassword = {
   current: string;
   new: string;
   confirm: string;
};

const defaultValues: UpdatePassword = {
   current: '',
   new: '',
   confirm: '',
};

const AccountPage = () => {
   const { enqueueSnackbar } = useSnackbar();
   const handleHttpError = useHttpErrorHandler();
   const { value, setUser } = useGlobalContext();
   const userData = value.user;
   if (!userData) return null;
   const {
      register,
      handleSubmit,
      reset,
      watch,
      formState: { errors },
   } = useForm<UpdatePassword>({
      defaultValues: defaultValues,
   });
   const [avatarUrl, setAvatarUrl] = React.useState<string>(API_BASE_URL + userData.avatar);

   const onSubmit = (data: UpdatePassword) => {
      http
         .post('/accounts/update-password', { currentPassword: data.current, newPassword: data.new })
         .then(() => {
            enqueueSnackbar('Password updated successfully', { variant: 'success' });
            reset();
         })
         .catch(handleHttpError);
   };
   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = await makeImageSquare(e.target.files?.[0] as File, 300);
      const formData = new FormData();
      formData.append('avatar', file);
      console.log('FormData content:', ...formData.entries());
      http
         .post('/accounts/update-avatar', formData, {
            headers: {
               'Content-Type': 'multipart/form-data',
            },
         })
         .then((response) => {
            setUser({ ...userData, avatar: response.data as string });
            setAvatarUrl(API_BASE_URL + response.data);
            enqueueSnackbar('Profile avatar updated', { variant: 'success' });
         })
         .catch(handleHttpError);
   };

   return (
      <Layout>
         <div className="container mx-auto p-6 max-w-2xl my-6">
            <div className="flex justify-between items-center mb-6">
               <h1 className="text-xl text-white font-bold">Account Settings</h1>
               <div className="flex space-x-2">
                  {userData.roles.map((role) => (
                     <span key={role} className="px-2 py-1 bg-blue-500 text-white rounded-md text-xs font-semibold">
                        {role}
                     </span>
                  ))}
               </div>
            </div>
            <div className="space-y-6">
               {/* Profile Section */}
               <div className="bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-white font-semibold mb-4">Profile Information</h2>
                  <div className="flex items-center space-x-6">
                     <div className="relative">
                        <img src={avatarUrl} className="w-28 h-28 rounded-full ring-2 bg-white" />
                        <label className="absolute bottom-0 right-0 p-1 bg-black rounded-full shadow-lg cursor-pointer hover:bg-blue-500">
                           <FaCamera className="w-6 h-6 p-1 text-white" />
                           <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                        </label>
                     </div>
                     <div className="space-y-4 flex-1">
                        <div>
                           <label className="block text-sm font-medium text-gray-400 mb-1">Username</label>
                           <input type="text" value={userData.username} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
                        </div>
                        <div>
                           <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                           <input type="email" value={userData.email} disabled className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50" />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Password Change Section */}
               <div className="bg-gray-800 rounded-lg shadow p-6">
                  <h2 className="text-white font-semibold mb-4">Change Password</h2>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                        <input
                           type="password"
                           {...register('current', { required: 'Current password is required' })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.current && <p className="mt-1 text-sm text-red-400">{errors.current.message}</p>}
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input
                           type="password"
                           {...register('new', { required: 'New password is required' })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.new && <p className="mt-1 text-sm text-red-400">{errors.new.message}</p>}
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm New Password</label>
                        <input
                           type="password"
                           {...register('confirm', { required: 'Please confirm your password', validate: (value) => value === watch('new') || 'Passwords do not match' })}
                           className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.confirm && <p className="mt-1 text-sm text-red-400">{errors.confirm.message}</p>}
                     </div>
                     <button type="submit" className="w-full bg-black text-white font-semibold text-sm py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2">
                        Update Password
                     </button>
                  </form>
               </div>
            </div>
         </div>
      </Layout>
   );
};

export default AccountPage;
