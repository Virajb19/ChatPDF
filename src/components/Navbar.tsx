import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  return <nav className="fixed z-[99] inset-x-0 border-b border-gray-600">
            <ThemeToggle />
  </nav>
}