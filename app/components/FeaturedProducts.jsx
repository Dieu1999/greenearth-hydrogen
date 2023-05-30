import { ProductCard } from "./ProductCard";
import { Link } from './Link';

const mockProducts = new Array(2).fill('');

export function FeaturedProducts({
  title = 'New plants',
  products = mockProducts,
  buttonLink = '',
  buttonText = 'Shop now'
}) {
  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{title}</h2>
          <Link className='btn btn-secondary' to={buttonLink}> {buttonText} </Link>
        </div>
        <div className="grid-flow-row grid gap-2 gap-y-6 md:gap-3 lg:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              product={product}
              key={product.id}
              className="snap-start w-80"
            >
            </ProductCard>
          ))}
        </div>
      </div>
    </section>
  )
}
