import { useState } from "react";
import WhatsAppLastSeen from "./WhatsAppLastSeen/WhatsAppLastSeen";
import AddressBook from "./AddressBook/AddressBook";
import ChipsInput from "./ChipsInput/ChipsInput";
import DataTable from "./DataTable/DataTable";
import ModalDemo from "./ModalDialog/ModalDemo";
import ImageCarouselDemo from "./ImageCarousel/ImageCarouselDemo";
import FileExplorerDemo from "./FileExplorer/FileExplorerDemo";
import TabsDemo from "./Tabs/TabsDemo";
import AccordionDemo from "./Accordion/AccordionDemo";
import AutocompleteDemo from "./Autocomplete/AutocompleteDemo";
import DropdownDemo from "./Dropdown/DropdownDemo";
import ShoppingCart from "./ShoppingCart/ShoppingCart";
import TodoList from "./TodoList/TodoList";
import SearchFilters from "./SearchFilters/SearchFilters";
import TextEditor from "./TextEditor/TextEditor";
import LikeButtonDemo from "./LikeButton/LikeButtonDemo";
import RatingDemo from "./Rating/RatingDemo";
import PaginationDemo from "./Pagination/PaginationDemo";
import InfiniteScrollDemo from "./InfiniteScroll/InfiniteScrollDemo";
import NestedCheckboxesDemo from "./NestedCheckboxes/NestedCheckboxesDemo";
import MultiSelectDemo from "./MultiSelect/MultiSelectDemo";

const tabs = [
  { id: "whatsapp", label: "WhatsApp Last Seen", component: WhatsAppLastSeen },
  { id: "addressbook", label: "Address Book", component: AddressBook },
  { id: "chips", label: "Chips Input", component: ChipsInput },
  { id: "datatable", label: "Data Table", component: DataTable },
  { id: "modal", label: "Modal Dialog", component: ModalDemo },
  { id: "carousel", label: "Image Carousel", component: ImageCarouselDemo },
  { id: "fileexplorer", label: "File Explorer", component: FileExplorerDemo },
  { id: "tabs", label: "Tabs", component: TabsDemo },
  { id: "accordion", label: "Accordion", component: AccordionDemo },
  { id: "autocomplete", label: "Autocomplete", component: AutocompleteDemo },
  { id: "dropdown", label: "Dropdown", component: DropdownDemo },
  { id: "shoppingcart", label: "Shopping Cart", component: ShoppingCart },
  { id: "todolist", label: "Todo List", component: TodoList },
  { id: "searchfilters", label: "Search Filters", component: SearchFilters },
  { id: "texteditor", label: "Text Editor", component: TextEditor },
  { id: "likebutton", label: "Like Button", component: LikeButtonDemo },
  { id: "rating", label: "Rating", component: RatingDemo },
  { id: "pagination", label: "Pagination", component: PaginationDemo },
  {
    id: "infinitescroll",
    label: "Infinite Scroll",
    component: InfiniteScrollDemo,
  },
  {
    id: "nestedcheckboxes",
    label: "Nested Checkboxes",
    component: NestedCheckboxesDemo,
  },
  { id: "multiselect", label: "Multi Select", component: MultiSelectDemo },
];

export default function TabSystem() {
  const [activeTab, setActiveTab] = useState("whatsapp");

  const activeTabData = tabs.find((tab) => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  return (
    <div className="tab-system">
      <div className="sidebar">
        <h3>Components</h3>
        <div className="tab-list">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <div className="main-content">
        <div className="tab-content">
          {ActiveComponent && <ActiveComponent />}
        </div>
      </div>
    </div>
  );
}
