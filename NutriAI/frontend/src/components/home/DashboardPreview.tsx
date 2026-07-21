export default function DashboardPreview() {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Dashboard Preview</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">A glimpse into the user dashboard.</p>
        </div>
        <div className="mt-12">
          <img src="https://via.placeholder.com/1200x600" alt="Dashboard Preview" className="rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
}
