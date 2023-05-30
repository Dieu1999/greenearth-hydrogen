import {flattenConnection, Image, Money, useMoney} from '@shopify/hydrogen';
import {Link} from './Link';
import {isDiscounted, isNewArrival} from '~/lib/utils';


export function ProductCard({
  product,
  label,
  className,
  loading,
  onClick,
  quickAdd,
}) {
  let cardLabel;

  const cardProduct = product?.variants ? product :'';
  if (!cardProduct?.variants?.nodes?.length) return null;
  const firstVariant = flattenConnection(cardProduct.variants)[0];

  if (!firstVariant) return null;
  const {image, price, compareAtPrice} = firstVariant;

  if (label) {
    cardLabel = label;
  } else if (isDiscounted(price, compareAtPrice)) {
    cardLabel = 'Sale';
  } else if (isNewArrival(product.publishedAt)) {
    cardLabel = 'New';
  }

  const productAnalytics = {
    productGid: product.id,
    variantGid: firstVariant.id,
    name: product.title,
    variantName: firstVariant.title,
    brand: product.vendor,
    price: firstVariant.price.amount,
    quantity: 1,
  };

  return (
    <div className="product-card relative flex flex-col gap-2">
      <Link
        onClick={onClick}
        to={`/products/${product.handle}`}
        prefetch="intent"
      >
        <div className={'grid gap-4'}>
          <div className="card-image aspect-[4/5] bg-primary/5">
            {image && (
              <Image
                className="aspect-[4/5] w-full object-cover fadeIn"
                widths={[320]}
                sizes="320px"
                loaderOptions={{
                  crop: 'center',
                  scale: 2,
                  width: 320,
                  height: 400,
                }}
                data={image}
                alt={image.altText || `Picture of ${product.title}`}
                loading={loading}
              />
            )}
            <div
              className={`absolute top-0 right-0 m-4 text-right text-notice ${cardLabel ? 'on-' + cardLabel.toLowerCase(): ''}`}>
              {cardLabel}
            </div>
          </div>
          <div className="grid gap-1">
            <h3 className="w-full overflow-hidden whitespace-nowrap text-ellipsis">
              {product.title}
            </h3>
            <div className="flex gap-4">
                <Money withoutTrailingZeros data={price} />
                {isDiscounted(price, compareAtPrice) && (
                  <CompareAtPrice
                    className={'opacity-50'}
                    data={compareAtPrice}
                  />
                )}
            </div>
          </div>
        </div>
      </Link>
  
    </div>
  );
}

function CompareAtPrice({data, className}) {
  const {currencyNarrowSymbol, withoutTrailingZerosAndCurrency} =
    useMoney(data);

  return (
    <span className={className}>
      {currencyNarrowSymbol}
      {withoutTrailingZerosAndCurrency}
    </span>
  );
}
