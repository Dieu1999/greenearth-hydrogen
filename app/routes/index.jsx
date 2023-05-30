
import { Hero } from "../components/Hero";
import {FeaturedProducts} from '../components/FeaturedProducts'
import {PRODUCT_CARD_FRAGMENT} from '../data/fragments';
import {defer} from '@shopify/remix-oxygen';
import {routeHeaders, CACHE_SHORT} from '../data/cache';
import {Await, useLoaderData} from '@remix-run/react';


export const headers = routeHeaders;

export const meta = () => {
  return {
    title: 'GreenStore',
    description: 'This is store demo',
  };
};


export async function loader({params, context}) {
  const {language, country} = context.storefront.i18n;

  if (
    params.lang &&
    params.lang.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the lang URL param is defined, yet we still are on `EN-US`
    // the the lang param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  return defer(
    {
      // These different queries are separated to illustrate how 3rd party content
      // fetching can be optimized for both above and below the fold.
      featuredProducts: context.storefront.query(
        HOMEPAGE_FEATURED_PRODUCTS_QUERY,
        {
          variables: {
            /**
             * Country and language properties are automatically injected
             * into all queries. Passing them is unnecessary unless you
             * want to override them from the following default:
             */
            country,
            language,
          },
        },

      )
    },
    {
      headers: {
        'Cache-Control': CACHE_SHORT,
      },
    },
  );

}


export default function Index() {
  let subheading = 'WELCOME TO THE GREENSTORE'
  let heading = 'Let’s Bring the Spring to Your Home'
  let image = 'https://websitedemos.net/plant-shop-02/wp-content/uploads/sites/931/2021/09/hero-section-bg.jpg'
  let buttonText = 'Shop now'
  let buttonLink = '/collections/plants';

  const {featuredProducts} = useLoaderData();
  
  return (
    <>
      <Hero subheading={subheading} heading={heading} image={image} buttonLink={buttonLink} buttonText={buttonText} />
      {featuredProducts && (
        <Await resolve={featuredProducts}>
          {({products}) => {
            if (!products?.nodes) return <></>;
            return (
              <FeaturedProducts 
                products={products.nodes}
                title="New plants"
                buttonLink={buttonLink}
                buttonText={buttonText}
              />
            )
          }}
        </Await>
      )}
    </>
  
  );
}


// @see: https://shopify.dev/api/storefront/latest/queries/products
export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 8) {
      nodes {
        ...ProductCard
      }
    }
  }
`;