import classNames from "classnames";
import { useState, useEffect } from "react";

// Custom components
import SearchBar from "./searchBar/searchbar";
import ExploreFeed from "./exploreContent/exploreFeed";
import SearchFeed from "./searchContent/searchFeed";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageCard from "./imageCard/card";

// Our main page app
function App() {
  // This is used to set the content page we are browsing
  const [contentType, setContentType] = useState<"explore" | "search">(
    "explore"
  );

  // Content for the popup image card
  const [previewState, setPreviewState] = useState<boolean>(false);

  const [previewContent, setPreviewContent] = useState({
    content: {
      imgSrc: "",
      userName: "",
      userProfile: "",
      upDate: "",
      description: "",
      downloadLink: "",
      imageID: "",
      sharingLink: "",
      profileLink: "",
      likes: 0,
      altDes: "",
    },
  });

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
    return <div> </div>;
  };

  return (
    <div>
      {previewState && (
        <div className="fixed flex z-20 justify-center items-center w-full h-full backdrop-blur-sm">
          <div className=" max-w-xs max-h-sm">
            <ImageCard
              imgSrc={previewContent.content.imgSrc}
              userName={previewContent.content.userName}
              userProfile={previewContent.content.userProfile}
              upDate={previewContent.content.upDate}
              description={previewContent.content.description}
              downloadLink={previewContent.content.downloadLink}
              imageID={previewContent.content.imageID}
              sharingLink={previewContent.content.sharingLink}
              profileLink={previewContent.content.profileLink}
              likes={previewContent.content.likes}
              altDes={previewContent.content.altDes}
              previewContent={previewContent}
              setPreviewState={setPreviewState}
              isPreview={true}
            />
          </div>
        </div>
      )}
      <ToastContainer />
      <div className="w-full fixed flex h-20 z-10 bg-gray-200 justify-between">
        <div className="pt-5 pl-8">
          <img
            src={process.env.PUBLIC_URL + "/logo512.png"}
            alt="unsplash-logo"
            className="w-10 h-10"
          ></img>
        </div>
        <div className="m-3">
          <SearchBar
            setSearchParam={setSearchParam}
            setContentType={setContentType}
          />
        </div>
      </div>
      <div className="w-full flex h-8 z-10 mt-20 drop-shadow-lg fixed bg-gray-200">
        <div className="w-1/2">
          <div
            style={{ cursor: "pointer" }}
            className={classNames(
              "text-center text-lg text-gray-700",
              contentType === "explore" ? "font-bold" : "font-normal"
            )}
            onClick={() => setContentType("explore")}
          >
            Explore
          </div>
          {contentType === "explore" && (
            <div className="flex justify-center">
              <div className="bg-gray-600 w-40 h-1 align-bottom"></div>
            </div>
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
            <div className="flex justify-center">
              <div className="bg-gray-600 w-40 h-1 align-bottom"></div>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-auto flex items-center justify-center">
        <div
          className="mt-32 w-full h-full"
          style={{ marginInline: `${Math.round(margin)}rem` }}
        >
          {contentType === "explore" ? (
            <ExploreFeed
              setPreviewState={setPreviewState}
              previewContent={previewContent}
            />
          ) : (
            <div>
              {searchParam.length > 0 ? (
                <SearchFeed
                  searchParam={searchParam}
                  setPreviewState={setPreviewState}
                  previewContent={previewContent}
                />
              ) : (
                <div className="w-full align-center text-xl font-bold text-white mb-4">
                  Empty search query, try searching maybe?
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
