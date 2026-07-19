export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-green-600">
          🥗 NutriAI
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-gray-700 font-medium">
          Welcome, User
        </span>

        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center">
          U
        </div>
      </div>
    </header>
  );
}