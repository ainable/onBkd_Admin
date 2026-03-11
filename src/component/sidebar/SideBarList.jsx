import "./sidebar.css";
import { Layout } from "antd";
import SidebarContent from "./SidebarContent";

const SideBarList = () => {
  const { Sider } = Layout;

  return (
    <div className="sidebarMenuItem">
      <Sider
        breakpoint="lg"
        id="sidebar"
        width={270}
        collapsedWidth="0"
        style={{
          position: 'sticky',
          left: 0,
          top: 0,
        }}

      >
        <SidebarContent />
      </Sider>
    </div>
  );
};

export default SideBarList;
