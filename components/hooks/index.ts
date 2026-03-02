// React Query Hooks - Unified Exports
// Import hooks from this file: import { useCategories, useSourceList } from "@/components/hooks";

// Category Hooks
export {
  categoryKeys,
  getCategories,
  addCategory,
  renameCategory,
  deleteCategory,
  useCategories,
  useCategory,
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
  useDataList,
  useDataDetail,
  useDataBySource,
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
  updateSourceStatus,
  updateLastCollected,
  useSourceList,
  useSourceDetail,
  useCreateSource,
  useUpdateSource,
  useDeleteSource,
  useUpdateSourceStatus,
  useUpdateLastCollected,
  type SourceFilters,
} from "./sources";
