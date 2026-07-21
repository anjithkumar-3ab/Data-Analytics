export default function AiRecommendationPreview() {
  return (
    <section className="bg-gray-50 dark:bg-gray-800">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">AI Recommendation Preview</h2>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">See the AI in action.</p>
        </div>
        <div className="mt-12">
          <img src="https://via.placeholder.com/1200x600" alt="AI Recommendation Preview" className="rounded-lg shadow-lg" />
        </div>
      </div>
    </section>
  );
}
