import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [highlighted, setHighlighted] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [datasets, setDatasets] = useState([]);

  const imgWidth = 701;
  const imgHeight = 711;
  const halfWidth = imgWidth / 2;
  const halfHeight = imgHeight / 2;

  const sections = [
    { id: 'Landscapes', color: '#F7CDAB', x: 0, y: 0, width: halfWidth-1, height: halfHeight},
    { id: 'Ecosystem Services', color: '#96CAA2', x: halfWidth, y: 0, width: halfWidth, height: halfHeight},
    { id: 'Management', color: '#87B6B0', x: 0, y: halfHeight+1, width: halfWidth-1, height: halfHeight-1},
    { id: 'Quality of Life', color: '#F4B8AB', x: halfWidth, y: halfHeight+1, width: halfWidth, height: halfHeight-1},
  ];

  const handleMouseEnter = (section) => setHighlighted(section);
  const handleMouseLeave = () => setHighlighted(null);
  const handleClick = (section) => {
    setSelected(section);
    setHasSelection(true);
    axios.get('http://localhost:5000/datasets')
      .then(response => setDatasets(response.data))
      .catch(error => console.error('Error fetching datasets:', error));
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <svg width={imgWidth} height={imgHeight}>
          <image
            href={`${process.env.PUBLIC_URL}/linkage_graphic.png`}
            x="0"
            y="0"
            width={imgWidth}
            height={imgHeight}
          />
          {sections.map(({ id, color, x, y, width, height }) => {
            const strokeWidth = selected === id ? 3 : highlighted === id ? 2 : 1;
            const offset = strokeWidth / 2;
            const fillColor = hasSelection ?
                selected === id ? 'rgba(0,0,0,0)' :
                highlighted === id ? 'rgba(50,50,50,0.25)' :
                    'rgba(50,50,50,0.75)'
                    : 'rgba(0,0,0,0)';
            return (
                <g key={id}
                   cursor="pointer"
                   onMouseEnter={() => handleMouseEnter(id)}
                   onMouseLeave={handleMouseLeave}
                   onClick={() => handleClick(id)}>

                  <rect
                    x={x + offset}
                    y={y + offset}
                    width={width - strokeWidth}
                    height={height - strokeWidth}
                    stroke="#333"
                    fill={fillColor}
                    strokeWidth={strokeWidth}
                  />

                  {/* Text Label centered */}
{/*                  <text
                    x={x + width/2}
                    y={y + height/2}
                    fontSize="16"
                    fontWeight={selected === id ? "bold": "normal"}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    pointerEvents="none"
                  >
                    {id}
                  </text>*/}

                </g>
                )
            }
        )}
        </svg>
      {selected && (
        <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
          {selected}
        </div>)
      }
      <div style={{ marginTop: '20px', textAlign: 'left' }}>
        <h3>Datasets from backend:</h3>
        <pre>{JSON.stringify(datasets, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
