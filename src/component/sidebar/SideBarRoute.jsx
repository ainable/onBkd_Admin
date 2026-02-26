import RoleManagement from "../../authentication/role/RoleManagement";
import { Icons } from "../../common/icons";
import OrderHistory from "../OrderManage/OrderHistory";
import OrderList from "../OrderManage/OrderList";
import OrderRefund from "../OrderManage/OrderRefund";
import ReturnReplace from "../OrderManage/ReturnReplace";
import ReturnReplaceHistory from "../OrderManage/ReturnReplaceHistory";
import BannerManage from "../banner/BannerManage";
import BranchManage from "../branch/BranchManage";
import BranchSlote from "../branch/BranchSlote";
import BranchRole from "../branch/branchRole/BranchRole";
import AboutUs from "../cms/aboutus/AboutUs";

import TermCondition from "../cms/TermCondition/TermCondition";
import FaqList from "../cms/faq/FaqList";
import PrivecyPolicy from "../cms/policy/PrivecyPolicy";

import AdminDashboard from "../dashboard/AdminDashboard";
import ElasticSearchProduct from "../elasticSearch/ElasticSearchProduct";

import BrandListing from "../master/brand/BrandListing";
import CategoryItem from "../master/category/CategoryItem";
import Cateogry from "../master/category/Cateogry";
import DiscountList from "../master/discount/DiscountList";
import ReferralRewardList from "../master/referralReward/ReferralRewardList";
import PoolSegment from "../master/pool/PoolSegment";
import CustomSegment from "../master/segment/CustomSegment";
import TrendingBrand from "../master/segment/TrendingBrand";
import ProductStockLimit from "../productManage/ProductStockLimit";
import Products from "../productManage/Products";
import RecipeList from "../recipe/RecipeList";
import AdminReport from "../reports/AdminReport";
import UserList from "../user/UserList";
import DeliveryBoy from "../vendor/DeliveryPartner";
import { v4 as uuidv4 } from 'uuid';
import CoupontList from "../master/coupon/CoupontList";
import RestrictedProductsList from "../master/restrictedProducts/RestrictedProductsList";
import AllowLoginList from "../AllowLogin/AllowLoginList";
import OfferImageManage from "../offerImage/OfferImageManage";

// Main routes object with sub-menu items
const routes = [
  {
    key: uuidv4(),
    path: "/dashboard",
    icons: Icons.Admin,
    label: "Dashboard",
    component: AdminDashboard,
  },
  {
    key: uuidv4(),
    path: "/dashboard/report",
    icons: Icons.report,
    label: "Reports",
    component: AdminReport,
  },

  {
    key: uuidv4(),
    label: "Orders",
    icons: Icons.order,
    permission: "orders",
    children: [
      {
        key: uuidv4(),
        path: "/dashboard/orders",
        icons: Icons.order,
        label: "Live Order",
        component: OrderList,
        permission: "orders",
      },
      {
        key: uuidv4(),
        path: "/dashboard/return-replace",
        icons: Icons.returnReplace,
        label: "Return & Replace ",
        component: ReturnReplace,
        permission: "orders",
      },
      {
        key: uuidv4(),
        path: "/dashboard/order-history",
        icons: Icons.history,
        label: "Order History",
        component: OrderHistory,
        permission: "orders",
      },
      {
        key: uuidv4(),
        path: "/dashboard/return-order-history",
        icons: Icons.history,
        label: "Return History",
        component: ReturnReplaceHistory,
        permission: "orders",
      },
      {
        key: uuidv4(),
        path: "/dashboard/order-refund",
        icons: Icons.refund,
        label: "Payment Refund",
        component: OrderRefund,
        permission: "orders",
      },



    ],
  },
  {
    key: uuidv4(),
    path: "/dashboard/allow-login",
    icons: Icons.Login,
    label: "Allow Login",
    component: AllowLoginList,
    permission: "allowLogin",
  },
  {
    key: uuidv4(),
    path: "/dashboard/user",
    icons: Icons.User,
    label: "Customer",
    component: UserList,
    permission: "users",
  },


  {
    keys: uuidv4(),
    path: "/dashboard/delivery-partner",
    icons: Icons.delivery,
    label: "Delivery Partner",
    component: DeliveryBoy,
    permission: "deliveryPartner",
  },


  {
    key: uuidv4(),
    label: "Item Management ",
    icons: Icons.manage,
    permission: "itemManagement",
    children: [
      {
        key: uuidv4(),
        path: "/dashboard/products",
        icons: Icons.Product,
        label: "Product",
        component: Products,
        permission: "itemManagement",

      },
      {
        key: uuidv4(),
        path: "/dashboard/products-stock",
        icons: Icons.Stock,
        label: "Product Stock ",
        component: ProductStockLimit,
        permission: "itemManagement",

      },

      {
        keys: uuidv4(),
        path: "/dashboard/category",
        icons: Icons.Category,
        label: "Category",
        component: Cateogry,
        permission: "itemManagement",

      },

      {
        keys: uuidv4(),
        path: "/dashboard/categoryItem",
        icons: Icons.Category,
        label: "Category Item",
        component: CategoryItem,
        permission: "itemManagement",

      },

      {
        keys: uuidv4(),
        path: "/dashboard/brand",
        icons: Icons.Brand,
        label: "All Brands",
        component: BrandListing,
        permission: "itemManagement",

      },



    ],
  },
  {
    key: uuidv4(),
    label: "Offer and Discount",
    icons: Icons.offer,
    permission: "offerDiscount",

    children: [
      {
        keys: uuidv4(),
        path: "/dashboard/discount",
        icons: Icons.discount,
        label: "Discount Offer",
        component: DiscountList,
        permission: "offerDiscount",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/coupon",
        icons: Icons.coupon,
        label: "Coupon",
        component: CoupontList,
        permission: "offerDiscount",
      },
      {
        keys: uuidv4(),
        path: "/dashboard/referral-reward",
        icons: Icons.offer,
        label: "Referral Reward",
        component: ReferralRewardList,
        permission: "offerDiscount",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/banner",
        icons: Icons.banner,
        label: "Banner  Offer",
        component: BannerManage,
        permission: "offerDiscount",
      },
      {
        keys: uuidv4(),
        path: "/dashboard/offer-image",
        icons: Icons.banner,
        label: "Offer Image",
        component: OfferImageManage,
        permission: "offerDiscount",
      },
      {
        keys: uuidv4(),
        path: "/dashboard/restricted-products",
        icons: Icons.Product,
        label: "Restricted Products",
        component: RestrictedProductsList,
        permission: "offerDiscount",
      },
    ],
  },

  {
    key: uuidv4(),
    label: "Segment Management",
    icons: Icons.app,
    permission: "segment",

    children: [
      {
        keys: uuidv4(),
        path: "/dashboard/custom-segment",
        icons: Icons.Category,
        label: "Custom Segment",
        component: CustomSegment,
        permission: "segment",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/pool-segment",
        icons: Icons.pool,
        label: "Pool Segment",
        component: PoolSegment,
        permission: "segment",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/trending-brand",
        icons: Icons.trend,
        label: "Trending Brand",
        component: TrendingBrand,
        permission: "segment",

      },
    ],
  },
  {
    key: uuidv4(),
    label: "Branch Management",
    icons: Icons.Store,
    permission: "branch",

    children: [
      {
        keys: uuidv4(),
        path: "/dashboard/branch-role",
        icons: Icons.role,
        label: " Role Management ",
        component: BranchRole,
        permission: "branch",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/branch",
        icons: Icons.Store,
        label: "Branch",
        component: BranchManage,
        permission: "branch",
      },
      {
        keys: uuidv4(),
        path: "/dashboard/branch-slot",
        icons: Icons.slot,
        label: "Branch Slot",
        component: BranchSlote,
        permission: "branch",

      },



    ],
  },
  {
    key: uuidv4(),
    path: "/dashboard/delivery-charge",
    icons: Icons.refund,
    label: "Delivery Charge Allow",
    component: RecipeList,
    permission: "deliveryCharge",

  },
  {
    key: uuidv4(),
    path: "/dashboard/recipe",
    icons: Icons.recipe,
    label: "Recipe List",
    component: RecipeList,
    permission: "recipe",

  },

  {
    key: uuidv4(),
    label: "CMS",
    icons: Icons.cms,
    permission: "cms",

    children: [
      {
        keys: uuidv4(),
        path: "/dashboard/faq",
        icons: Icons.Term,
        label: "FAQ List",
        component: FaqList,
        permission: "cms",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/term-condition",
        icons: Icons.Term,
        label: "Term & Condition",
        component: TermCondition,
        permission: "cms",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/privecy-policy",
        icons: Icons.Policy,
        label: "Privacy Policy",
        component: PrivecyPolicy,
        permission: "cms",

      },
      {
        keys: uuidv4(),
        path: "/dashboard/Aboutus",
        icons: Icons.about,
        label: "About Us",
        component: AboutUs,
        permission: "cms",

      },



    ],
  },
  {
    key: uuidv4(),
    path: "/dashboard/role-management",
    icons: Icons.role,
    label: "Role Management",
    component: RoleManagement,
  },


];


export default routes;


export const BranchRoutes = [
  {
    key: 1,
    label: "Dashboard",
    persission: "admin",
  },
  {
    keys: 2,
    label: "Live Order",
    persission: "order",

  },
  {
    keys: 3,
    label: "Return & Replace ",
    persission: "returnReplace",

  },
  {
    keys: 4,
    label: "Order History",
    persission: "orderHistory",

  },
  {
    keys: 5,
    label: "Return History",
    persission: "orderHistoryReturn",

  },
  {
    keys: 6,
    label: "COD Collet ",
    persission: "codCollect",

  },
  {
    keys: 7,
    label: "Delivery Partner",
    persission: "deliveryPartner",

  },

];
