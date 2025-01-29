import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/logoutHandler';
import useImageStatus from '../hooks/imageStatus';
import { useState, useEffect, useRef } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { useGlobalContext } from '../contexts/GlobalContext';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';
import { API_BASE_URL } from '../utils/HttpClient';
import { ImStatsDots } from 'react-icons/im';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
   const { value } = useGlobalContext();
   const avatarLoadingStatus = useImageStatus(API_BASE_URL + value?.user?.avatar);
   const navigate = useNavigate();
   const logout = useLogout();
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const role = {
      isAdmin: value.user?.roles?.includes('ADMIN'),
      isLearner: value.user?.roles?.includes('LEARNER'),
      isCreator: value.user?.roles?.includes('CREATOR'),
   };

   const toggleDropdown = () => {
      setDropdownOpen((prev) => !prev);
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
         }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
         document.removeEventListener('mousedown', handleClickOutside);
      };
   }, []);

   return (
      <div className="bg-gray-100 flex flex-col overflow-hidden h-screen">
         <nav className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center justify-center">
               <div
                  onClick={() => {
                     navigate('/');
                  }}
                  className="text-xl font-bold cursor-pointer"
               >
                  CodeMaster
               </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex gap-4 items-center">
               {/* Navigation Links */}
               <div className="flex gap-2">
                  <Link to="/problems" className="hover:bg-blue-500 px-4 py-2 rounded-md font-semibold">
                     Problems Set
                  </Link>
                  <Link to="/compiler" className="hover:bg-blue-500 px-4 py-2 rounded-md font-semibold">
                     Compiler
                  </Link>
                  {value.user && (
                     <Link to="/global-stats" className="hover:bg-blue-500 px-4 py-2 rounded-md font-semibold">
                        Global Stats
                     </Link>
                  )}
                  {role.isCreator && (
                     <Link to="/creator/dashboard" className="hover:bg-blue-500 px-4 py-2 rounded-md font-semibold">
                        Creator Dashboard
                     </Link>
                  )}
                  {role.isAdmin && (
                     <Link to="/admin/dashboard" className="hover:bg-blue-500 px-4 py-2 rounded-md font-semibold">
                        Admin Dashboard
                     </Link>
                  )}
               </div>

               {/* User Dropdown */}
               {value.user ? (
                  <div ref={dropdownRef} className="relative">
                     <button onClick={toggleDropdown} className={(dropdownOpen ? 'ring-2 ' : '') + 'flex items-center justify-center hover:ring-2 ring-blue-500 rounded-full'}>
                        {avatarLoadingStatus === 'loaded' ? <img src={API_BASE_URL + value.user.avatar} className="w-8 aspect-square rounded-full bg-white" /> : <BsPersonCircle size={33} />}
                     </button>
                     {dropdownOpen && (
                        <div className="absolute min-w-[180px] right-0 mt-[19px] bg-gray-900 text-whit border-gray-600 border-2 rounded-md py-2 z-50">
                           <Link to="/myaccount" className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-800">
                              <MdOutlineManageAccounts size={20} />
                              <p>My Account</p>
                           </Link>
                           {role.isLearner && (
                              <Link to="/mystats" className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-800">
                                 <ImStatsDots size={18} />
                                 <p>My Stats</p>
                              </Link>
                           )}
                           <button type="button" onClick={logout} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-800">
                              <BiLogOut size={20} />
                              <p>Logout</p>
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="flex gap-2">
                     <button onClick={() => navigate('/auth/signup')} className="text-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-500 hover:text-white transition-colors">
                        Register
                     </button>
                     <span className="text-gray-500 py-2 font-semibold">/</span>
                     <button onClick={() => navigate('/auth/signin')} className=" text-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-500 hover:text-white transition-colors">
                        Sign in
                     </button>
                  </div>
               )}
            </div>
         </nav>

         <main className="flex-1 overflow-auto bg-gray-900">{children}</main>
      </div>
   );
}
