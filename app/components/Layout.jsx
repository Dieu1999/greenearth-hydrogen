import {useMatches, Await, useFetchers} from '@remix-run/react';
import {useEffect, Suspense} from 'react';

import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import {Drawer, useDrawer} from '../components/Drawer';


import {CartLineItems, CartActions, CartSummary} from '../components/Cart';

export function Layout({children, title, logo, layout}) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const fetchers = useFetchers();
  const [root] = useMatches();
  const cart = root.data?.cart;
  
  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = [];
  for (const fetcher of fetchers) {
    if (fetcher?.formData?.get('cartAction') === 'ADD_TO_CART') {
      addToCartFetchers.push(fetcher);
    }
  }
  // When the fetchers array changes, open the drawer if there is an add to cart action
  useEffect(() => {
    if (isOpen || addToCartFetchers.length === 0) return;
    openDrawer();
  }, [addToCartFetchers]);

  return (
    <div className="flex flex-col min-h-screen antialiased">
  
      <Header title={title} logo={logo} menu={layout.headerMenu} openDrawer={openDrawer} cart={cart}/>
      <main
        role="main"
        id="mainContent"
        className="flex-grow"
      >
        {children}
      </main>
      <Footer menu={layout.footerMenu}/>

      <Drawer open={isOpen} onClose={closeDrawer}>
        <CartDrawer cart={cart} close={closeDrawer} />
      </Drawer>

    </div>
  );
}

function CartDrawer({cart, close}) {
  return (
    <Suspense>
      <Await resolve={cart}>
        {(data) => (
          <>
            {data?.totalQuantity > 0 ? (
              <>
                <div className="flex-1 overflow-y-auto">
                  <div className="flex flex-col space-y-7 md:py-8 md:px-6 px-4 py-6">
                    <CartLineItems linesObj={data.lines} />
                  </div>
                </div>
                <div className="w-full md:px-6 px-4 py-6 space-y-6 border border-1 border-gray-00">
                  <CartSummary cost={data.cost} />
                  <CartActions checkoutUrl={data.checkoutUrl} showBtnViewCart={true}/>
                </div>
              </>
            ) : (
              <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
                <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
                  Your cart is empty
                </h2>
                <button
                  onClick={close}
                  className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
                >
                  Continue shopping
                </button>
              </div>
            )}
          </>
        )}
      </Await>
    </Suspense>
  );
}
