import { Hero } from "../../components/homeSection/Hero/Hero";
import { Features } from "../../components/homeSection/Features/Features";
import { PopularSubjects } from "../../components/homeSection/PopularSubjects/PopularSubjects";
import { OurClients } from "../../components/homeSection/OurClients/ourClients";
import { ReviewsHome } from "../../components/homeSection/Reviews/ReviewsHome";

export const Home = () => {
  return (
    <div className="h-auto">
      <section className="section-spacing relative z-10 bg-bg-main">
        <Hero />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <Features />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <PopularSubjects />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <OurClients />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <ReviewsHome />
      </section>
    </div>
  );
};
