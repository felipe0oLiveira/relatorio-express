import Header from "../components/HeaderSimple";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
      </main>
    </div>
  );
}
