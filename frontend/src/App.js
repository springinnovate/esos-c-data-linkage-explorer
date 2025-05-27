import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [highlighted, setHighlighted] = useState(null);
  const [selected, setSelected] = useState(null);
  const [hasSelection, setHasSelection] = useState(false);
  const [queriedLayers, setQueriedLayers] = useState([]);

  const imgWidth = 701;
  const imgHeight = 711;
  const halfWidth = imgWidth / 2;
  const halfHeight = imgHeight / 2;

  const sections = [
    { id: 'landscape', color: '#F7CDAB', x: 0, y: 0, width: halfWidth-1, height: halfHeight},
    { id: 'ecosystem_service', color: '#96CAA2', x: halfWidth, y: 0, width: halfWidth, height: halfHeight},
    { id: 'gap', color: '#87B6B0', x: 0, y: halfHeight+1, width: halfWidth-1, height: halfHeight-1},
    { id: 'quality_of_life', color: '#F4B8AB', x: halfWidth, y: halfHeight+1, width: halfWidth, height: halfHeight-1},
  ];

  const handleMouseEnter = (section) => setHighlighted(section);
  const handleMouseLeave = () => setHighlighted(null);
  const handleClick = (section) => {
    setSelected(section);
    setHasSelection(true);
    axios.get(`http://localhost:5000/datasets?quadrant=${section}`)
      .then(response => {
        const layers = response.data.filter(item => item.quadrant === section);
        console.log(layers);
        setQueriedLayers(layers);
      })
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
                </g>
                )
            }
        )}
        </svg>
      <table style={{  margin: '20px auto', textAlign: 'center', marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Ecosystem Service</th>
            <th>Layer</th>
            <th>Crop Prod.</th>
            <th>Nutrient Prod.</th>
            <th>Rec. Capacity</th>
            <th>Rec. Importance</th>
            <th>Nutrient Eff.</th>
            <th>Nutrient Export</th>
            <th>Carbon Density</th>
            <th>Sediment Export</th>
          </tr>
        </thead>
        <tbody>
          {queriedLayers.map(layer => (
            <tr key={layer.layer}>
              <td>{layer.ecosystem_service}</td>
              <td>{layer.layer}</td>
              {[
                'crop production',
                'nutrient production',
                'nature-based recreation capacity',
                'nature-based recration importance',
                'nutrient retention efficiency',
                'avoided nutrient export',
                'carbon density',
                'avoided sediment export'
              ].map(attr => (
                <td key={attr} style={{textAlign: 'center', backgroundColor: layer[attr] === '1' ? '#c8e6c9' : '#ffcdd2'}}>
                  {layer[attr] === '1' ? '✓' : 'x'}
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
