import React, { createContext, SetStateAction, useState } from "react";
import { ReportContextType } from "../utils/types/provider.type";
import { logger } from "../utils/logger";
import instance from "../utils/fetch";
import { useSWRConfig } from "swr";

export type MakeReportType = {
  user_id: string;
  message: string;
  report: string;
  from: string;
};

export const ReportContext = createContext<ReportContextType>({} as ReportContextType);

export default function ReportContextProvider({ children }: { children: React.ReactNode }) {
  const { mutate } = useSWRConfig();
  const [deleted, setDeleted] = useState({
    status: false,
    report_id: "",
  });

  const makeReport = async (
    { user_id, message, report, from }: MakeReportType,
    setDataReport: React.Dispatch<SetStateAction<any | null>>,
  ) => {
    try {
      const res = await instance.post(`/api/report`, { user_id, message, report, from });

      if (res.data.status) {
        setDataReport(null);
      }
    } catch (error) {
      logger.error("Failed make report");
    }
  };

  const deleteOneReport = async (report_id: string) => {
    try {
      setDeleted({
        report_id,
        status: true,
      });
      const res = await instance.delete(`/api/report/${report_id}`);

      if (res.data.status) {
        mutate("/api/report");
        setDeleted({
          report_id: "",
          status: false,
        });
      }
    } catch (error) {
      logger.error("Failed deleted report");
      setDeleted({
        report_id: "",
        status: false,
      });
    }
  };

  return (
    <ReportContext.Provider value={{ makeReport, deleteOneReport, deleted }}>
      {children}
    </ReportContext.Provider>
  );
}
