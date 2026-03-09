import { NavLink } from "react-router-dom";
import React from "react";
import { Button } from "../../components/ui/button/Button";

interface PolicySection {
  id: string;
  title: string;
}

export const ReturnPolicyPage: React.FC = () => {
  const sections: PolicySection[] = [
    { id: "overview", title: "1. Overview" },
    { id: "student-cancel", title: "2. Cancellation by Student" },
    { id: "teacher-cancel", title: "3. Cancellation by Teacher" },
    { id: "technical", title: "4. Technical Issues" },
    { id: "process", title: "5. Refund Process" },
    { id: "request", title: "6. How to Request" },
    { id: "dispute", title: "7. Dispute Resolution" },
  ];

  return (
    <div className="bg-transparent px-4 pt-32 pb-20 min-h-screen text-white">
      <div className="mx-auto max-w-4xl">
        <h1 className="pt-10 pb-4 font-bold text-white text-5xl tracking-tight">
          Return Policy
        </h1>

        <nav className="bg-dark-900 mb-12 p-8 border border-blue-400 rounded-xl">
          <h2 className="mb-6 font-semibold text-white text-xl">
            Table of Contents
          </h2>
          <ul className="gap-3 grid md:grid-rows-4 grid-flow-row md:grid-flow-col">
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
          <section id="overview" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              1. Overview
            </h2>
            <p className="text-gray-300 leading-relaxed">
              This Return Policy outlines the terms and conditions for refunds
              and cancellations for lessons booked through the{" "}
              <strong>StudyBridge</strong> platform. Our goal is to ensure a
              fair experience for both students and teachers.
            </p>
          </section>

          <section id="student-cancel" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              2. Cancellation by Student
            </h2>
            <div className="space-y-4 text-gray-300">
              <ul className="space-y-3 ml-6 list-disc">
                <li>
                  <strong>More than 24 hours before the session:</strong> Full
                  refund will be issued to your original payment method.
                </li>
                <li>
                  <strong>Less than 24 hours notice:</strong> Partial or no
                  refund may apply depending on the teacher&apos;s specific
                  policy.
                </li>
                <li>
                  <strong>No-show or cancellation during the session:</strong>{" "}
                  No refund will be provided.
                </li>
              </ul>
            </div>
          </section>

          <section id="teacher-cancel" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              3. Cancellation by Teacher
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If a teacher cancels a session, students will receive a{" "}
              <strong>full refund</strong>
              automatically. Teachers are encouraged to provide advance notice
              to minimize inconvenience to students.
            </p>
          </section>

          <section id="technical" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              4. Technical Issues
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If a session cannot be completed due to technical issues on our
              platform, a full refund or rescheduling option will be provided.
              Please contact{" "}
              <span className="font-medium text-blue-400">
                support@studybridge.com
              </span>{" "}
              within 24 hours of the scheduled session.
            </p>
          </section>

          <section id="process" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              5. Refund Process
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Refunds are processed within <strong>5-7 business days</strong>{" "}
              after the cancellation request is approved. The refund will be
              issued to the original payment method used for the booking.
            </p>
          </section>

          <section id="request" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              6. How to Request a Refund
            </h2>
            <p className="text-gray-300 leading-relaxed">
              To request a refund, please contact our support team at
              <span className="ml-1 text-blue-400">
                support@studybridge.com
              </span>
              . Please include your session ID and the reason for the request.
            </p>
          </section>

          <section id="dispute" className="scroll-mt-32">
            <h2 className="mb-4 pl-4 border-blue-400 border-l-4 font-semibold text-2xl">
              7. Dispute Resolution
            </h2>
            <p className="text-gray-300 leading-relaxed">
              If you are not satisfied with the resolution, you can file a
              dispute through our platform. Our support team will review your
              case and provide a final decision within 7 business days.
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
