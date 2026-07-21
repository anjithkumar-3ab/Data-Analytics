import HomeLayout from "../components/layout/HomeLayout";
import {
  Hero,
  About,
  Features,
  TechStack,
  DashboardPreview,
  AiRecommendationPreview,
  AnalyticsPreview,
  PowerBiPreview,
  AdminPreview,
  Stats,
  Developer,
} from '../components/home';

export default function Home() {
  return (
    <HomeLayout>
      <Hero />
      <About />
      <Features />
      <TechStack />
      <DashboardPreview />
      <AiRecommendationPreview />
      <AnalyticsPreview />
      <PowerBiPreview />
      <AdminPreview />
      <Stats />
      <Developer />
    </HomeLayout>
  );
}
