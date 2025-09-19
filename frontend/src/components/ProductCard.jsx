function ProductCard({ product }) {
  const { name, category, description, price } = product || {};

  return (
    <div className="card h-100 border-0 shadow-sm">
      <div className="ratio ratio-16x9 bg-light d-flex align-items-center justify-content-center">
        <span className="display-6" aria-hidden>🧱</span>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between mb-2">
          <h5 className="card-title mb-0">{name}</h5>
          <span className="badge bg-info text-dark">{category}</span>
        </div>
        <p className="card-text text-muted flex-grow-1" style={{minHeight: '3rem'}}>
          {description}
        </p>
        <div className="d-flex align-items-center justify-content-between mt-2">
          <span className="fw-bold text-success">${typeof price === 'number' ? price.toFixed(2) : price}</span>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;


