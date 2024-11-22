const TerminalLine = () => {
   return (
      <div>
         <span className="text-red-500">&#8658;</span> ls -al
      </div>
   );
};

const Terminal = () => {
   return (
      <div className="w-full h-full bg-gray-600 text-gray-100 font-serif p-4">
         <TerminalLine />
      </div>
   );
};
export default Terminal;
