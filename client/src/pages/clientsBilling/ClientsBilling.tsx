import LessonsTable from "../../components/table/LessonsTable";
import { useState } from "react";
import {
  Sidebar,
  defaultStudentMenuItems,
} from "../../components/sidebar/Sidebar";
import { TopBar } from "../../components/header-private/TopBar";
import { Pagination } from "../../components/ui/pagination/Pagination";
import { BillingHeader } from "../../components/clientsBillings/BillingHeader";

export const ClientsBilling = () => {
  const [page, setPage] = useState(1);
  return (
    <div className="min-h-screen pl-[218px]">
      <Sidebar items={defaultStudentMenuItems} />

      <div className="px-6 lg:px-10 min-h-screen flex flex-col">
        <TopBar />

        <div className="pt-[40px] mb-4 flex flex-col flex-1">
          <BillingHeader />
        </div>
        <div>
          <span className="w-[90px] h-[19px] text-center font-inter font-medium text-[16px] leading-[100%] tracking-normal text-white opacity-100 pl-[15px]">
            Invoices
          </span>
          <div className="mt-3 h-[2px] w-[90px] bg-[#7B3FF2]" />
        </div>
        <br />
        <LessonsTable
          width={1065}
          headerHeight={66}
          rowHeight={66}
          columns={[
            { key: "index", label: "Index#", width: "120px" },
            { key: "invoiceNumber", label: "Invoice Number", width: "180px" },
            { key: "teacher", label: "Teacher", width: "220px" },
            { key: "invoiceDate", label: "Invoice Date", width: "140px" },
            { key: "invoiceAmount", label: "Invoice Amount", width: "140px" },
          ]}
          rows={[
            {
              id: 1,
              checked: true,
              index: "0012023",
              invoiceNumber: "INV-0201-2023",
              teacher: "Anna Kravchuk",
              invoiceDate: "5/27/15",
              invoiceAmount: "200.00",
            },
            {
              id: 2,
              checked: true,
              index: "0022023",
              invoiceNumber: "INV-0002-2023",
              teacher: "Labour Matters",
              invoiceDate: "5/19/12",
              invoiceAmount: "1200.00",
            },
            {
              id: 3,
              checked: false,
              index: "0032023",
              invoiceNumber: "INV-0021-2023",
              teacher: "Family Law Matters",
              invoiceDate: "3/4/16",
              invoiceAmount: "16.00",
            },
            {
              id: 4,
              checked: false,
              index: "0042023",
              invoiceNumber: "INV-0231-2023",
              teacher: "Direct Taxes Matter",
              invoiceDate: "3/4/16",
              invoiceAmount: "321.00",
            },
            {
              id: 5,
              checked: false,
              index: "0052023",
              invoiceNumber: "INV-0001-2023",
              teacher: "Criminal Matters",
              invoiceDate: "7/27/13",
              invoiceAmount: "100.00",
            },
            {
              id: 6,
              checked: true,
              index: "0062023",
              invoiceNumber: "INV-0241-2023",
              teacher: "Election Matters",
              invoiceDate: "5/27/15",
              invoiceAmount: "500.00",
            },
            {
              id: 7,
              checked: false,
              index: "0072023",
              invoiceNumber: "INV-0012-2023",
              teacher: "Indirect Taxes Matters",
              invoiceDate: "7/11/19",
              invoiceAmount: "71.00",
            },
            {
              id: 8,
              checked: false,
              index: "0082023",
              invoiceNumber: "INV-0018-2023",
              teacher: "Service Matters",
              invoiceDate: "9/23/16",
              invoiceAmount: "1000.00",
            },
          ]}
        />
        <div className="mt-auto pt-4 mb-6 flex justify-center">
          <Pagination
            activeIndex={page}
            onIndexChange={setPage}
            totalPages={6}
            theme="secondary"
            shape="square"
          />
        </div>
      </div>
    </div>
    // </div>
  );
};
