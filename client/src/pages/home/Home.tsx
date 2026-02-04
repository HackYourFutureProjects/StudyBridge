import { Features } from "../../components/home-section/Features/Features";
import { PopularSubjects } from "../../components/home-section/PopularSubjects/PopularSubjects";

export const Home = () => {
  return (
    <div className="h-auto">
      <section className="section-spacing relative z-10 bg-bg-main">
        <Features />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <PopularSubjects />
      </section>
    </div>
  );
};
