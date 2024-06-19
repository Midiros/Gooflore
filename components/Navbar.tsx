import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">

      <div className="container mx-auto flex justify-between">
        <Link
          href="/"
          className="text-white hover:text-grey-100 ease-in-out duration-100 hover:animate-pulse"
        >
          Begin a theory
        </Link>
        <Link
          href="/theories"
          className="text-white hover:text-grey-100 ease-in-out duration-100 hover:animate-pulse"
        >
          Reveal the secrets
        </Link>
      </div>
    </nav>
  );
}
