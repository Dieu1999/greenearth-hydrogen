import { Link } from './Link';
export function Footer({menu}) {
  return (
    <footer className='footer'>
      <nav className="flex gap-8 justify-center">
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
        <div className='copy-right'>
          &copy; {new Date().getFullYear()} Plant Shop. Powered by Plant Shop.
        </div>
    </footer>
  )
}