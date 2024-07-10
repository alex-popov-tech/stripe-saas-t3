import Link from "next/link";

export function Header() {
  return (
    <header className="navbar flex bg-base-100">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          🔥 Stripe for SaaS
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className="btn">
              Home
            </Link>
          </li>
          <li>
            <Link href="/icons" className="btn mx-3">
              NFT Icons
            </Link>
          </li>
          <li>
            <Link href="/user" className="btn">
              User
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
