import React, { useState } from 'react';

function App() {
  const [highlighted, setHighlighted] = useState(null);
  const [selected, setSelected] = useState(null);

  const sections = [
    { id: 'Landscapes', color: '#F7CDAB', x: 0, y: 0 },
    { id: 'Ecosystem Services', color: '#96CAA2', x: 251, y: 0 },
    { id: 'Management', color: '#87B6B0', x: 0, y: 251 },
    { id: 'Quality of Life', color: '#F4B8AB', x: 251, y: 251 },
  ];

  const handleMouseEnter = (section) => setHighlighted(section);
  const handleMouseLeave = () => setHighlighted(null);
  const handleClick = (section) => setSelected(section);

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <svg width="502" height="502">
          {sections.map(({ id, color, x, y }) => {
            const strokeWidth = highlighted === id ? 2 : selected === id ? 4 : 0;
            const offset = strokeWidth / 2;
            return (
                <g key={id}
                   cursor="pointer"
                   onMouseEnter={() => handleMouseEnter(id)}
                   onMouseLeave={handleMouseLeave}
                   onClick={() => handleClick(id)}>

                  <rect
                    x={x + offset}
                    y={y + offset}
                    width={250 - strokeWidth}
                    height={250 - strokeWidth}
                    fill={color}
                    stroke="#333"
                    strokeWidth={strokeWidth}
                  />

                  {/* Text Label centered */}
                  <text
                    x={x + 125}
                    y={y + 125}
                    fill="#000"
                    fontSize="16"
                    fontWeight={selected === id ? "bold": "normal"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                  >
                    {id}
                  </text>

                </g>
                )
            }
        )}
        </svg>
      {selected && (
        <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          You clicked on: {selected}
        </div>)
      }
        <div>
          Hovered: {highlighted || 'none'} | Selected: {selected || 'none'}
        </div>

    </div>
  );
}

export default App;
