import React, { useEffect, useRef } from 'react';
import { Timeline } from 'vis-timeline/standalone';
import 'vis-timeline/styles/vis-timeline-graph2d.min.css';
//CSS
interface ShiftItem {
  id: number;
  content: string;
  start: string;
  end: string;  
}

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!containerRef.current) return;
    const items: ShiftItem[] = [
      { id: 1, content: 'A', start: '2026-04-21 09:00', end: '2026-04-21 18:00' },
      { id: 2, content: 'B', start: '2026-04-21 21:00', end: '2026-04-22 06:00' }
    ];
    const options = {
      stack: false,
      editable: true,
    };
    const timeline = new Timeline(containerRef.current, items, options);
    return () => timeline.destroy();
  }, []);
  return (
    <body>
    <div style={{ padding: '20px' }}>
      <h1>シフト管理システム</h1>
      <div ref={containerRef} />
    </div>
    </body>
  );
};
export default App;