import axios from "axios";
// export const baseURL = "http://13.232.180.187:8080/api/admin";
export const baseURL = "http://192.168.29.32:4000/api/admin";
// export const baseURL = "http://122.176.76.91:4000/api/admin";

// export const baseURL = process.env.REACT_APP_BASE_URL;

export const branchRoleType = [
  { id: 1, value: "OrderManager", label: "Order Manager" },
  { id: 2, value: "BranchManager", label: "Branch Manager" },
  { id: 3, value: "Cashier", label: "Cashier" },
];


export const DiscountTypeList = [
  { key: 1, values: "PERCENTAGE" },
  { key: 2, values: "FLAT" },
];

export const RoleTypes = [
  { key: 1, values: "OrderManager", label: "Order Manger" },
  {
    key: 2,
    values: "CatalogueAndContentManager",
    label: "Catlogue & Content Manager",
  },
];

export const Discount = {
  DISCOUNT: "discount",
  CASHBACK: "cashback",
  FREE_DELIVERY: "freeDelivery",
};

export const EligibleCustomer = {
  ALL_USERS: "allUsers",
  FIRST_TIME_USERS: "firstTimeUsers",
  SELECTED_USERS: "selectedUsers",
};

export const Status = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const DiscountType = [
  { key: 1, values: "discount", label: "Discount" },
  { key: 2, values: "cashback", label: "Cashback" },
  { key: 2, values: "freeDelivery", label: "Free Delivery" },
];

export const EligibleCustomerType = [
  { key: 1, values: "allUsers", label: "All Users" },
  { key: 2, values: "firstTimeUsers", label: "First Time Users" },
  { key: 3, values: "selectedUsers", label: "Selected Users" },
];

export const cmsTyps = [
  { key: 1, values: "USER" },
  { key: 2, values: "VENDOR" },
];

export const TimeUnit = [
  { key: 1, values: "MINUTES" },
  { key: 2, values: "HOURS" },
];

export const filterOption = [
  { key: 1, values: "DATE", label: "Date" },
  { key: 2, values: "MONTH", label: "Month" },
  { key: 3, values: "YEAR", label: "Year" },
];

export const paymentModes = [
  {
    key: 1,
    values: "COD",
  },
  {
    key: 2,
    values: "ONLINE",
  },
];

export const SlotDeliveryTypes = [
  {
    key: 1,
    values: "PICKUP",
  },
  {
    key: 2,
    values: "DELIVERY",
  },
  {
    key: 3,
    values: "RETURN",
  },
  {
    key: 4,
    values: "REPLACEMENT",
  },
];

export const deliveryTypes = [
  {
    key: 1,
    values: "PICKUP",
  },
  {
    key: 2,
    values: "DELIVERY",
  },
  // {
  //   key: 3,
  //   values: "RETURN",
  // },
  // {
  //   key: 4,
  //   values: "REPLACEMENT",
  // },
];

export const orderStatuss = [
  {
    key: 1,
    values: "PENDING",
  },
  {
    key: 2,
    values: "ASSIGNED",
  },
  {
    key: 3,
    values: "ACCEPTED",
  },
  {
    key: 4,
    values: "ORDERPACKED",
  },
  {
    key: 5,
    values: "DISPATCHED",
  },
];

export const OrderHistoryStatus = [
  {
    key: 1,
    values: "DELIVERED",
  },
  {
    key: 2,
    values: "CANCELLED",
  },
];

const limit = 25;
const rootUrl = (path) => `${baseURL}${path}`;

export const Services = {
  loginUrl: rootUrl('/login'),
  branchListUrl: rootUrl('/branch'),
  AddBranchUrl: rootUrl('/branch'),
  deleteVenderUrl: rootUrl('/delete-vendor'),
  AddVendorUrl: rootUrl('/add-vendor'),
  fetchTermCondition: rootUrl('/term-condition'),
  updateTermUrl: rootUrl('/term-condition'),
  fetchPolicyUrl: rootUrl('/privacy-policy'),
  updatepolicyUrl: rootUrl('/privacy-policy'),
  fetchaboutUrl: rootUrl('/about-us'),
  updateAboutUrl: rootUrl('/about-us'),
  vendorApprovalUrl: rootUrl('/documents-action'),
  vendorRejectedUrl: rootUrl('/documents-action'),
  addBannerUrl: rootUrl('/banner'),
  deleteBannerUrl: rootUrl('/banner'),
  fetchBannerUrl: rootUrl('/banner-list'),
  addBranchManager: rootUrl('/branch-keeper/registeration'),
  adminOrderAcceptUrl: rootUrl('/order-assigned'),
  branchActiveDeactiveUrl: rootUrl('/active-inactive-branch'),
  updateBranchUrl: rootUrl('/update-branch'),
  addBranchSloteUrl: rootUrl('/branch-slot'),
  reassignbranchUrl: rootUrl('/vendor-assign-branch'),
  updatebannerUrl: rootUrl('/banner'),
  AddNewSegmentUrl: rootUrl('/static-custom-segment'),
  AddSegmentProductUrl: rootUrl('/custom-segment-product'),
  StatusSegmentProductUrl: rootUrl('/update-static-custom-segment-product'),
  StatusSegmentUrl: rootUrl('/update-static-custom-segment'),
  fetchCouponUrl: rootUrl('/coupon'),
  fetchDetailCouponUrl: rootUrl('/coupon'),
  insertNewCouponUrl: rootUrl('/coupon'),
  EditCouponUrl: rootUrl('/coupon'),
  updateStatusCouponUrl: rootUrl('/coupon'),
  deleteCouponUrl: rootUrl('/coupon'),
  insertNewDiscountUrl: rootUrl('/discount'),
  fetchDiscountUrl: rootUrl('/discount'),
  deleteDiscountUrl: rootUrl('/discount'),
  // Referral Reward URLs
  createReferralRewardUrl: rootUrl('/referral-reward'),
  fetchReferralRewardUrl: rootUrl('/referral-reward'),
  toggleReferralRewardStatusUrl: rootUrl('/referral-reward/toggle-active'),
  deleteReferralRewardUrl: rootUrl('/referral-reward'),
  fetchGeneralSettingUrl: rootUrl('/general-setting'),
  AddGeneralSettingUrl: rootUrl('/general-setting'),
  EditGeneralSettingUrl: rootUrl('/general-setting'),
  segmentProductDeleteUrl: rootUrl('/custom-segment-product'),
  slotActionActivationUrl: rootUrl('/slot-update'),
  addNewRacipeUrl: rootUrl('/add-recipe'),
  orderCacelUrl: rootUrl('/order-cancel'),
  deleteStoreExcelUrl: rootUrl('/delete-excel'),
  orderStatusCountUrl: rootUrl('/order-all-status-count'),
  deleteVendorRatingUrl: rootUrl('/vendor/order/particular-rating'),
  returnReplaceActionUrl: rootUrl('/return-replacement-action'),
  deletecustomSegmentUrl: rootUrl('/custom-segment'),
  uploadProductXlsUrl: rootUrl('/static-custom-segement/upload-product-excel'),
  createRestrictedProductUrl: rootUrl('/restricted-product'),
  deleteRestrictedProductUrl: rootUrl('/restricted-product'),
  fetchRestrictedLoginUrl: rootUrl('/allowed-user'),
  insertNewRestrictedLoginUrl: rootUrl('/allowed-user'),
  EditRestrictedLoginUrl: rootUrl('/allowed-user'),
  deleteRestrictedLoginUrl: rootUrl('/allowed-user'),
  addOfferBannerUrl: rootUrl('/banner'),
  deleteOfferBannerUrl: rootUrl('/banner'),
  updateOfferbannerUrl: rootUrl('/banner'),

  AddPoolProductUrl: rootUrl('/insert-pool-order'),
  poolProductActionUrl: rootUrl('/update-pool-product'),
  editStaticSegmentUrl: rootUrl('/edit-particular-static-custom-segment'),
  trendingBrandUrl: rootUrl('/top-trending-brand-list'),
  AddTrenadBrandUrl: rootUrl('/top-trending-brand-list'),
  deleteTrendingBrandUrl: rootUrl('/particular-trending-brand'),
  productStockLimitUrl: rootUrl('/product-stock-limit-list'),
  addProductStockLimitUrl: rootUrl('/product-stock-limit'),
  deleteProductStockLimitUrl: rootUrl('/product-stock-limit'),
  productDeliveryChargeUrl: rootUrl('/insert-product-delivery-charge'),
  deleteproductDeliveryChargeUrl: rootUrl('/delivery-charge-product'),
  refundPaynowUrl: rootUrl('/refund-action'),
  addAboutUrl: rootUrl('/about-us'),
  addTermConditionUrl: rootUrl('/term-condition'),
  addPrivacyPolicyUrl: rootUrl('/privacy-policy'),
  addHelpSupportUrl: rootUrl('/help-support'),
  editHelpSupportUrl: rootUrl('/help-support'),
  addFaqListUrl: rootUrl('/faq'),
  deleteFaqListUrl: rootUrl('/faq'),
  editFaqListUrl: rootUrl('/faq'),
  removeSlotUrl: rootUrl('/branch-slot'),
  updateMaxSlotUrl: rootUrl('/update-slot-max-delivery'),
  racipeUpdateUrl: rootUrl('/update-recipe'),
  removeRacipeUrl: rootUrl('/recipe-images'),
  addMoreRecipeIngredientUrl: rootUrl('/recipe-ingredients'),
  exportBrandUrl: rootUrl('/export-brand-list'),
  fetchAdminProfileUrl: rootUrl('/admin-profile'),
  editDevliveryPartnerUrl: rootUrl('/udpdate-vendor-vehicleNo'),
  roleAccessUrl: rootUrl('/role-access'),
  AddAdminUserUrl: rootUrl('/reg-admin-user'),
  getAdminUserUrl: rootUrl('/get-admin-user'),
  getAllRolesUrl: rootUrl('/get-admin-role'),
  addAdminRoleUrl: rootUrl('/create-admin-role'),
  editAdminUserUrl: rootUrl('/update-admin-user'),
  adminUserStatusActionUrl: rootUrl('/deactive-admin-user'),
  syncProdcutUrl: rootUrl('/product-indexing'),
  syncBranchUrl: rootUrl('/branch-indexing'),
  branchRoleUrl: rootUrl('/branch-role-access'),
  orderEditAdminUrl: rootUrl('/order-edit-admin'),
  deleteAdminRoleUrl: rootUrl('/delete-admin-role'),
  deleteAdminUserUrl: rootUrl('/delete-admin-user'),
  branchRoleDeleteUrl: rootUrl('/branch-role-access'),
  deleteBranchManagerUrl: rootUrl('/branch-keeper/delete-branch-user'),
  deleteUserReviewUrl: rootUrl('/user/order/particular-rating'),
  fetchDashboardCountUrl: rootUrl('/dashboard-counter'),
  exportCategoryReportUrl: rootUrl('/export-allCategoryLevel-report'),
  exportOfferOrdertUrl: rootUrl('/export-offer-type-report'),
  exportBrandReportUrl: rootUrl('/export-brand-report'),
  exportSegmentWiseReportUrl: rootUrl('/export-segment-wise-report'),
  fetchSegmentListUrl: rootUrl('/static-custom-segment-ids'),
  exportSearchValueUrl: rootUrl('/export-product-wise-search-report'),
  fetchOfferTypeUrl: rootUrl('/export-offer-list'),
  exportSearchKeywordUrl: rootUrl('/export-keyword-wise-search-report'),

};

//login section
// Update all user referral code
export const updateAllUserReferralCode = async (token) => {
  const res = await axios.put(
    `${baseURL}/update-all-user-referral-code`,
    {},
    {
      headers: { Authorization: token },
    }
  );
  return res;
};
export const LoginAdmin = async (body) => {
  const log = await axios.post(Services.loginUrl, body);
  return log;
};

export const elasticSyncProduct = async (token) => {
  const product = await axios.post(
    Services.syncProdcutUrl,
    {},
    {
      headers: { Authorization: token },
    }
  );
  return product;
};

export const elasticSyncBranch = async (token, body) => {
  const branch = await axios.post(Services.syncBranchUrl, body, {
    headers: { Authorization: token },
  });
  return branch;
};

export const fetchOfferTypeData = async (token) => {
  const offer = await axios.get(Services.fetchOfferTypeUrl, {
    headers: { Authorization: token },
  });
  return offer;
};

export const fetchDashboardCount = async (token) => {
  const count = await axios.get(Services.fetchDashboardCountUrl, {
    headers: { Authorization: token },
  });
  return count;
};

export const DeleteAdminRole = async (body, token) => {
  const del = await axios.delete(Services.deleteAdminRoleUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const BranchRoleDelete = async (body, token) => {
  const del = await axios.delete(Services.branchRoleDeleteUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const BranchBranchManager = async (body, token) => {
  const del = await axios.delete(Services.deleteBranchManagerUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const DeleteRoleAccess = async (body, token) => {
  const del = await axios.delete(Services.roleAccessUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const DeleteAdminUser = async (body, token) => {
  const del = await axios.delete(Services.deleteAdminUserUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const EditBranchOrder = async (token, body) => {
  const branch = await axios.post(Services.orderEditAdminUrl, body, {
    headers: { Authorization: token },
  });
  return branch;
};

export const AddBranchRole = async (token, body) => {
  const branch = await axios.post(Services.branchRoleUrl, body, {
    headers: { Authorization: token },
  });
  return branch;
};

export const UpdateBranchRole = async (token, body) => {
  const branch = await axios.put(Services.branchRoleUrl, body, {
    headers: { Authorization: token },
  });
  return branch;
};

export const fetchBranchRole = async (token) => {
  const branchRole = await axios.get(Services.branchRoleUrl, {
    headers: { Authorization: token },
  });
  return branchRole;
};

export const fetchCustomeSegment = async (token) => {
  const segment = await axios.get(Services.fetchSegmentListUrl, {
    headers: { Authorization: token },
  });
  return segment;
};


export const AddNewAdminUser = async (body, token) => {
  const user = await axios.post(Services.AddAdminUserUrl, body, {
    headers: { Authorization: token },
  });
  return user;
};

export const AddRoleAccessKey = async (body, token) => {
  const roleAccess = await axios.post(Services.roleAccessUrl, body, {
    headers: { Authorization: token },

  });
  return roleAccess;
};

export const InsertNewRole = async (body, token) => {
  const role = await axios.post(Services.addAdminRoleUrl, body, {
    headers: { Authorization: token },
  });
  return role;
};

export const AdminUserStatusAction = async (body, token) => {
  const adminStatus = await axios.put(Services.adminUserStatusActionUrl, body, {
    headers: { Authorization: token },
  });
  return adminStatus;
};

export const EditRoleAccessKey = async (body, token) => {
  const roleAccess = await axios.put(Services.roleAccessUrl, body, {
    headers: { Authorization: token },
  });
  return roleAccess;
};

export const UpdateAdminUser = async (body, token) => {
  const editUser = await axios.put(Services.editAdminUserUrl, body, {
    headers: { Authorization: token },
  });
  return editUser;
};

export const fetchAllRoles = async (token) => {
  const roleAccess = await axios.get(Services.getAllRolesUrl, {
    headers: { Authorization: token },
  });
  return roleAccess;
};

export const AdminRoleAccessKey = async (token) => {
  const roleAccess = await axios.get(Services.roleAccessUrl, {
    headers: { Authorization: token },
  });
  return roleAccess;
};

export const fetchAdminUser = async (token) => {
  const adminUser = await axios.get(Services.getAdminUserUrl, {
    headers: { Authorization: token },
  });
  return adminUser;
};

export const FetchAllBrandList = async (token, current, searchInput) => {
  const brand = await axios.get(
    `${baseURL}/brand-list?currentPage=${current}&itemsPerPage=${limit}&brandName=${searchInput != null ? searchInput : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return brand;
};

export const ExportDailyReport = async (token, startData, endData) => {
  const dailyReport = await axios.get(
    `${baseURL}/export-daily-report?startDate=${startData}&endDate=${endData}`,
    {
      headers: { Authorization: token },
    }
  );
  return dailyReport;
};

export const ExportCustomerReport = async (
  token,
  startData,
  endData,
  userMobileNo
) => {
  const cutomerReport = await axios.get(
    `${baseURL}/export-customer-report?startDate=${startData}&endDate=${endData}&userMobileNo=${userMobileNo || ""}`,
    {
      headers: { Authorization: token },
    }
  );
  return cutomerReport;
};

export const ExportOldCustomerReport = async (
  token,
  startData,
  endData,
) => {
  const cutomerReport = await axios.get(
    `${baseURL}/export-old-customer-report?startDate=${startData}&endDate=${endData}`,
    {
      headers: { Authorization: token },
    }
  );
  return cutomerReport;
};

export const ExportCategoryLeval = async (
  token,
  startDate,
  endDate,
  categoryId,
  branchCode
) => {
  const catLevel = await axios.get(Services.exportCategoryReportUrl, {
    params: {
      startDate,
      endDate,
      categoryId: categoryId || "",
      branchCode: branchCode || "",
    },
    headers: {
      Authorization: token,
    },
  });

  return catLevel;
};


export const ExportSearchValueData = async (
  token,
  startDate,
  endDate,
  categoryId,

) => {
  const searchValue = await axios.get(Services.exportSearchValueUrl, {
    params: {
      startDate,
      endDate,
      categoryID: categoryId || "",
    },
    headers: {
      Authorization: token,
    },
  });

  return searchValue;
};

export const ExportSearchKeywords = async (
  token,
  startDate,
  endDate,
  categoryId,

) => {
  const searchValue = await axios.get(Services.exportSearchKeywordUrl, {
    params: {
      startDate,
      endDate,
      categoryID: categoryId || "",
    },
    headers: {
      Authorization: token,
    },
  });

  return searchValue;
};
export const ExportOfferOrder = async (
  token,
  startDate,
  endDate,
  categoryId,
  brandId,
  offerType
) => {
  const catLevel = await axios.get(Services.exportOfferOrdertUrl, {
    params: {
      startDate,
      endDate,
      categoryId: categoryId || "",
      brandId: brandId || "",
      offerType: offerType || ""
    },
    headers: {
      Authorization: token,
    },
  });

  return catLevel;
};

export const ExportBrandReport = async (
  token,
  startDate,
  endDate,
  brandId,
) => {
  const catLevel = await axios.get(Services.exportBrandReportUrl, {
    params: {
      startDate,
      endDate,
      brandID: brandId || "",
    },
    headers: {
      Authorization: token,
    },
  });

  return catLevel;
};


export const ExportSegmentWiseReport = async (
  token,
  startDate,
  endDate,
  segmentId,
) => {
  const segments = await axios.get(Services.exportSegmentWiseReportUrl, {
    params: {
      startDate,
      endDate,
      staticCustomSegmentId: segmentId || "",
    },
    headers: {
      Authorization: token,
    },
  });

  return segments;
};

export const ExportOrderHistoryReport = async (token, startData, endData) => {
  const orderHistoryReport = await axios.get(
    `${baseURL}/export-order-history?startDate=${startData}&endDate=${endData}`,
    {
      headers: { Authorization: token },
    }
  );
  return orderHistoryReport;
};

export const ExportNewCustomerReport = async (token, startData, endData) => {
  const newCustomerReport = await axios.get(
    `${baseURL}/export-new-customer-report?startDate=${startData}&endDate=${endData}`,
    {
      headers: { Authorization: token },
    }
  );
  return newCustomerReport;
};

export const ExportCustomerDetailsReport = async (
  token,
  startData,
  endData
) => {
  const newCustomerReport = await axios.get(
    `${baseURL}/export-customer-details?startDate=${startData}&endDate=${endData}`,
    {
      headers: { Authorization: token },
    }
  );
  return newCustomerReport;
};

export const FetchAdimProfile = async (token) => {
  const profile = await axios.get(Services.fetchAdminProfileUrl, {
    headers: { Authorization: token },
  });
  return profile;
};

export const FetchAllCategoryList = async (
  token,
  current,
  searchInput,
  brandID
) => {
  console.log("insite api call brandID", brandID);
  const queryParams = new URLSearchParams({
    currentPage: current,
    itemsPerPage: limit,
    categoryName: searchInput || "",
  });

  if (brandID) {
    queryParams.append("brandId", brandID);
  }

  const response = await axios.get(
    `${baseURL}/category-list?${queryParams.toString()}`,
    {
      headers: { Authorization: token },
    }
  );

  return response;
};

export const FetchAllCategorItemList = async (
  token,
  categoryId,
  current,
  searchInput
) => {
  const brand = await axios.get(
    `${baseURL}/category/${categoryId ? categoryId : ""
    }/item-category-list?currentPage=${current}&itemsPerPage=${limit}&searchData=${searchInput != null ? searchInput : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return brand;
};

export const FetchAllCategorItemListDefault = async (
  token,
  categoryId,
  defaultCatId,
  current,
  searchInput
) => {
  const brand = await axios.get(
    `${baseURL}/category/${categoryId ? categoryId : defaultCatId
    }/item-category-list?currentPage=${current}&itemsPerPage=${limit}&searchData=${searchInput != null ? searchInput : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return brand;
};

export const FetchAllSubCategorList = async (
  token,
  itemCategoryId,
  defaultCatItemId
) => {
  const catSub = await axios.get(
    `${baseURL}/category/item-sub-category-list?itemCategoryId=${itemCategoryId != null ? itemCategoryId : defaultCatItemId
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return catSub;
};
export const FetchDropProductList = async (token, current, searchInput) => {
  const catSub = await axios.get(
    `${baseURL}/product-list?currentPage=${current}&itemsPerPage=${limit}&productName=${searchInput != null ? searchInput : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return catSub;
};
export const FetchAllProductList = async (
  token,
  current,
  categoryId,
  itemCategoryId,
  brandId,
  branchId,
  searchInput
) => {
  const catSub = await axios.get(
    `${baseURL}/product-list?currentPage=${current}&itemsPerPage=${limit}&categoryID=${categoryId != null ? categoryId : ""
    }&itemCategoryID=${itemCategoryId != null ? itemCategoryId : ""}&brandID=${brandId != null ? brandId : ""
    }&branchCode=${branchId != null ? branchId : ""}&productName=${searchInput != null ? searchInput : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return catSub;
};

export const FetchAllRestrictedProductList = async (
  token,
  current,
  searchInput
) => {
  const catSub = await axios.get(
    `${baseURL}/restricted-product?currentPage=${current}&itemsPerPage=${10}&productName=${searchInput != null ? searchInput : ""}`,
    {
      headers: { Authorization: token },
    }
  );
  return catSub;
};

export const FetchBrandProductList = async (
  token,
  current,
  categoryId,
  itemCategoryId,
  brandId,
  branchId,
  searchInput
) => {
  const catSub = await axios.get(
    `${baseURL}/product-list?currentPage=${current}&itemsPerPage=${limit}&categoryID=""
    &itemCategoryID=""&brandID=${brandId != null ? brandId : ""}&branchCode=${branchId != null ? branchId : ""
    }&productName=${searchInput != null ? searchInput : ""}`,
    {
      headers: { Authorization: token },
    }
  );
  return catSub;
};
//user section
export const fetchAllUserList = async (
  token,
  current,
  limit,
  searchInput,
  startDate,
  endDate
) => {
  const params = new URLSearchParams();

  if (current) params.append("currentPage", current);
  if (current) params.append("itemsPerPage", limit);
  if (searchInput) params.append("searchData", searchInput);
  if (startDate) params.append("startDate", startDate);
  if (endDate) params.append("endDate", endDate);
  console.log("params", params)

  const user = await axios.get(
    `${baseURL}/user?${params.toString()}`,
    {
      headers: { Authorization: token },
    }
  );
  return user;
};

export const fetchUserDetails = async (token, userId) => {
  const user = await axios.get(`${baseURL}/user/${userId}`, {
    headers: { Authorization: token },
  });
  return user;
};
//vendor section
export const fetchAllVendorList = async (
  token,
  current,
  branhcId,
  isDocUpload,
  isDocApprove,
  searchInput
) => {
  const brand = await axios.get(
    `${baseURL}/vendor?currentPage=${current}&itemsPerPage=${limit}&documentUpload=${isDocUpload != null ? isDocUpload : ""
    }&isDocumentVerified=${isDocApprove != null ? isDocApprove : ""
    }&searchData=${searchInput != null ? searchInput : ""}&branchId=${branhcId != null ? branhcId : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return brand;
};

export const fetchAllVendorDetails = async (token, vendorId) => {
  const brand = await axios.get(`${baseURL}/vendor/${vendorId}`, {
    headers: { Authorization: token },
  });
  return brand;
};

export const UpdateVendor = async (token, body) => {
  const editvendor = await axios.post(Services.editDevliveryPartnerUrl, body, {
    headers: { Authorization: token },
  });
  return editvendor;
};

export const deleteVendor = async (body, token) => {
  const del = await axios.delete(Services.deleteVenderUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const deleteUserReview = async (body, token) => {
  const del = await axios.delete(Services.deleteUserReviewUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const DeleteRacipeImage = async (body, token) => {
  const del = await axios.delete(Services.removeRacipeUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const DeleteRacipeProduct = async (ingredientId, token) => {
  const del = await axios.delete(`${baseURL}/ingredients/${ingredientId}`, {
    headers: { Authorization: token },
  });
  return del;
};

export const InsertNewVendor = async (token, body) => {
  const branch = await axios.post(Services.AddVendorUrl, body, {
    headers: { Authorization: token },
  });
  return branch;
};

//branch  list

export const fetchAllBranchList = async (token) => {
  const branch = await axios.get(Services.branchListUrl, {
    headers: { Authorization: token },
  });
  return branch;
};

export const AddNewBranchManager = async (token, body) => {
  const branch = await axios.post(Services.addBranchManager, body, {
    headers: { Authorization: token },
  });
  return branch;
};

export const InsertNewBranch = async (token, body) => {
  const branch = await axios.post(Services.AddBranchUrl, body, {
    headers: { Authorization: token },
  });
  return branch;
};

//cms section
export const InsertTermCondition = async (token, body) => {
  const term = await axios.post(Services.addTermConditionUrl, body, {
    headers: { Authorization: token },
  });
  return term;
};

export const fetchTermCondition = async (token, types) => {
  const term = await axios.get(`${baseURL}/term-condition?for=${types}`, {
    headers: { Authorization: token },
  });
  return term;
};

export const updateTermCondition = async (token, body) => {
  const term = await axios.put(Services.updateTermUrl, body, {
    headers: { Authorization: token },
  });
  return term;
};

export const InsertPrivecyPolicy = async (token, body) => {
  const privecy = await axios.post(Services.addPrivacyPolicyUrl, body, {
    headers: { Authorization: token },
  });
  return privecy;
};
export const ExpotProductList = async (
  token,
  brandId,
  categoryId,
  categoryItemId,
  branchCode,
  noOfItem
) => {
  const product = await axios.get(
    `${baseURL}/export-bkd-product-list?brandID=${brandId || ""}&categoryID=${categoryId || ""
    }&itemCategoryID=${categoryItemId || ""}&branchCode=${branchCode || ""
    }&itemsPerPage=${noOfItem}`,
    {
      headers: { Authorization: token },
    }
  );
  return product;
};

export const fetchPrivecyoPolicy = async (token, types) => {
  const privecy = await axios.get(`${baseURL}/privacy-policy?for=${types}`, {
    headers: { Authorization: token },
  });
  return privecy;
};

export const updateprivecyPolicy = async (token, body) => {
  const privecy = await axios.put(Services.updatepolicyUrl, body, {
    headers: { Authorization: token },
  });
  return privecy;
};

export const fetchAboutUs = async (token, types) => {
  const about = await axios.get(`${baseURL}/about-us?for=${types}`, {
    headers: { Authorization: token },
  });
  return about;
};

export const UpdateAboutus = async (token, body) => {
  const about = await axios.put(Services.updateAboutUrl, body, {
    headers: { Authorization: token },
  });
  return about;
};

export const VendorApproval = async (token, body) => {
  const approval = await axios.post(Services.vendorApprovalUrl, body, {
    headers: { Authorization: token },
  });
  return approval;
};

export const VendorReject = async (token, body) => {
  const reject = await axios.post(Services.vendorRejectedUrl, body, {
    headers: { Authorization: token },
  });
  return reject;
};

export const InsertBanner = async (token, body) => {
  const banner = await axios.post(Services.addBannerUrl, body, {
    headers: { Authorization: token },
  });
  return banner;
};

export const fetchBannerList = async (token, viewType) => {
  const banner = await axios.get(`${baseURL}/banner-list/${viewType}`, {
    headers: { Authorization: token },
  });
  return banner;
};

export const deleteBanner = async (token, body) => {
  const del = await axios.delete(Services.deleteBannerUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const fetchBranchInfo = async (token, branchId) => {
  const branchInfo = await axios.get(`${baseURL}/branch/${branchId}/info`, {
    headers: { Authorization: token },
  });
  return branchInfo;
};

//order list

export const FetchOrderList = async (
  token,
  current,
  pageSize,
  deliveryType,
  paymentMode,
  status,
  searchInput
) => {
  const brand = await axios.get(
    `${baseURL}/live-order-list?currentPage=${current}&itemsPerPage=${pageSize}&deliveryOption=${deliveryType != null ? deliveryType : ""
    }&paymentMode=${paymentMode != null ? paymentMode : ""}&status=${status != null ? status : ""
    }&searchData=${searchInput}`,
    {
      headers: { Authorization: token },
    }
  );
  return brand;
};

export const FetchOrderHistoryList = async (
  token,
  current,
  pageSize,
  deliveryType,
  paymentMode,
  status,
  searchInput,
  startDate,
  endDate
) => {
  const orderHistory = await axios.get(
    `${baseURL}/order-history?currentPage=${current}&itemsPerPage=${pageSize}&deliveryOption=${deliveryType != null ? deliveryType : ""
    }&paymentMode=${paymentMode != null ? paymentMode : ""}&status=${status != null ? status : ""
    }&searchData=${searchInput}&startDate=${startDate}&endDate=${endDate}`,
    {
      headers: { Authorization: token },
    }
  );
  return orderHistory;
};

export const FetchReturnReplaceHistory = async (
  token,
  current,
  orderType,
  retRepType,
  paymentMode,
  orderStatus,
  searchInput
) => {
  const orderHistory = await axios.get(
    `${baseURL}/ret-rep-history?currentPage=${current}&itemsPerPage=${limit}&originPaymentMode=${paymentMode ? paymentMode : ""
    }&status=${orderStatus ? orderStatus : ""
    }&searchData=${searchInput}&type=${orderType}&retRepType=${retRepType ? retRepType : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return orderHistory;
};

export const fetchOrderDatails = async (token, orderId) => {
  const branchInfo = await axios.get(`${baseURL}/order/${orderId}`, {
    headers: { Authorization: token },
  });
  return branchInfo;
};

export const OrderGotoBranch = async (token, body) => {
  const accept = await axios.post(Services.adminOrderAcceptUrl, body, {
    headers: { Authorization: token },
  });
  return accept;
};

export const BranchAction = async (token, body) => {
  const branchActive = await axios.put(Services.branchActiveDeactiveUrl, body, {
    headers: { Authorization: token },
  });
  return branchActive;
};
export const UpdateBranch = async (token, body) => {
  const update = await axios.put(Services.updateBranchUrl, body, {
    headers: { Authorization: token },
  });
  return update;
};
export const updateMaxSlot = async (token, body) => {
  const slot = await axios.put(Services.updateMaxSlotUrl, body, {
    headers: { Authorization: token },
  });
  return slot;
};

export const FetchAllbranchSlote = async (
  token,
  branchId,
  defaultBranchId,
  deliveryOpt
) => {
  const slot = await axios.get(
    `${baseURL}/branch/${branchId != null ? branchId : defaultBranchId
    }/time-slot-list?deliveryOption=${deliveryOpt}`,
    {
      headers: { Authorization: token },
    }
  );
  return slot;
};

export const deletedSlot = async (body, token) => {
  const slot = await axios.delete(Services.removeSlotUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return slot;
};

export const FetchbranchSlote = async (token, branchId, deliveryOpt) => {
  const slot = await axios.get(
    `${baseURL}/branch/${branchId}/time-slot-list?deliveryOption=${deliveryOpt}`,
    {
      headers: { Authorization: token },
    }
  );
  return slot;
};
export const InsertNewBranchSlote = async (token, body) => {
  const slot = await axios.post(Services.addBranchSloteUrl, body, {
    headers: { Authorization: token },
  });
  return slot;
};

export const ReassingVendorBranch = async (token, body) => {
  const reassign = await axios.put(Services.reassignbranchUrl, body, {
    headers: { Authorization: token },
  });
  return reassign;
};

export const updateBanner = async (token, body) => {
  const banner = await axios.put(Services.updatebannerUrl, body, {
    headers: { Authorization: token },
  });
  return banner;
};

export const fetchCustomSegment = async (token) => {
  const segment = await axios.get(`${baseURL}/static-custom-segment`, {
    headers: { Authorization: token },
  });
  return segment;
};

export const AddCustomSegment = async (token, body) => {
  const segment = await axios.post(Services.AddNewSegmentUrl, body, {
    headers: { Authorization: token },
  });
  return segment;
};

export const AddCustomSegmentProduct = async (token, body) => {
  const segmentPro = await axios.post(Services.AddSegmentProductUrl, body, {
    headers: { Authorization: token },
  });
  return segmentPro;
};

export const fetchSegmentProdcut = async (
  token,
  SegmentId,
  barachCode,
  current
) => {
  const segmentPro = await axios.get(
    `${baseURL}/static-custom-segment-product/${SegmentId}?branchCode=${barachCode}&currentPage=${current}&itemsPerPage=${limit}`,
    {
      headers: { Authorization: token },
    }
  );
  return segmentPro;
};

export const activeDeactiveSegmentProduct = async (token, body) => {
  const status = await axios.post(Services.StatusSegmentProductUrl, body, {
    headers: { Authorization: token },
  });
  return status;
};

export const activeDeactiveSegment = async (token, body) => {
  const status = await axios.post(Services.StatusSegmentUrl, body, {
    headers: { Authorization: token },
  });
  return status;
};

export const fetchCoupontList = async (token, current) => {
  const discount = await axios.get(`${Services.fetchCouponUrl}?currentPage=${current}&itemsPerPage=${limit}`, {
    headers: { Authorization: token },
  });
  return discount;
};

export const fetchCouponDetails = async (id, token) => {
  const details = await axios.get(`${Services.fetchDetailCouponUrl}/${id}`, {
    headers: { Authorization: token },
  });
  return details;
};

export const AddNewCouponData = async (body, token) => {
  const dis = await axios.post(Services.insertNewCouponUrl, body, {
    headers: { Authorization: token },
  });
  return dis;
};

export const updateStatusCoupon = async (body, statusId, token) => {
  const setting = await axios.put(`${Services.updateStatusCouponUrl}/${statusId}/status`, body, {
    headers: { Authorization: token },
  });
  return setting;
};


export const EditCoupon = async (body, couponId, token) => {
  const setting = await axios.put(`${Services.EditCouponUrl}/${couponId}`, body, {
    headers: { Authorization: token },
  });
  return setting;
};

export const DeleteCoupon = async (id, token) => {
  const del = await axios.delete(`${Services.deleteCouponUrl}/${id}`, {
    headers: { Authorization: token },
  });
  return del;
};

export const AddNewDiscountData = async (body, token) => {
  const dis = await axios.post(Services.insertNewDiscountUrl, body, {
    headers: { Authorization: token },
  });
  return dis;
};
export const fetchDiscountList = async (token) => {
  const discount = await axios.get(Services.fetchDiscountUrl, {
    headers: { Authorization: token },
  });
  return discount;
};
export const DeleteDisocunt = async (body, token) => {
  const del = await axios.delete(Services.deleteDiscountUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};
export const DeleteSegmentProduct = async (body, token) => {
  const segmentpro = await axios.delete(Services.segmentProductDeleteUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return segmentpro;
};

export const fetchGeneralSetting = async (token) => {
  const setting = await axios.get(Services.fetchGeneralSettingUrl, {
    headers: { Authorization: token },
  });
  return setting;
};
export const AddNewGeneralSetting = async (body, token) => {
  const setting = await axios.post(Services.AddGeneralSettingUrl, body, {
    headers: { Authorization: token },
  });
  return setting;
};

export const EditGeneralSetting = async (body, token) => {
  const setting = await axios.put(Services.EditGeneralSettingUrl, body, {
    headers: { Authorization: token },
  });
  return setting;
};
export const fetchOrderRefund = async (
  token,
  current,
  searchInput,
  branchId
) => {
  const refund = await axios.get(
    `${baseURL}/refund-list?currentPage=${current}&itemsPerPage=${limit}&searchData=${searchInput}&branchId=${branchId ? branchId : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return refund;
};

// export const fetchOrderRefundList = async (
//   token,
//   orderAction,
//   branchId,
//   current
// ) => {
//   const refund = await axios.get(
//     `${baseURL}/online-removed-cancel-product-list?isAction=${orderAction}&branchId=${
//       branchId != null ? branchId : ""
//     }&itemsPerPage=${limit}&currentPage=${current}`,
//     {
//       headers: { Authorization: token },
//     }
//   );
//   return refund;
// };

export const fetchOrderRefundDetails = async (token, orderId) => {
  const refund = await axios.get(
    `${baseURL}/particular-removed-information/${orderId}`,
    {
      headers: { Authorization: token },
    }
  );
  return refund;
};

export const slotActionHandle = async (body, token) => {
  const slot = await axios.put(Services.slotActionActivationUrl, body, {
    headers: { Authorization: token },
  });
  return slot;
};

export const filterProductList = async (token, current, searchInput) => {
  const product = await axios.get(
    `${baseURL}/product-list?currentPage=${current}&itemsPerPage=${limit}&productName=${searchInput != null ? searchInput : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return product;
};

export const deleteRecipe = async (recipeId, token) => {
  const remove = await axios.delete(`${baseURL}/recipe/${recipeId}`, {
    data: recipeId,
    headers: { Authorization: token },
  });
  return remove;
};

export const InsertNewRacipe = async (body, token) => {
  const recipe = await axios.post(Services.addNewRacipeUrl, body, {
    headers: { Authorization: token },
  });
  return recipe;
};

export const InsertMoreRacipeIngradient = async (body, token) => {
  const recipe = await axios.post(Services.addMoreRecipeIngredientUrl, body, {
    headers: { Authorization: token },
  });
  return recipe;
};

export const UpdateRacipe = async (body, token) => {
  const recipe = await axios.post(Services.racipeUpdateUrl, body, {
    headers: { Authorization: token },
  });
  return recipe;
};

export const fetchCustomerAnalytics = async (token, startData, endData) => {
  const customer = await axios.get(
    `${baseURL}/customer-analytics?startDate=${startData}&endDate=${endData}`,
    {
      headers: { Authorization: token },
    }
  );
  return customer;
};

export const fetchSegmentAnalytics = async (token, startData, endData) => {
  const customer = await axios.get(
    `${baseURL}/custom-segment-analytics?startDate=${startData}&endDate=${endData}`,
    {
      headers: { Authorization: token },
    }
  );
  return customer;
};
export const fetchOrderStatusAnalytics = async (
  token,
  startData,
  endData,
  branchId
) => {
  const orderStatus = await axios.get(
    `${baseURL}/order-analytics?startDate=${startData}&endDate=${endData}&branchId=${branchId != null ? branchId : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return orderStatus;
};

export const fetchBrandAnalytics = async (
  token,
  startDate,
  endDate,
  branchId
) => {
  const brand = await axios.get(
    `${baseURL}/brand-order-anlaytics?startDate=${startDate}&endDate=${endDate}&branchId=${branchId != null ? branchId : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return brand;
};

export const fetchCategoryAnalytics = async (
  token,
  startDate,
  endDate,
  branchId
) => {
  const category = await axios.get(
    `${baseURL}/category-order-anlaytics?startDate=${startDate}&endDate=${endDate}&branchId=${branchId != null ? branchId : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return category;
};
export const fetchOfferOrderAnalytics = async (token, startDate, endDate) => {
  const offer = await axios.get(
    `${baseURL}/category-order-anlaytics?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: { Authorization: token },
    }
  );
  return offer;
};

export const fetchSearchProduct = async (token, current, searchInput) => {
  const search = await axios.get(
    `${baseURL}/product-list?currentPage=${current}&itemsPerPage=${limit}&productName=${searchInput}`,
    {
      headers: { Authorization: token },
    }
  );
  return search;
};

export const fetchRacipeList = async (token, current) => {
  const recipe = await axios.get(
    `${baseURL}/recipe-list?currentPage=${current}&itemsPerPage=${limit}`,
    {
      headers: { Authorization: token },
    }
  );
  return recipe;
};

export const fetchRacipeDetails = async (token, recipeId) => {
  const recipe = await axios.get(`${baseURL}/recipe/${recipeId}`, {
    headers: { Authorization: token },
  });
  return recipe;
};

export const exportCustomerDetails = async (token, startDate, endDate) => {
  const user = await axios.get(
    `${baseURL}/export-customer-details?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: { Authorization: token },
    }
  );
  return user;
};

export const exportSegmentProduct = async (token, staticCustomSegmentId) => {
  const segmentProduct = await axios.get(
    `${baseURL}/download-static-custom-segment-product?staticCustomSegmentId=${staticCustomSegmentId}`,
    {
      headers: { Authorization: token },
    }
  );
  return segmentProduct;
};

export const exportBrandList = async (token) => {
  const brand = await axios.get(Services.exportBrandUrl, {
    headers: { Authorization: token },
  });
  return brand;
};
export const exportOrderHistory = async (token, startDate, endDate) => {
  const orderHostory = await axios.get(
    `${baseURL}/export-order-history?startDate=${startDate}&endDate=${endDate}`,
    {
      headers: { Authorization: token },
    }
  );
  return orderHostory;
};

export const OrderCacelByAdmin = async (body, token) => {
  const cancel = await axios.post(Services.orderCacelUrl, body, {
    headers: { Authorization: token },
  });
  return cancel;
};

export const deleteStoreExcel = async (body, token) => {
  const del = await axios.post(Services.deleteStoreExcelUrl, body, {
    headers: { Authorization: token },
  });
  return del;
};

export const fetchOrderStatusCount = async (token) => {
  const orderCount = await axios.get(Services.orderStatusCountUrl, {
    headers: { Authorization: token },
  });
  return orderCount;
};

export const fetchUserRating = async (token, userId) => {
  const rating = await axios.get(`${baseURL}/user/${userId}/rating-review`, {
    headers: { Authorization: token },
  });
  return rating;
};

export const fetchVendroRating = async (token, vendorId) => {
  const rating = await axios.get(
    `${baseURL}/vendor/${vendorId}/rating-review`,
    {
      headers: { Authorization: token },
    }
  );
  return rating;
};

export const deleteVendorRating = async (body, token) => {
  const del = await axios.delete(Services.deleteVendorRatingUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const fetchReturnReplacement = async (
  token,
  current,
  searchInput,
  orderType,
  status
) => {
  const returnReplace = await axios.get(
    `${baseURL}/return-replacement-list?currentPage=${current}&itemsPerPage=${limit}&searchData=${searchInput}&type=${orderType}&status=${status ? status : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return returnReplace;
};

export const fetchReturnReplaceDetail = async (token, retOrRepId) => {
  const returnReplace = await axios.get(
    `${baseURL}/return-replacement/${retOrRepId}`,
    {
      headers: { Authorization: token },
    }
  );
  return returnReplace;
};

export const ReturnReplaceAction = async (token, body) => {
  const retunrAction = await axios.post(Services.returnReplaceActionUrl, body, {
    headers: { Authorization: token },
  });
  return retunrAction;
};

export const deleteCustomSegment = async (body, token) => {
  const del = await axios.delete(Services.deletecustomSegmentUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const UploadProductXls = async (token, body) => {
  const uploadFile = await axios.post(Services.uploadProductXlsUrl, body, {
    headers: { Authorization: token },
  });
  return uploadFile;
};

export const fetchHistoryStatusCount = async (token, deliveryType) => {
  const statusCount = await axios.get(
    `${baseURL}/order-history-all-status-count?deliveryOption=${deliveryType ? deliveryType : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return statusCount;
};

export const fetchPoolProduct = async (
  token,
  categoryId,
  branchCode,
  current
) => {
  const pool = await axios.get(
    `${baseURL}/get-pool-order?categoryId=${categoryId}&branchCode=${branchCode}&currentPage=${current}&itemsPerPage=${limit}`,
    {
      headers: { Authorization: token },
    }
  );
  return pool;
};

export const InsertNewProductPool = async (token, body) => {
  const poolAdd = await axios.post(Services.AddPoolProductUrl, body, {
    headers: { Authorization: token },
  });
  return poolAdd;
};

export const PoolProductActiveInactive = async (token, body) => {
  const poolAction = await axios.put(Services.poolProductActionUrl, body, {
    headers: { Authorization: token },
  });
  return poolAction;
};

export const EditStaticSegment = async (token, body) => {
  const editSegment = await axios.put(Services.editStaticSegmentUrl, body, {
    headers: { Authorization: token },
  });
  return editSegment;
};

export const fetchTrendingBrand = async (token) => {
  const trendngBrand = await axios.get(Services.trendingBrandUrl, {
    headers: { Authorization: token },
  });
  return trendngBrand;
};

export const AddTrenddBrand = async (token, body) => {
  const addbrand = await axios.post(Services.trendingBrandUrl, body, {
    headers: { Authorization: token },
  });
  return addbrand;
};

export const deleteTrendingBrand = async (token, body) => {
  const del = await axios.delete(Services.deleteTrendingBrandUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const fetchProductStockLimit = async (token) => {
  const stockLimit = await axios.get(Services.productStockLimitUrl, {
    headers: { Authorization: token },
  });
  return stockLimit;
};

export const AddProductStockLimit = async (token, body) => {
  const addStock = await axios.post(Services.addProductStockLimitUrl, body, {
    headers: { Authorization: token },
  });
  return addStock;
};

export const deleteProductStockLimit = async (token, body) => {
  const delstocklimit = await axios.delete(
    Services.deleteProductStockLimitUrl,
    {
      data: body,
      headers: { Authorization: token },
    }
  );
  return delstocklimit;
};
export const fetchReturnReplacementhistoryStatusCount = async (
  token,
  orderType,
  deliveryType
) => {
  const returnReplacestatus = await axios.get(
    `${baseURL}/ret-rep-order-history-all-status-count?type=${orderType}&retRepType=${deliveryType ? deliveryType : ""
    }`,
    {
      headers: { Authorization: token },
    }
  );
  return returnReplacestatus;
};

export const fetchReturnReplacementStatusCount = async (token, orderAction) => {
  const returnReplacestatus = await axios.get(
    `${baseURL}/ret-rep-order-all-status-count?type=${orderAction}`,
    {
      headers: { Authorization: token },
    }
  );
  return returnReplacestatus;
};

export const fetchProductBaseDeliveryCharge = async (token, current) => {
  const productDelivery = await axios.get(
    `${baseURL}/delivery-charge-product?currentPage=${current}&itemsPerPage=${limit} `,
    {
      headers: { Authorization: token },
    }
  );
  return productDelivery;
};

export const AddProductBaseChages = async (token, body) => {
  const productChanegs = await axios.post(
    Services.productDeliveryChargeUrl,
    body,
    {
      headers: { Authorization: token },
    }
  );
  return productChanegs;
};

export const deleteProdustDeliveryCharge = async (body, token) => {
  const del = await axios.delete(Services.deleteproductDeliveryChargeUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const refundPaymatCredential = async (token, userPaymentDetailsId) => {
  const refund = await axios.get(
    `${baseURL}/refund-details/${userPaymentDetailsId}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  return refund;
};

export const RefundPayNow = async (token, body) => {
  const PayNow = await axios.post(Services.refundPaynowUrl, body, {
    headers: {
      Authorization: token,
    },
  });
  return PayNow;
};

export const InsertNewAbout = async (token, body) => {
  const about = await axios.post(Services.addAboutUrl, body, {
    headers: {
      Authorization: token,
    },
  });
  return about;
};

export const FetchHelpSupport = async (token, types) => {
  const about = await axios.get(`${baseURL}/help-support?for=${types}`, {
    headers: {
      Authorization: token,
    },
  });
  return about;
};

export const InsertHelpSupport = async (token, body) => {
  const help = await axios.post(Services.addHelpSupportUrl, body, {
    headers: {
      Authorization: token,
    },
  });
  return help;
};

export const UpdateHelpSupport = async (token, body) => {
  const help = await axios.put(Services.editHelpSupportUrl, body, {
    headers: {
      Authorization: token,
    },
  });
  return help;
};

export const FetchFAQList = async (token, types) => {
  const faq = await axios.get(`${baseURL}/faq?for=${types}`, {
    headers: {
      Authorization: token,
    },
  });
  return faq;
};

export const InsertFAQ = async (token, body) => {
  const faq = await axios.post(Services.addFaqListUrl, body, {
    headers: {
      Authorization: token,
    },
  });
  return faq;
};

export const deleteFaqItem = async (token, body) => {
  const del = await axios.delete(Services.deleteFaqListUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const UpdateFAQ = async (token, body) => {
  const faq = await axios.put(Services.editFaqListUrl, body, {
    headers: {
      Authorization: token,
    },
  });
  return faq;
};

// Referral Reward API Functions
export const createReferralReward = async (body, token) => {
  const reward = await axios.post(Services.createReferralRewardUrl, body, {
    headers: { Authorization: token },
  });
  return reward;
};

export const fetchReferralRewardList = async (params, token) => {
  const rewardList = await axios.get(Services.fetchReferralRewardUrl, {
    params: params,
    headers: { Authorization: token },
  });
  return rewardList;
};

export const toggleReferralRewardStatus = async (body, token) => {
  const toggle = await axios.put(Services.toggleReferralRewardStatusUrl, body, {
    headers: { Authorization: token },
  });
  return toggle;
};

export const deleteReferralReward = async (rewardId, token) => {
  const deleteReward = await axios.delete(`${Services.deleteReferralRewardUrl}/${rewardId}`, {
    headers: { Authorization: token },
  });
  return deleteReward;
};

export const createRestrictedProduct = async (body, token) => {
  const reward = await axios.post(Services.createRestrictedProductUrl, body, {
    headers: { Authorization: token },
  });
  return reward;
};

export const DeleteRestrictedProduct = async (body, token) => {
  const del = await axios.delete(`${Services.deleteRestrictedProductUrl}/${body.discountId}`, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const fetchRestrictedLoginList = async (token, current, searchInput) => {
  const discount = await axios.get(`${Services.fetchRestrictedLoginUrl}?currentPage=${current}&itemsPerPage=${limit}&search=${searchInput != null ? searchInput : ""
    }`, {
    headers: { Authorization: token },
  });
  return discount;
};

export const AddRestrictedLoginData = async (body, token) => {
  const dis = await axios.post(Services.insertNewRestrictedLoginUrl, body, {
    headers: { Authorization: token },
  });
  return dis;
};

export const EditRestrictedLogin = async (body, couponId, token) => {
  const setting = await axios.put(`${Services.EditRestrictedLoginUrl}/${couponId}`, body, {
    headers: { Authorization: token },
  });
  return setting;
};

export const DeleteRestrictedLogin = async (id, token) => {
  const del = await axios.delete(`${Services.deleteRestrictedLoginUrl}/${id}`, {
    headers: { Authorization: token },
  });
  return del;
};

export const InsertOfferBanner = async (token, body) => {
  const banner = await axios.post(Services.addOfferBannerUrl, body, {
    headers: { Authorization: token },
  });
  return banner;
};

export const fetchOfferBannerList = async (token, viewType) => {
  const banner = await axios.get(`${baseURL}/banner-list/${viewType}`, {
    headers: { Authorization: token },
  });
  return banner;
};

export const deleteOfferBanner = async (token, body) => {
  const del = await axios.delete(Services.deleteOfferBannerUrl, {
    data: body,
    headers: { Authorization: token },
  });
  return del;
};

export const updateOfferBanner = async (token, body) => {
  const banner = await axios.put(Services.updateOfferbannerUrl, body, {
    headers: { Authorization: token },
  });
  return banner;
};
