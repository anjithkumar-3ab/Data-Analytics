export default function About() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <div className="max-w-screen-xl px-4 py-8 mx-auto space-y-12 lg:space-y-20 lg:py-24 lg:px-6">
        <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16">
          <div className="text-gray-500 sm:text-lg dark:text-gray-400">
            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">About NutriAI</h2>
            <p className="mb-8 font-light lg:text-xl">NutriAI is a comprehensive, AI-powered nutrition management system designed to provide personalized dietary recommendations. This project serves as a practical demonstration of a full-stack application, showcasing modern technologies and software architecture.</p>
          </div>
          <img className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex" src="https://via.placeholder.com/800x600" alt="feature image" />
        </div>
      </div>
    </section>
  );
}
