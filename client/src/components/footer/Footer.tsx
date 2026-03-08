import { Link } from "react-router-dom";
import { publicRoutesVariables } from "../../router/routesVariables/pathVariables";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={
        className || "relative bg-[#1a161f] backdrop-blur-md w-full py-8 pl-6"
      }
    >
      <div className="flex lg:flex-row flex-col justify-between items-start lg:items-center gap-8 lg:gap-0 mx-auto px-4 max-w-7xl text-white">
        <div className="w-full lg:w-auto max-w-sm">
          <h3 className="mb-4 font-bold text-2xl">StudyBridge</h3>
          <p className="opacity-65 text-sm leading-6">
            Our platform offers an easy-to-use learning experience with video
            lessons, live video calls, and fast, secure payments — all in one
            place.
          </p>
        </div>

        <div className="w-full lg:w-36">
          <h4 className="opacity-65 mb-4 text-sm">Legal</h4>
          <div className="space-y-2 text-base">
            <Link
              to={publicRoutesVariables.privacyPolicy}
              className="block hover:text-gray-300 hover:underline transition-colors cursor-pointer"
            >
              Privacy Policy
            </Link>
            <Link
              to={publicRoutesVariables.termsAndConditions}
              className="block hover:text-gray-300 hover:underline transition-colors cursor-pointer"
            >
              Terms & Conditions
            </Link>
            <Link
              to={publicRoutesVariables.returnPolicy}
              className="block hover:text-gray-300 hover:underline transition-colors cursor-pointer"
            >
              Return Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
