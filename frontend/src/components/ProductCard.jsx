import { Link } from 'react-router-dom';

const ProductCard = ({ product, showActions, onEdit, onDelete }) => {
  return (
    <div className="product-card">
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.title} className="product-image" />
      )}
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          {showActions ? (
            <div className="product-actions">
              <button onClick={() => onEdit(product)} className="btn-edit-small">
                Edit
              </button>
              <button onClick={() => onDelete(product)} className="btn-delete-small">
                Delete
              </button>
            </div>
          ) : (
            <Link to={`/products/${product._id}`} className="btn-view">
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
