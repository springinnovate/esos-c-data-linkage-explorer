import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [highlighted, setHighlighted] = useState(null);
  const [selectedQuadrants, setSelectedQuadrants] = useState(new Set());
  const [activeLayers, setActiveLayers] = useState([]);

  const imgWidth = 701;
  const imgHeight = 711;
  const halfWidth = imgWidth / 2;
  const halfHeight = imgHeight / 2;
  const attributeFieldHeaders = {
    'crop production': 'Crop Prod.',
    'nutrient production': 'Nutrient Prod.',
    'nature-based recreation capacity': 'Rec. Capacity',
    'nature-based recration importance': 'Rec. Importance',
    'nutrient retention efficiency': 'Nutrient Eff.',
    'avoided nutrient export': 'Nutrient Export',
    'carbon density': 'Carbon Density',
    'avoided sediment export': 'Sediment Export'
  };
  const clickableColumns = ['ecosystem_service', 'quadrant', 'layer'];

  const figureQuadrants = [
    { quadrantId: 'landscape', color: null, x: 0, y: 0, width: halfWidth-1, height: halfHeight},
    { quadrantId: 'ecosystem_service', color: null, x: halfWidth, y: 0, width: halfWidth, height: halfHeight},
    { quadrantId: 'management', color: null, x: 0, y: halfHeight+1, width: halfWidth-1, height: halfHeight-1},
    { quadrantId: 'quality_of_life', color: null, x: halfWidth, y: halfHeight+1, width: halfWidth, height: halfHeight-1}
  ];
  const quadHeight = 50;

  const sideQuadrants = [
    { quadrantId: 'gap', label: 'Gap', x: 0, y: -quadHeight, width: imgWidth, height: quadHeight, color: '#F5E6A9'},
    { quadrantId: 'demand', label: 'Demand', x: 0, y: imgHeight, width: imgWidth, height: quadHeight, color: '#CBB8E8' },
  ];

  const totalSvgHeight = imgHeight + quadHeight * 2;

  useEffect(() => {
    fetchDataAndUpdateQuadrants({});
  }, []);

  const fetchDataAndUpdateQuadrants = (params) => {
    axios.get('http://localhost:5000/datasets', { params })
      .then(response => {
        setActiveLayers(response.data);

        // Automatically update selectedQuadrants based on fetched data
        const quadrantsFromData = new Set(response.data.map(item => item.quadrant));
        setSelectedQuadrants(quadrantsFromData);
      }).catch(error => console.error('Error fetching datasets:', error));
  };

  const handleQuadrantMouseEnter = (section) => setHighlighted(section);
  const handleQuadrantMouseLeave = () => setHighlighted(null);
  const handleQuadrantClick = (quadrantId) => {
      const updatedQuadrants = new Set(selectedQuadrants);
      if (updatedQuadrants.has(quadrantId)) {
        updatedQuadrants.delete(quadrantId);
      } else {
        updatedQuadrants.add(quadrantId);
      }

      setSelectedQuadrants(updatedQuadrants);
      fetchDataAndUpdateQuadrants({ quadrant: Array.from(updatedQuadrants) });
    };
  const handleTableClick = (key, value) => {
    fetchDataAndUpdateQuadrants({[key]: value});
  };
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <svg width={imgWidth} height={totalSvgHeight}>
          <g transform={`translate(0, ${quadHeight})`}>
            <image
              href={`${process.env.PUBLIC_URL}/linkage_graphic.png`}
              x="0"
              y="0"
              width={imgWidth}
              height={imgHeight}
            />

            {[...figureQuadrants, ...sideQuadrants].map(({ quadrantId, color, label, x, y, width, height }) => {
              const isSelected = selectedQuadrants.has(quadrantId);
              const isHighlighted = highlighted === quadrantId;
              const strokeWidth = isSelected ? 3 : isHighlighted ? 2 : 1;
              const offset = strokeWidth / 2;
              const fillColor =
                selectedQuadrants.size === 0
                  ? 'rgba(0,0,0,0)'
                  : isSelected
                  ? (color ?? 'rgba(0,0,0,0)')
                  : isHighlighted
                  ? 'rgba(50,50,50,0.25)'
                  : 'rgba(50,50,50,0.75)';

              return (
                <g key={quadrantId}
                   cursor="pointer"
                   onMouseEnter={() => handleQuadrantMouseEnter(quadrantId)}
                   onMouseLeave={handleQuadrantMouseLeave}
                   onClick={() => handleQuadrantClick(quadrantId)}>

                  <rect
                    x={x + offset}
                    y={y + offset}
                    width={width - strokeWidth}
                    height={height - strokeWidth}
                    stroke="#34416E"
                    fill={fillColor}
                    strokeWidth={strokeWidth}
                  />

                  {label && (
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#000"
                      style={{ userSelect: 'none', pointerEvents: 'none', fontWeight: 'bold', fontSize: '20px' }}
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      <table style={{  margin: '20px auto', textAlign: 'center', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Ecosystem Service</th>
            <th>Quadrant</th>
            <th>Layer</th>
            {Object.entries(attributeFieldHeaders).map(([key, header]) => (
              <th
                key={key}
                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                onClick={() => handleTableClick(key, '1')}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeLayers.map(layer => (
            <tr key={`${layer.ecosystem_service}-${layer.quadrant}-${layer.layer}`}>
              {clickableColumns.map((col) => (
                <td
                  key={col}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                  onClick={() => handleTableClick(col, layer[col])}
                >
                  {layer[col]}
                </td>
              ))}
              {Object.keys(attributeFieldHeaders).map(attr => (
                <td
                  key={attr}
                  style={{ textAlign: 'center', backgroundColor: layer[attr] === '1' ? '#c8e6c9' : '#ffcdd2' }}
                >
                  {layer[attr] === '1' ? '✓' : '✘'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
