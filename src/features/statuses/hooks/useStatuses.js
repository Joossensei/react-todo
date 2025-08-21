import { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { statusStore } from "../stores/StatusStore";

export const useStatuses = () => {
  useEffect(() => {
    if (statusStore.statuses.length === 0 && !statusStore.loading) {
      statusStore.fetchStatuses();
    }
  }, []);

  return {
    statuses: statusStore.statuses,
    loading: statusStore.loading,
    error: statusStore.error,
    total: statusStore.total,
    page: statusStore.page,
    size: statusStore.size,
    fetchStatuses: statusStore.fetchStatuses.bind(statusStore),
    createStatus: statusStore.createStatus.bind(statusStore),
    sendUpdateStatus: statusStore.sendUpdateStatus.bind(statusStore),
    deleteStatus: statusStore.deleteStatus.bind(statusStore),
    reorderStatuses: statusStore.reorderStatuses.bind(statusStore),
    getStatusByKey: statusStore.getStatusByKey.bind(statusStore),
    getDefaultStatus: statusStore.getDefaultStatus.bind(statusStore),
  };
};

export default observer(useStatuses);
