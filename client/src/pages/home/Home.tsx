import { Hero } from "../../components/homeSection/Hero/Hero";
import { Features } from "../../components/homeSection/Features/Features";
import { PopularSubjects } from "../../components/homeSection/PopularSubjects/PopularSubjects";
import { OurClients } from "../../components/homeSection/OurClients/ourClients";
import { ReviewsHome } from "../../components/homeSection/Reviews/ReviewsHome";
import { useSubjectsQuery } from "../../features/subjects/query/useSubjectsQuery.tsx";
import { useModalStore } from "../../store/modals.store.ts";
import { useEffect, useMemo, useState } from "react";

const loaderKey = "app-loader";

export const Home = () => {
  const { open, close } = useModalStore();
  const activeModal = useModalStore((s) => s.activeModal);
  const { data, isLoading } = useSubjectsQuery();
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);

  const [shouldShowOnce] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return sessionStorage.getItem(loaderKey) !== "1";
  });

  useEffect(() => {
    if (!shouldShowOnce) {
      return;
    }
    const t = setTimeout(() => setMinDelayDone(true), 1000);
    return () => clearTimeout(t);
  }, [shouldShowOnce]);

  const showLoader = useMemo(() => {
    if (!shouldShowOnce) {
      return false;
    }
    return isLoading || !heroLoaded || !minDelayDone;
  }, [shouldShowOnce, isLoading, heroLoaded, minDelayDone]);

  useEffect(() => {
    if (!shouldShowOnce) {
      return;
    }
    if (showLoader) {
      if (activeModal !== "fullScreenLoader") {
        open("fullScreenLoader");
      }
    } else {
      if (activeModal === "fullScreenLoader") {
        close();
        sessionStorage.setItem(loaderKey, "1");
      }
    }
  }, [shouldShowOnce, showLoader, activeModal, open, close]);

  return (
    <div className="h-auto">
      <section className="section-spacing relative z-10 bg-bg-main">
        <Hero onLoaded={() => setHeroLoaded(true)} subjects={data} />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <Features />
      </section>
      <section className="section-spacing relative z-10 bg-bg-main">
        <PopularSubjects subjects={data ?? []} isLoading={isLoading} />
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
