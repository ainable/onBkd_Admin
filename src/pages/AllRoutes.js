import LoginPage from "../authentication/login/LoginPage";
import OrderDetails from "../component/OrderManage/OrderDetails";
import OrderHistory from "../component/OrderManage/OrderHistory";
import OrderList from "../component/OrderManage/OrderList";
import OrderRefund from "../component/OrderManage/OrderRefund";
import RefundOrderDetails from "../component/OrderManage/RefundOrderDetails";
import ReturnReplace from "../component/OrderManage/ReturnReplace";
import ReturnReplaceDetails from "../component/OrderManage/ReturnReplaceDetails";
import BannerManage from "../component/banner/BannerManage";
import BranchDetails from "../component/branch/BranchDetails";
import BranchManage from "../component/branch/BranchManage";
import BranchSlote from "../component/branch/BranchSlote";
import AboutUs from "../component/cms/aboutus/AboutUs";
import TermCondition from "../component/cms/TermCondition/TermCondition";
import PrivecyPolicy from "../component/cms/policy/PrivecyPolicy";
import AdminDashboard from "../component/dashboard/AdminDashboard";
import MainLayout from "../component/dashboard/MainLayout";
import BrandListing from "../component/master/brand/BrandListing";
import CategoryItem from "../component/master/category/CategoryItem";
import Cateogry from "../component/master/category/Cateogry";
import SubCategory from "../component/master/category/SubCategory";
import DiscountList from "../component/master/discount/DiscountList";
import ReferralRewardList from "../component/master/referralReward/ReferralRewardList";
import CustomSegment from "../component/master/segment/CustomSegment";
import Notifications from "../component/notification/Notifications";
import Products from "../component/productManage/Products";
import RacipeDetails from "../component/recipe/RacipeDetails";
import RecipeList from "../component/recipe/RecipeList";
import UserDetails from "../component/user/UserDetails";
import UserList from "../component/user/UserList";
import DeliveryBoy from "../component/vendor/DeliveryPartner";
import DeliveryPartnerDetails from "../component/vendor/DeliveryPartnerDetails";
import SegmentDetails from "../component/master/segment/SegmentDetails";
import PoolSegment from "../component/master/pool/PoolSegment";
import TrendingBrand from "../component/master/segment/TrendingBrand";
import ProductStockLimit from "../component/productManage/ProductStockLimit";
import ReturnReplaceHistory from "../component/OrderManage/ReturnReplaceHistory";
import ProductDeliveryCharge from "../component/deliveryCharge/ProductDeliveryCharge";
import FaqList from "../component/cms/faq/FaqList";
import BrandProduct from "../component/master/brand/BrandProduct";
import RoleManagement from "../authentication/role/RoleManagement";
import BranchRole from "../component/branch/branchRole/BranchRole";
import AdminReport from "../component/reports/AdminReport";
import CoupontList from "../component/master/coupon/CoupontList";
import RestrictedProductsList from "../component/master/restrictedProducts/RestrictedProductsList";
import AllowLoginList from "../component/AllowLogin/AllowLoginList";
import OfferImageManage from "../component/offerImage/OfferImageManage";

// Main routes object with child routes
const routes = [
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/dashboard",
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/dashboard/report",
        element: <AdminReport />,
      },
      {
        path: "/dashboard/user",
        element: <UserList />,
      },
      {
        path: "/dashboard/role-management",
        element: <RoleManagement />,
      },
      {
        path: "/dashboard/user-details/:id",
        element: <UserDetails />,
      },
      // {
      //   path: "/dashboard/elastic-search",
      //   element: <ElasticSearchProduct />,
      // },
      {
        path: "/dashboard/return-replace",
        element: <ReturnReplace />,
      },
      {
        path: "/dashboard/return-replace-details/:id",
        element: <ReturnReplaceDetails />,
      },

      {
        path: "/dashboard/banner",
        element: <BannerManage />,
      },
      {
        path: "/dashboard/offer-image",
        element: <OfferImageManage />,
      },
      {
        path: "/dashboard/branch",
        element: <BranchManage />,
      },
      {
        path: "/dashboard/branch-role",
        element: <BranchRole />,
      },
      {
        path: "/dashboard/custom-segment",
        element: <CustomSegment />,
      },
      {
        path: "/dashboard/discount",
        element: <DiscountList />,
      },
      {
        path: "/dashboard/coupon",
        element: <CoupontList />,
      },
      {
        path: "/dashboard/restricted-products",
        element: <RestrictedProductsList />,
      },
      {
        path: "/dashboard/allow-login",
        element: <AllowLoginList />,
      },
      {
        path: "/dashboard/referral-reward",
        element: <ReferralRewardList />,
      },
      {
        path: "/dashboard/segment-product/:id",
        element: <SegmentDetails />,
      },
      {
        path: "/dashboard/pool-segment",
        element: <PoolSegment />,
      },
      {
        path: "/dashboard/trending-brand",
        element: <TrendingBrand />,
      },
      {
        path: "/dashboard/branch-slot",
        element: <BranchSlote />,
      },
      {
        path: "/dashboard/branch-details/:id",
        element: <BranchDetails />,
      },
      {
        path: "/dashboard/delivery-partner",
        element: <DeliveryBoy />,
      },
      {
        path: "/dashboard/delivery-partner/:id",
        element: <DeliveryPartnerDetails />,
      },
      {
        path: "/dashboard/category",
        element: <Cateogry />,
      },
      {
        path: "/dashboard/delivery-charge",
        element: <ProductDeliveryCharge />,
      },
      {
        path: "/dashboard/products-stock",
        element: <ProductStockLimit />,
      },
      {
        path: "/dashboard/faq",
        element: <FaqList />,
      },
      {
        path: "/dashboard/categoryItem",
        element: <CategoryItem />,
      },

      {
        path: "/dashboard/brand",
        element: <BrandListing />,
      },

      {
        path: "/dashboard/sub-category",
        element: <SubCategory />,
      },

      {
        path: "/dashboard/products",
        element: <Products />,
      },

      {
        path: "/dashboard/orders",
        element: <OrderList />,
      },
      {
        path: "/dashboard/order-refund",
        element: <OrderRefund />,
      },
      {
        path: "/dashboard/order-history",
        element: <OrderHistory />,
      },
      {
        path: "/dashboard/return-order-history",
        element: <ReturnReplaceHistory />,
      },
      {
        path: "/dashboard/orders-refund-details/:id",
        element: <RefundOrderDetails />,
      },
      {
        path: "/dashboard/brand-product/:id",
        element: <BrandProduct />,
      },
      {
        path: "/dashboard/orders-details/:id",
        element: <OrderDetails />,
      },
      {
        path: "/dashboard/term-condition",
        element: <TermCondition />,
      },
      {
        path: "/dashboard/privecy-policy",
        element: <PrivecyPolicy />,
      },
      {
        path: "/dashboard/Aboutus",
        element: <AboutUs />,
      },
      {
        path: "/dashboard/notification",
        element: <Notifications />,
      },
      {
        path: "/dashboard/recipe",
        element: <RecipeList />,
      },
      {
        path: "/dashboard/recipe-details/:id",
        element: <RacipeDetails />,
      },
    ],
  },
];

export default routes;
