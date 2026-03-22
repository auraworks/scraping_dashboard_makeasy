// React Query Hooks - Unified Exports
// Import hooks from this file: import { useCategories, useSourceList } from "@/components/hooks";

// Category Hooks
export {
  categoryKeys,
  getCategories,
  insertCategory,
  updateCategory,
  deleteCategory,
  useCategories,
  useAddCategory,
  useRenameCategory,
  useDeleteCategory,
} from "./categories";

// Data Hooks
export {
  dataKeys,
  getData,
  getDataById,
  createData,
  updateData,
  deleteData,
  getDataBySource,
  getCountries,
  getSourcesForFilter,
  useDataList,
  useDataDetail,
  useDataBySource,
  useCountries,
  useSourcesForFilter,
  useCreateData,
  useUpdateData,
  useDeleteData,
  type DataFilters,
} from "./datas";

// Profile Hooks
export {
  profileKeys,
  getCurrentProfile,
  getProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
  useCurrentProfile,
  useProfiles,
  useProfileDetail,
  useUpdateProfile,
  useDeleteProfile,
  type ProfileFilters,
} from "./profiles";

// Source Hooks
export {
  sourceKeys,
  getSources,
  getSourceById,
  createSource,
  updateSource,
  deleteSource,
  useSourceList,
  useSourceDetail,
  useCreateSource,
  useUpdateSource,
  useDeleteSource,
  type SourceFilters,
} from "./sources";

// Log Hooks
export { logKeys, getLogs, useLogList, useLogDetail, type LogFilters } from "./logs";

// Dashboard Hooks
export {
  dashboardKeys,
  getDashboardStats,
  getHourlyTraffic,
  getSourceDistribution,
  getLastCollectionDate,
  getDailyTrend,
  useDashboardStats,
  useHourlyTraffic,
  useSourceDistribution,
  useLastCollectionDate,
  useDailyTrend,
  type DashboardStats,
  type HourlyTraffic,
  type SourceDistribution,
  type DailyTrend,
} from "./dashboard";
