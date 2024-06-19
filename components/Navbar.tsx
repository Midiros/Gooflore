import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between">
        <Link href="/" className="text-white">
          Generate Theory
        </Link>
        <Link href="/theories" className="text-white">
          List All Theories
        </Link>
      </div>
    </nav>
  );
}
