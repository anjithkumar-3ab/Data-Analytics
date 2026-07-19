import Layout from "../components/layout/Layout";

export default function Home() {
  return (
    <Layout>
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-green-600">
          AI-Based Personalized Diet Planning System
        </h1>

        <p className="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">
          Get personalized nutrition plans based on your body,
          lifestyle, and health goals using Artificial Intelligence.
        </p>

        <div className="mt-10 flex justify-center gap-5">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700">
            Get Started
          </button>

          <button className="border border-green-600 text-green-600 px-8 py-3 rounded-lg hover:bg-green-100">
            Learn More
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">
            🥗 Personalized Diet
          </h2>

          <p>
            Diet plans generated according to your body
            measurements and goals.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">
            🤖 AI Recommendation
          </h2>

          <p>
            Machine Learning predicts the best diet category
            for every user.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-3">
            📈 Progress Tracking
          </h2>

          <p>
            Monitor weight, BMI, calories, and nutrition over time.
          </p>
        </div>
      </section>
    </Layout>
  );
}