import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

const IMG_WIDTH = 701;
const IMG_HEIGHT = 711;
const LABEL_HEIGHT = 50;
const HALF_W = IMG_WIDTH / 2;
const HALF_H = IMG_HEIGHT / 2;

const ATTRIBUTE_HEADERS = {
  'crop production': 'Crop Prod.',
  'nutrient production': 'Nutrient Prod.',
  'nature-based recreation capacity': 'Rec. Capacity',
  'nature-based recreation importance': 'Rec. Importance',
  'nutrient retention efficiency': 'Nutrient Eff.',
  'avoided nutrient export': 'Nutrient Export',
  'carbon density': 'Carbon Density',
  'avoided sediment export': 'Sediment Export'
};

const CLICKABLE_COLS = ['ecosystem_service', 'quadrant', 'layer'];

function App() {
  const [highlighted, setHighlighted] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [layers, setLayers] = useState([]);

  const figureQuads = useMemo(() => ([
    { id: 'landscape',         x: 0,       y: 0,          w: HALF_W - 1, h: HALF_H },
    { id: 'ecosystem_service', x: HALF_W,  y: 0,          w: HALF_W,     h: HALF_H },
    { id: 'management',        x: 0,       y: HALF_H + 1, w: HALF_W - 1, h: HALF_H - 1 },
    { id: 'quality_of_life',   x: HALF_W,  y: HALF_H + 1, w: HALF_W,     h: HALF_H - 1 }
  ]), []);

  const sideQuads = useMemo(() => ([
    { id: 'gap',    label: 'Gap',    x: 0, y: -LABEL_HEIGHT,      w: IMG_WIDTH, h: LABEL_HEIGHT, color: '#F5E6A9' },
    { id: 'demand', label: 'Demand', x: 0, y: IMG_HEIGHT,         w: IMG_WIDTH, h: LABEL_HEIGHT, color: '#CBB8E8' }
  ]), []);

  const quads = useMemo(() => [...figureQuads, ...sideQuads], [figureQuads, sideQuads]);

  const fetchLayers = useCallback(params => {
    axios.get('http://localhost:5000/datasets', { params })
      .then(({ data }) => {
        setLayers(data);
        setSelected(new Set(data.map(d => d.quadrant)));
      })
      .catch(console.error);
  }, []);

  useEffect(() => { fetchLayers({}); }, [fetchLayers]);

  const toggleQuadrant = id => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
    fetchLayers({ quadrant: [...next] });
  };

  const fillFor = (id, base) => {
    if (selected.size === 0) return 'transparent';
    if (selected.has(id)) return base ?? 'transparent';
    return highlighted === id ? 'rgba(50,50,50,0.25)' : 'rgba(50,50,50,0.75)';
  };

  const strokeFor = id =>
    selected.has(id) ? 3 : highlighted === id ? 2 : 1;

  return (
    <div style={{ textAlign: 'center', marginTop: 20 }}>
      <svg width={IMG_WIDTH} height={IMG_HEIGHT + LABEL_HEIGHT * 2}>
        <g transform={`translate(0, ${LABEL_HEIGHT})`}>
          <image
            href={`${process.env.PUBLIC_URL}/linkage_graphic.png`}
            width={IMG_WIDTH}
            height={IMG_HEIGHT}
          />
          {quads.map(({ id, label, x, y, w, h, color }) => {
            const stroke = strokeFor(id);
            const off = stroke / 2;
            return (
              <g
                key={id}
                cursor='pointer'
                onMouseEnter={() => setHighlighted(id)}
                onMouseLeave={() => setHighlighted(null)}
                onClick={() => toggleQuadrant(id)}
              >
                <rect
                  x={x + off}
                  y={y + off}
                  width={w - stroke}
                  height={h - stroke}
                  stroke='#34416E'
                  strokeWidth={stroke}
                  fill={fillFor(id, color)}
                />
                {label && (
                  <text
                    x={x + w / 2}
                    y={y + h / 2}
                    textAnchor='middle'
                    dominantBaseline='middle'
                    style={{ userSelect: 'none', pointerEvents: 'none', fontWeight: 'bold', fontSize: 20 }}
                  >
                    {label}
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <table style={{ margin: '20px auto', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>Ecosystem Service</th>
            <th>Quadrant</th>
            <th>Layer</th>
            {Object.entries(ATTRIBUTE_HEADERS).map(([key, header]) => (
              <th
                key={key}
                style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                onClick={() => fetchLayers({ [key]: 1 })}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {layers.map(layer => (
            <tr key={`${layer.ecosystem_service}-${layer.quadrant}-${layer.layer}`}>
              {CLICKABLE_COLS.map(col => (
                <td
                  key={col}
                  style={{ cursor: 'pointer', textDecoration: 'underline', color: 'blue' }}
                  onClick={() => fetchLayers({ [col]: layer[col] })}
                >
                  {layer[col]}
                </td>
              ))}
              {Object.keys(ATTRIBUTE_HEADERS).map(attr => (
                <td
                  key={attr}
                  style={{
                    textAlign: 'center',
                    backgroundColor: layer[attr] === '1' ? '#c8e6c9' : '#ffcdd2'
                  }}
                >
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
