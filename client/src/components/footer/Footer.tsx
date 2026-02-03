export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={
        className ||
        "fixed bottom-0 left-0 w-full bg-[#1a161f] backdrop-blur-md py-8 pl-6"
      }
    >
      <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row justify-between items-start lg:items-center text-white gap-8 lg:gap-0">
        <div className="max-w-sm w-full lg:w-auto">
          <h3 className="font-bold text-2xl mb-4">StudyBridge</h3>
          <p className="text-sm opacity-65 leading-6">
            Our platform offers an easy-to-use learning experience with video
            lessons, live video calls, and fast, secure payments — all in one
            place.
          </p>
        </div>

        <div className="w-full lg:w-36">
          <h4 className="text-sm opacity-65 mb-4">Legal</h4>
          <div className="text-base space-y-2">
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
            <p>Return Policy</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
