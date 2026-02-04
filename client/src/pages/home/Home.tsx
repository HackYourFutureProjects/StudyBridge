import { Features } from "../../components/home-section/Features/Features";
import { PopularSubjects } from "../../components/home-section/PopularSubjects/PopularSubjects";
import { OurClients } from "../../components/home-section/OurClients/ourClients";

export const Home = () => {
  return (
    <div className="h-auto">
      <section className="section-spacing relative z-10 bg-bg-main">
        <Features />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <PopularSubjects />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
       <OurClients />
      </section>
    </div>
  );
};
