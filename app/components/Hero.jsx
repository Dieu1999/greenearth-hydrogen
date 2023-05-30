import {Image} from '@shopify/hydrogen-react';
import { Link } from './Link';

export function Hero({subheading, heading, image, buttonLink, buttonText}) {
  return (
    <section className='hero-section'>
      <Image
        className="w-full object-cover fadeIn"
        widths={[1920]}
        sizes="1920px"
        loaderOptions={{
          width: 1920,
          height: 1080,
        }}
        data={{url: image}}
        alt='Demo'
      />

      <div className='hero-text'>
        <h5 className='subheading'>{subheading}</h5>
        <h1 className='heading'>{heading}</h1>
        <Link className='btn btn-primary' to={buttonLink}> {buttonText} </Link>
      </div>
    </section>
  );
}
