import SearchIcon from "../icons/Search";
import { Button } from "../ui/button/Button";
import AddIcon from "../icons/AddIcon";

export const BillingHeader = () => {
  return (
    <div className="w-full h-[100px]">
      <div className="flex items-center justify-between">
        <div className="w-[147px] h-[76px] font-bold text-[48px] leading-[76px] bg-gradient-to-r from-[#7186FF] to-[#FE7587] bg-clip-text text-transparent">
          Billing
        </div>

        <div className="flex items-center gap-[16px] mr-[80px]">
          <div className="flex h-[48px] w-[280px] items-center gap-[12px] rounded-[10px] border-[1.4px] border-[#E4E4E4] bg-white px-[18px]">
            <SearchIcon className="h-4 w-4 text-[#959595]" />
            <input
              type="text"
              placeholder="Search Billing"
              className="
                w-[278px] h-[19px]
                text-[#0F0E13] bg-transparent caret-[#0F0E13]
                placeholder:font-inter
                placeholder:font-normal
                placeholder:text-[16px]
                placeholder:leading-[100%]
                placeholder:tracking-normal
                placeholder:text-[#959595]
                outline-none border-none p-0
              "
            />
          </div>

          <Button
            as="button"
            variant="primary"
            className="h-[48px] min-h-0 px-[18px] py-0 text-[12px] uppercase tracking-[0.8px]"
          >
            Add
            <AddIcon className="ml-2 h-[16px] w-[16px]" />
          </Button>
        </div>
      </div>

      <div className="mt-4 border-b border-[#E4E4E4]" />
    </div>
  );
};
