import React, { useState, useRef, useEffect } from 'react';

const SplitPane = ({ children = [<div>Left Pane</div>, <div>Right Pane</div>], initialSplit = 50, minSize = 20, direction = 'vertical' }) => {
   const [splitPosition, setSplitPosition] = useState(initialSplit);
   const containerRef = useRef<HTMLDivElement>(null);
   const isDragging = useRef(false);
   const startPos = useRef(0);
   const startSplit = useRef(0);

   const childrenArray = React.Children.toArray(children);
   const firstChild = childrenArray[0] || <div>Left Pane</div>;
   const secondChild = childrenArray[1] || <div>Right Pane</div>;

   const handleMouseDown = (e: any) => {
      e.preventDefault();
      isDragging.current = true;
      startPos.current = direction === 'horizontal' ? e.clientX : e.clientY;
      startSplit.current = splitPosition;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
      document.body.style.userSelect = 'none';
   };

   const handleMouseMove = (e: any) => {
      if (!isDragging.current || !containerRef.current) return;

      const containerSize = direction === 'horizontal' ? containerRef.current.offsetWidth : containerRef.current.offsetHeight;

      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      const delta = currentPos - startPos.current;
      const deltaPercent = (delta / containerSize) * 100;

      const newSplit = Math.min(Math.max(startSplit.current + deltaPercent, minSize), 100 - minSize);

      setSplitPosition(newSplit);
   };

   const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
   };

   useEffect(() => {
      return () => {
         document.removeEventListener('mousemove', handleMouseMove);
         document.removeEventListener('mouseup', handleMouseUp);
         document.body.style.cursor = '';
         document.body.style.userSelect = '';
      };
   }, []);

   const containerClass = direction === 'horizontal' ? 'flex flex-row h-full w-full' : 'flex flex-col h-full w-full';

   const dividerClass = direction === 'horizontal' ? 'w-1 bg-gray-300 hover:bg-blue-500 cursor-col-resize transition-colors' : 'h-2 z-50 bg-black cursor-row-resize transition-colors';

   const firstPaneStyle = direction === 'horizontal' ? { width: `${splitPosition}%` } : { height: `${splitPosition}%` };

   const secondPaneStyle = direction === 'horizontal' ? { width: `${100 - splitPosition}%` } : { height: `${100 - splitPosition}%` };

   return (
      <div ref={containerRef} className={containerClass}>
         <div className="" style={firstPaneStyle}>
            {firstChild}
         </div>
         <div className={dividerClass} onMouseDown={handleMouseDown} onTouchStart={handleMouseDown} />
         <div className="" style={secondPaneStyle}>
            {secondChild}
         </div>
      </div>
   );
};

export default SplitPane;
