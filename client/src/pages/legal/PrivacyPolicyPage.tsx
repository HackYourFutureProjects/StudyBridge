import { NavLink } from "react-router-dom";
import React from "react";
import { Button } from "../../components/ui/button/Button";

interface PolicySection {
  id: string;
  title: string;
}

export const PrivacyPolicyPage: React.FC = () => {
  const sections: PolicySection[] = [
    { id: "intro", title: "1. Introduction" },
    { id: "collection", title: "2. Information We Collect" },
    { id: "usage", title: "3. How We Use Your Information" },
    { id: "sharing", title: "4. Sharing of Information" },
    { id: "cookies", title: "5. Cookies & Tracking" },
    { id: "retention", title: "6. Data Retention" },
    { id: "security", title: "7. Data Security" },
    { id: "rights", title: "8. Your Privacy Rights" },
    { id: "contact", title: "9. Contact Us" },
  ];

  return (
    <div className="bg-transparent px-4 pt-32 pb-20 min-h-screen text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="pt-10 pb-4 font-bold text-white text-5xl tracking-tight">
          Privacy & Data Protection
        </h1>
        <nav className="bg-dark-900 mb-12 p-8 border border-blue-400 rounded-xl">
          <h2 className="mb-6 font-semibold text-white text-xl">
            Table of Contents
          </h2>
          <ul className="gap-3 grid md:grid-rows-5 grid-flow-row md:grid-flow-col">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-gray-300 hover:text-white hover:underline transition-all"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          <section id="intro" className="scroll-mt-24">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              1. Introduction
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Welcome to <strong>StudyBridge</strong>. We respect your privacy
              and are committed to protecting your personal data. This policy
              outlines our practices regarding the collection, use, and
              disclosure of your information when you access our tutoring
              services, mobile applications, or website.
            </p>
          </section>

          <section id="collection">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              2. Information We Collect
            </h2>
            <div className="space-y-4 text-gray-300">
              <p>
                We collect information that identifies, relates to, or could
                reasonably be linked to you:
              </p>
              <ul className="space-y-3 ml-6 list-disc">
                <li>
                  <strong>Account Information:</strong> Name, email, and
                  encrypted password.
                </li>
                <li>
                  <strong>Educational Profile:</strong> Subjects of interest,
                  grade level, and learning goals.
                </li>
                <li>
                  <strong>Technical Data:</strong> IP addresses and browser
                  types collected automatically.
                </li>
              </ul>
            </div>
          </section>

          <section id="usage">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              3. How We Use Your Information
            </h2>
            <p className="mb-4 text-gray-300">
              We use your data strictly for the following purposes:
            </p>
            <ul className="gap-4 grid grid-cols-1 md:grid-cols-1">
              <li className="bg-dark-900 p-4 border border-gray-700 rounded-lg">
                <span className="block mb-1 font-bold text-blue-400">
                  Service Delivery
                </span>
                To connect students with the right tutors and manage session
                scheduling.
              </li>
              <li className="bg-dark-900 p-4 border border-gray-700 rounded-lg">
                <span className="block mb-1 font-bold text-blue-400">
                  Product Improvement
                </span>
                To analyze platform usage trends and develop new educational
                tools.
              </li>
            </ul>
          </section>

          <section id="sharing">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              4. Sharing of Information
            </h2>
            <p className="text-gray-300 leading-relaxed">
              StudyBridge does not trade or sell your personal information. We
              only share data with authorized service providers (e.g., hosting),
              legal authorities when required by law, or with tutors to
              facilitate your scheduled sessions.
            </p>
          </section>

          <section id="cookies">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              5. Cookies & Tracking
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We use cookies to enhance your experience, remember your login
              details, and analyze site traffic. You can manage cookie
              preferences through your browser settings.
            </p>
          </section>

          <section id="retention">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              6. Data Retention
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We retain your personal information only for as long as is
              necessary. If you close your account, we will delete your data
              within 30 days, unless legal obligations require otherwise.
            </p>
          </section>
          <section id="security" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-500 border-l-4 font-bold text-2xl">
              7. Data Security
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We use secure servers and encryption to protect your data. Only
              authorized staff can access your information to help with your
              account or sessions. While we work hard to keep everything safe,
              please remember that no internet service is 100% secure.
            </p>
          </section>
          <section id="rights" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-500 border-l-4 font-bold text-2xl">
              8. Your Privacy Rights
            </h2>
            <p className="text-gray-300 leading-relaxed">
              You have the right to see the data we have about you, ask us to
              fix any mistakes, or request that we delete your information
              entirely. You can manage most of these options directly through
              your account settings.
            </p>
          </section>

          <section id="contact" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              9. Contact Us
            </h2>
            <p className="text-gray-300 leading-relaxed">
              For any privacy-related requests or questions, please reach out to
              our team:
              <span className="ml-1 text-blue-400">
                support@studybridge.com
              </span>
            </p>
          </section>
        </div>

        <div className="mt-20 pt-8 border-gray-800 border-t">
          <Button as={NavLink} to="/" variant="secondary">
            ← Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};
