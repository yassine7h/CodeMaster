import { Link, useNavigate } from 'react-router-dom';
import useLogout from '../hooks/logoutHandler';
import { useState, useEffect, useRef } from 'react';
import { BsPersonCircle } from 'react-icons/bs';
import { useGlobalContext } from '../contexts/GlobalContext';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { BiLogOut } from 'react-icons/bi';

export default function Layout({ children }: React.PropsWithChildren<{}>) {
   const { value } = useGlobalContext();
   const navigate = useNavigate();
   const logout = useLogout();
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const roles = {
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
            <div className="flex gap-6 items-center">
               {/* Navigation Links */}
               <div className="flex gap-2">
                  <Link to="/problems" className="hover:bg-blue-500 px-4 py-2 rounded-md font-semibold">
                     Problems Set
                  </Link>
                  <Link to="/compiler" className="hover:bg-blue-500 px-4 py-2 rounded-md font-semibold">
                     Compiler
                  </Link>
               </div>

               {/* User Dropdown */}
               {value.user ? (
                  <div className="relative" ref={dropdownRef}>
                     <button onClick={toggleDropdown} className={(dropdownOpen ? 'bg-blue-500 ' : '') + 'flex items-center justify-center gap-2 hover:bg-blue-500 p-2 rounded-md font-semibold'}>
                        <BsPersonCircle size={30} />
                     </button>
                     {dropdownOpen && (
                        <div className="absolute min-w-[180px] right-0 mt-2 bg-white text-black shadow-lg rounded-md py-2 z-50">
                           <Link to="/myaccount" className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100">
                              <MdOutlineManageAccounts size={20} />
                              <p>My Account</p>
                           </Link>
                           <button type="button" onClick={logout} className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100">
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

         <main className="flex-1 overflow-auto">{children}</main>
      </div>
   );
}
