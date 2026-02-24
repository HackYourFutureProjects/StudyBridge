import { PageTitle } from "../../components/pageTitle/PageTitle";

export const VideoCallPage = () => {
  return (
    <div className="min-h-screen bg-[#15141D]">
      <div className="px-6 lg:px-10 pt-10 pb-8">
        <PageTitle title="Video Call" />

        <div className="mt-6 rounded-[16px] border border-[#2A2433] bg-[#1B1823] p-4 lg:p-6">
          <div className="h-[65vh] min-h-[420px] rounded-[12px] bg-[#0F0E13]">
            {/* Stream UI will be mounted here later */}
            {/* <StreamCall> ... </StreamCall> */}
          </div>
        </div>
      </div>
    </div>
  );
};
