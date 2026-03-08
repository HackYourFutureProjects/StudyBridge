import { NavLink } from "react-router-dom";
import React from "react";
import { Button } from "../../components/ui/button/Button";

interface TermSection {
  id: string;
  title: string;
}

export const TermsAndConditionsPage: React.FC = () => {
  const sections: TermSection[] = [
    { id: "acceptance", title: "1. Acceptance of Terms" },
    { id: "description", title: "2. Description of Service" },
    { id: "responsibilities", title: "3. User Responsibilities" },
    { id: "payment", title: "4. Payment and Refund Terms" },
    { id: "liability", title: "5. Limitation of Liability" },
    { id: "modifications", title: "6. Changes to Terms" },
    { id: "contact", title: "7. Contact Information" },
  ];

  return (
    <div className="bg-transparent px-4 pt-32 pb-20 min-h-screen text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-4 font-bold text-white text-4xl">
          Terms & Conditions
        </h1>
        <p className="mb-4 text-gray-400">
          Please read these rules carefully before using StudyBridge.
        </p>

        <nav className="bg-dark-900 mb-16 p-6 border border-blue-400 rounded-xl">
          <h2 className="mb-4 font-semibold text-blue-400 text-lg">
            Quick Navigation
          </h2>
          <ul className="gap-3 grid md:grid-rows-4 grid-flow-row md:grid-flow-col">
            {sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-16">
          <section id="acceptance" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              By using <strong className="text-white">StudyBridge</strong>, you
              agree to these terms. If you do not agree, you should not use the
              platform.
            </p>
          </section>

          <section id="description" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              2. Description of Service
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We provide a platform to connect students and teachers. We help
              with booking and payments, but we are not responsible for the
              actual teaching content provided by the teachers.
            </p>
          </section>
          <section id="responsibilities" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              3. User Responsibilities
            </h2>
            <ul className="space-y-3 ml-6 text-gray-300 list-disc">
              <li>You must provide real information when signing up.</li>
              <li>You are responsible for keeping your password safe.</li>
              <li>
                You must be <strong className="text-white">18 or older</strong>,
                or have a parent&apos;s permission.
              </li>
              <li>You must follow all local laws while using the site.</li>
            </ul>
          </section>

          <section id="payment" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              4. Payment and Refund Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Payments are handled securely. Teachers set their own prices. If
              you need a refund, it must follow our specific refund rules found
              in our Help Center.
            </p>
          </section>

          <section id="liability" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              5. Limitation of Liability
            </h2>
            <p className="text-gray-300 leading-relaxed">
              StudyBridge is not responsible for any issues, tech failures, or
              disagreements between users. Use the service at your own risk.
            </p>
          </section>

          <section id="modifications" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              6. Changes to Terms
            </h2>
            <p className="text-gray-300 leading-relaxed">
              We might update these rules from time to time. If we do, we will
              post the new version here. Continuing to use the site means you
              agree to the new rules.
            </p>
          </section>

          <section id="contact" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-bold text-2xl">
              7. Contact Information
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If you have any questions, please email us at:
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
