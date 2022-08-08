import classNames from "classnames";
import { useState, useEffect} from "react";

// Custom components
import SearchBar from "./searchBar/searchbar";
import ExploreFeed from "./exploreContent/exploreFeed";
import SearchFeed from "./searchContent/searchFeed";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Our main page app
function App() {

  // This is used to set the content page we are browsing
  const [contentType, setContentType] = useState<"explore" | "search">(
    "explore"
  );

  // custom margin that we are setting for out masonry
  const [margin, setMargin] = useState(10 * (window.innerWidth / 1920));

  // this function will update out margin on call
  const updateMargin = () => {
    setMargin(10 * (window.innerWidth / 1920));
  };

  // Using this to update margin when called
  useEffect(() => {
    window.addEventListener("resize", updateMargin);
    return () => window.removeEventListener("resize", updateMargin);
  });

  // this parameter stores the search query string
  const [searchParam, setSearchParam] = useState<string>("");


  // Thhs is a our seach output tab, we display this when content is "search"
  const SearchOutput = (props: any) => {
    return (
      <div>
        {" "}
        {searchParam.length > 0 ? (
          <SearchFeed searchParam={searchParam} />
        ) : (
          <div className="w-full align-center text-xl font-bold text-white mb-4">
            {" "}
            Empty search query, try searching maybe?
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <ToastContainer />
      <div className="w-full fixed flex h-20 z-10 bg-gray-200 justify-between">
        <div className="text-2xl text-left pt-6 pl-8 font-bold text-gray-800">
          Unsplash Clone
        </div>
        <div className="m-3">
          <SearchBar
            setSearchParam={setSearchParam}
            setContentType={setContentType}
          />
        </div>
      </div>
      <div className="w-full flex h-8 z-10 mt-20 fixed bg-gray-200">
        <div className="w-1/2">
          <div
            className={classNames(
              "text-center text-lg text-gray-700",
              contentType === "explore" ? "font-bold" : "font-normal"
            )}
            onClick={() => setContentType("explore")}
          >
            Explore
          </div>
          {contentType === "explore" && (
            <div className="bg-gray-600 w-full h-1 align-bottom"></div>
          )}
        </div>
        <div className="w-1/2">
          <div
            className={classNames(
              "text-center text-lg text-gray-700",
              contentType === "search" ? "font-bold" : "font-normal"
            )}
            onClick={() => setContentType("search")}
          >
            Search
          </div>
          {contentType === "search" && (
            <div className="bg-gray-600 w-full h-1 align-bottom"></div>
          )}
        </div>
      </div>
      <div className="overflow-auto flex items-center justify-center">
        <div className="mt-32 w-full h-full" style={{ marginInline: `${Math.round(margin)}rem` }}>
          {contentType === "explore" ? <ExploreFeed /> : <SearchOutput />}
        </div>
      </div>
    </div>
  );
}

export default App;
