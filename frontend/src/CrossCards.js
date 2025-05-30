/* CrossCards.js */
import React from 'react';

const HDR_COLORS = {
  'Ecosystem service category': '#0d6efd',
  'Model inputs': '#20c997',
  'Model outputs': '#6610f2',
  'Change could affect ES': '#fd7e14',
  'Change in ES could affect': '#dc3545',
};

const CardBox = ({ title, items, onPickCategory, isCategory = false, selected }) => (
  <div className='card h-100'>
    <div
      className='card-header text-white text-center py-1'
      style={{ backgroundColor: HDR_COLORS[title] || '#0d6efd' }}
    >
      {title}
    </div>
    <div className='card-body p-2 d-flex flex-column align-items-center'>
      {isCategory
        ? items.map(cat => (
            <button
              key={cat}
              className={`btn btn-sm m-1 ${
                selected === cat ? 'btn-success' : 'btn-outline-secondary'
              }`}
              onClick={() => onPickCategory(cat)}
            >
              {cat}
            </button>
          ))
        : items.map((row, i) => (
            <span
              key={i}
              className='d-inline-block mb-1 py-1 px-2 bg-light border rounded small text-center'
              style={{ maxWidth: 300 }}
            >
              {row.layer}
            </span>
          ))}
    </div>
  </div>
);

const CrossCards = ({
  boxesData,
  handleCategoryPick,
  categories,
  selectedCategory,
  setSelectedCategory,
}) => (
  <div className='position-relative me-3' style={{ width: 720 }}>
    <div
      className='d-grid gap-2'
      style={{
        gridTemplateColumns: '1fr auto 1fr',
        gridTemplateRows: 'auto auto auto',
        gridTemplateAreas: `
          ". inputs ."
          "left center right"
          ". outputs ."
        `,
      }}
    >
      <div style={{ gridArea: 'inputs' }}>
        <CardBox title='Model inputs' items={boxesData['1'] || []} />
      </div>

      <div style={{ gridArea: 'outputs' }}>
        <CardBox title='Model outputs' items={boxesData['4'] || []} />
      </div>

      <div style={{ gridArea: 'left' }}>
        <CardBox
          title='Change could affect ES'
          items={boxesData['2'] || []}
          style={{ minWidth: 180 }}
        />
      </div>

      <div style={{ gridArea: 'right' }}>
        <CardBox title='Change in ES could affect' items={boxesData['3'] || []} />
      </div>

      <div style={{ gridArea: 'center', minWidth: 200 }}>
        <CardBox
          title='Ecosystem Service Category'
          items={categories}
          isCategory
          onPickCategory={handleCategoryPick}
          selected={selectedCategory}
        />
      </div>
    </div>
  </div>
);

export default CrossCards;
