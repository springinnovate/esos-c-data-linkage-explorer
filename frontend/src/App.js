import React, { useState } from 'react';

function App() {
  const [highlighted, setHighlighted] = useState(null);
  const [selected, setSelected] = useState(null);

  const sections = [
    { id: 'Landscapes', color: '#F7CDAB', x: 0, y: 0 },
    { id: 'Ecosystem Services', color: '#96CAA2', x: 250, y: 0 },
    { id: 'Management', color: '#87B6B0', x: 0, y: 250 },
    { id: 'Quality of Life', color: '#F4B8AB', x: 250, y: 250 },
  ];

  const handleMouseEnter = (section) => setHighlighted(section);
  const handleMouseLeave = () => setHighlighted(null);
  const handleClick = (section) => setSelected(section);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <svg width="500" height="500">
          {sections.map(({ id, color, x, y }) => (
            <g key={id}
               cursor="pointer"
               onMouseEnter={() => handleMouseEnter(id)}
               onMouseLeave={handleMouseLeave}
               onClick={() => handleClick(id)}>

              {/* Background rectangle */}
              <rect
                x={x}
                y={y}
                width="250"
                height="250"
                fill={color}
                stroke={highlighted === id ? '#333' : 'none'}
                strokeWidth={highlighted === id ? '4' : selected === id ? '2': '0'}
              />

              {/* Text Label centered */}
              <text
                x={x + 125}
                y={y + 125}
                fill="#000"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="middle"
                pointerEvents="none" // Ensures clicks pass through to rect
              >
                {id}
              </text>

            </g>
          ))}
        </svg>
      {selected && (
        <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          You clicked on: {selected}
        </div>
      )}
    </div>
  );
}

export default App;
