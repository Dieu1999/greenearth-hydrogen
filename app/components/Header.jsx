import { Image } from '@shopify/hydrogen-react';
import { useIsHomePath } from '../lib/utils';
import { Link } from './Link';
import { CartHeader } from "./CartHeader";
import { useMatches } from '@remix-run/react';

export function Header({ title, logo, menu, cart, openDrawer }) {
  const isHome = useIsHomePath();
  return (
    <>
      <DesktopHeader isHome={isHome} title={title} logo={logo} menu={menu} cart={cart} openDrawer={openDrawer}/>
    </>
  )
}

export function DesktopHeader({ title, logo, menu, isHome, openDrawer, cart }) {
  return (
    <header
      role="banner"
      className={`${
        isHome
          ? ' flex items-center h-16 p-6 lg:p-12 sticky z-40 top-0 justify-between w-full transition dark-header'
          : 'flex items-center h-16 p-6 lg:p-12 sticky z-40 top-0 justify-between w-full transition white-header'
      }`}
    >
      <div className="flex">
        <a className="font-bold" href="/">
          {logo ? (
            <Image
              className="w-full object-cover fadeIn"
              widths={[150]}
              sizes="320px"
              loaderOptions={{
                crop: 'center',
                scale: 2,
                width: 150,
                height: 24,
              }}
              data={{ url: logo }}
              alt={title}
            />
          ) : (
            { title }
          )}
        </a>
      </div>

      <div className='flex items-center gap-8'>
        <nav className="flex gap-8">
          {(menu?.items || []).map((item) => (
            <Link
              key={item.id}
              to={item.to}
              target={item.target}
              prefetch="intent"
              className={({ isActive }) =>
                isActive ? 'pb-1 border-b -mb-px' : 'pb-1'
              }
            >
              {item.title}
            </Link>
          ))}
        </nav>
        <AccountLink className="relative flex items-center justify-center focus:ring-primary/5" />
        <CartHeader cart={cart} openDrawer={openDrawer} />
      </div>
    </header>
  )
}

function AccountLink({ className }) {
  const [root] = useMatches();
  const isLoggedIn = root.data?.isLoggedIn;
  return (
    <Link className={className} to={isLoggedIn ? "/account" : "/account/login"}>
     <svg viewBox="0 0 120 120">
      <path d="M84.6,62c-14.1,12.3-35.1,12.3-49.2,0C16.1,71.4,3.8,91,3.8,112.5c0,2.1,1.7,3.8,3.8,3.8h105c2.1,0,3.8-1.7,3.8-3.8 C116.2,91,103.9,71.4,84.6,62z"></path>
      <circle cx="60" cy="33.8" r="30"></circle>
    </svg>
   </Link>
  );
}