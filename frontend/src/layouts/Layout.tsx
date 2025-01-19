import { Link, useNavigate } from "react-router-dom";
import useLogout from "../hooks/logoutHandler";
import { useState, useEffect, useRef } from "react";
import { BsPersonCircle } from "react-icons/bs";
import { useGlobalContext } from "../contexts/GlobalContext";
import "../../public/styles/main.css";

export default function Layout({ children }: React.PropsWithChildren<{}>) {
   const { value } = useGlobalContext();
   const navigate = useNavigate();
   const logout = useLogout();
   const role = {
      isAdmin: value.user?.roles.includes("ADMIN"),
      isClient: value.user?.roles.includes("CLIENT"),
   };
   const [dropdownOpen, setDropdownOpen] = useState(false);
   const dropdownRef = useRef<HTMLDivElement>(null);

   const toggleDropdown = () => {
      setDropdownOpen((prev) => !prev);
   };

   const logoutHandler = () => {
      logout();
   };

   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setDropdownOpen(false);
         }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []);

   return (
      <div className="bg-gray-100 flex flex-col min-h-screen">
         <nav className="bg-black text-white py-4 px-6 flex justify-between items-center shadow-lg">
            <div className="flex items-center">
               <div className="text-xl font-bold">CodeMaster</div>
            </div>

            {/* Navigation Menu */}
            <div className="flex gap-6 items-center">
               {/* Navigation Links */}
               <div className="flex gap-4">
                  <Link to="/problems" className="hover:bg-blue-400 px-4 py-2 rounded-md font-semibold">
                     Problems
                  </Link>
                  <Link to="/contest" className="hover:bg-blue-400 px-4 py-2 rounded-md font-semibold">
                     Contest
                  </Link>
                  <Link to="/discuss" className="hover:bg-blue-400 px-4 py-2 rounded-md font-semibold">
                     Discuss
                  </Link>
                  <Link to="/interview" className="hover:bg-blue-400 px-4 py-2 rounded-md font-semibold">
                     Interview Prep
                  </Link>
               </div>

               {/* User Dropdown */}
               {value.user ? (
                  <div className="relative" ref={dropdownRef}>
                     <button
                        onClick={toggleDropdown}
                        className="flex items-center gap-2 hover:bg-blue-400 px-4 py-2 rounded-md font-semibold"
                     >
                        <BsPersonCircle size={20} />
                        {value.user.firstname}
                     </button>
                     {dropdownOpen && (
                        <div className="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-md py-2 z-50">
                           <Link
                              to="/myaccount"
                              className="block px-4 py-2 hover:bg-gray-100"
                           >
                              My Account
                           </Link>
                           <button
                              onClick={logoutHandler}
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                           >
                              Logout
                           </button>
                        </div>
                     )}
                  </div>
               ) : (
                  <div className="flex gap-2">
                     <button
                        onClick={() => navigate("/auth/signup")}
                        className="text-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-500 hover:text-white transition-colors"
                     >
                        Register
                     </button>
                     <span className="text-gray-500 py-2 font-semibold">/</span>
                     <button
                        onClick={() => navigate("/auth/signin")}
                        className=" text-blue-500 px-4 py-2 rounded-md font-semibold hover:bg-blue-500 hover:text-white transition-colors"
                     >
                        Sign in
                     </button>
                  </div>
               )}
            </div>
         </nav>

         {/* Main Content */}
         <main className="flex-grow">{children}</main>

         {/* Footer */}
         <footer className="bg-black text-white py-4 text-center">
            &copy; 2025 CodeMaster. All rights reserved.
         </footer>
      </div>
   );
}

