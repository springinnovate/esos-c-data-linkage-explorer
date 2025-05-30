import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import CrossCards from './CrossCards';
import axios from 'axios';

const CATEGORY_REGEX = /[^a-zA-Z ]/g;
const cleanCategory = cat => cat.replace(CATEGORY_REGEX, '').trim();

const BOXES = [
  { title: 'Ecosystem Service Category', key: null },
  { title: 'Model Inputs', key: '1' },
  { title: 'Model Outputs', key: '4' },
  { title: 'Change in this could affect Ecosystem Service', key: '2' },
  { title: 'Change in Ecosystem Service could affect this', key: '3' }
];

const IMG_WIDTH = 701;
const IMG_HEIGHT = 711;
const LABEL_HEIGHT = 50;
const HALF_W = IMG_WIDTH / 2;
const HALF_H = IMG_HEIGHT / 2;
const VIEWBOX_HEIGHT = IMG_HEIGHT + LABEL_HEIGHT * 2;
const SCALE = 0.5;

function App() {
  const [highlighted, setHighlighted] = useState(null);
  const [selected, setSelected] = useState(new Set());
  const [layers, setLayers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const cleanedCat = selectedCategory ? cleanCategory(selectedCategory) : null;
  const boxesData = useMemo(() => {
    if (!cleanedCat) return {};
    return BOXES
      .filter(b => b.key)
      .reduce((acc, b) => {
        acc[b.key] = layers.filter(row =>
          String(row[cleanedCat]) === b.key
        );
        return acc;
      }, {});
  }, [layers, cleanedCat]);


  const handleCategoryPick = cat => {
    setSelectedCategory(cat);
    const cleaned = cleanCategory(cat);
    const quads = new Set(
      layers
        .filter(r => String(r[cleaned]) !== '0')
        .map(r => r.quadrant)
    );
    setSelected(quads);
  };


  const figureQuads = useMemo(() => [
    { id: 'landscape', x: 0, y: 0, w: HALF_W - 1, h: HALF_H },
    { id: 'ecosystem_service', x: HALF_W, y: 0, w: HALF_W, h: HALF_H },
    { id: 'management', x: 0, y: HALF_H + 1, w: HALF_W - 1, h: HALF_H - 1 },
    { id: 'quality_of_life', x: HALF_W, y: HALF_H + 1, w: HALF_W, h: HALF_H - 1 }
  ], []);

  const sideQuads = useMemo(() => [
    { id: 'gap', label: 'Gap', x: 0, y: -LABEL_HEIGHT, w: IMG_WIDTH, h: LABEL_HEIGHT, color: '#F5E6A9' },
    { id: 'demand', label: 'Demand', x: 0, y: IMG_HEIGHT, w: IMG_WIDTH, h: LABEL_HEIGHT, color: '#CBB8E8' }
  ], []);

  const quads = useMemo(() => [...figureQuads, ...sideQuads], [figureQuads, sideQuads]);

  const fetchLayers = useCallback(params => {
    axios
      .get('/datasets', { params })
      .then(({ data }) => {
        setCategories(data.categories);
        setLayers(data.datasets);
      })
      .catch(() => {
        axios
          .get('http://localhost:5000/datasets', { params })
          .then(({ data }) => {
            setCategories(data.categories);
            setLayers(data.datasets);
          })
          .catch(err => console.error('Both fetch attempts failed:', err));
      });
  }, []);

  useEffect(() => {
    fetchLayers({});
  }, [fetchLayers]);

  const fillFor = (id, base) => {
    if (selected.size === 0) return 'transparent';
    if (selected.has(id)) return base ?? 'transparent';
    return highlighted === id ? 'rgba(50,50,50,0.25)' : 'rgba(50,50,50,0.75)';
  };

  const strokeFor = id => (selected.has(id) ? 3 : highlighted === id ? 2 : 1);

  return (
    <div className='container-fluid px-0'>
      <div className='d-flex'>
        <CrossCards
          handleCategoryPick={handleCategoryPick}
          boxesData={boxesData}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <svg
              viewBox={`0 0 ${IMG_WIDTH} ${VIEWBOX_HEIGHT}`}
              width={IMG_WIDTH * SCALE}
              height={VIEWBOX_HEIGHT * SCALE}
              style={{ display: 'block' }}
          >
            <g transform={`translate(0, ${LABEL_HEIGHT})`}>
              <image href={`${process.env.PUBLIC_URL}/linkage_graphic.png`} width={IMG_WIDTH} height={IMG_HEIGHT} />
              {quads.map(({ id, label, x, y, w, h, color }) => {
                const stroke = strokeFor(id);
                const off = stroke / 2;
                return (
                  <g key={id}>
                    <rect x={x + off} y={y + off} width={w - stroke} height={h - stroke} stroke='#34416E' strokeWidth={stroke} fill={fillFor(id, color)} />
                    {label && (
                      <text x={x + w / 2} y={y + h / 2} textAnchor='middle' dominantBaseline='middle' style={{ userSelect: 'none', pointerEvents: 'none', fontWeight: 'bold', fontSize: 20 }}>
                        {label}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

export default App;
