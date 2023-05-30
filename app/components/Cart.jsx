import {Link, useFetcher} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';

export function CartLineItems({linesObj}) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="space-y-6">
      {lines.map((line) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex gap-4 cart-line-item">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0 cart-item-image"
      >
        <Image data={merchandise.image} alt="test" />
      </Link>
      <div className="flex-1">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:underline"
        >
          {merchandise.product.title}
        </Link>
        <div className="line-item-price text-gray-800 text-sm flex">
          {' '}
          {quantity} x <Money data={lineItem.cost.totalAmount} />{' '}
        </div>
        <ItemRemoveButton lineIds={[lineItem.id]} />
      </div>
    </div>
  );
}

function ItemRemoveButton({lineIds}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="post" className='cart-remove'>
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <button
        className="rounded-full"
        type="submit"
      >
        <IconRemove />
      </button>
    </fetcher.Form>
  );
}

function IconRemove() {
  return (
    <svg
      className="ast-mobile-svg ast-close-svg"
      fill="currentColor"
      version="1.1"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M5.293 6.707l5.293 5.293-5.293 5.293c-0.391 0.391-0.391 1.024 0 1.414s1.024 0.391 1.414 0l5.293-5.293 5.293 5.293c0.391 0.391 1.024 0.391 1.414 0s0.391-1.024 0-1.414l-5.293-5.293 5.293-5.293c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>
    </svg>
  );
}

export function CartSummary({cost}) {
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Subtotal</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money data={cost?.subtotalAmount} />
            ) : (
              '-'
            )}
          </dd>
        </div>
      </dl>
    </>
  );
}

export function CartActions({checkoutUrl, showBtnViewCart}) {
  if (!checkoutUrl) return null;

  return (
    <div className="flex flex-col mt-2">
      {showBtnViewCart ? (
        <Link to="/cart" className="btn-secondary w-full text-center">
          View Cart
        </Link>
      ) : (
        ''
      )}

      <a
        href={checkoutUrl}
        className="bg-black mt-4 text-white px-6 py-3 w-full text-center"
      >
        Checkout
      </a>
    </div>
  );
}
