import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ImageCard from "../imageCard/card";
import { Masonry, useInfiniteLoader } from "masonic";

interface searchfeedprops {
  searchParam: string;
}

export default function SearchFeed(props: searchfeedprops) {
  const { searchParam } = props;

  const clientToken = "8wqqT-o0APEHRm_epwquPJCa1cAzFNKvJ7VBLr0imwQ";
  const [pageNum, setPageNum] = useState<number>(1);
  const searchURL = `https://api.unsplash.com/search/photos/?per_page=30&client_id=${clientToken}`;

  const [searchContent, setSearchContent] = useState<any[]>([]);

  const getSearchData = useCallback(
    (url: string) => {
      axios.get(url).then((response: any) => {
        setSearchContent((currentContent) =>
          currentContent.concat(response.data.results)
        );
        setPageNum((currentPageNum) => currentPageNum + 1);
      });
    },
    [setSearchContent, setPageNum]
  );

  useEffect(() => {
    getSearchData(searchURL + `&page=${pageNum}` + `&query=${searchParam}`);
  }, [searchParam]);


  const items: any[] = [];
  searchContent.map((obj) => {
    var dummyDate = obj.created_at.split("-");
    var mydate = new Date(
      dummyDate[0],
      dummyDate[1],
      dummyDate[2].substring(0, 2)
    ).toDateString();
    const finalDate =
      mydate.substring(0, mydate.length - 5) +
      ", " +
      mydate.substring(mydate.length - 4, mydate.length);
    items.push({
      src: obj.urls.regular,
      userName: obj.user.first_name + " " + obj.user.last_name,
      userProfile: obj.user.profile_image.small,
      upDate: finalDate,
      description: obj.description,
      downloadLink: obj.links.download,
      imageID: obj.id,
      sharingLink: obj.links.html,
      profileLink: obj.user.links.html,
    });
  });

  const FakeCard = ({
    data: {
      src,
      userName,
      userProfile,
      upDate,
      description,
      downloadLink,
      imageID,
      sharingLink,
      profileLink,
    },
  }) => (
    <ImageCard
      imgSrc={src}
      userName={userName}
      userProfile={userProfile}
      upDate={upDate}
      description={description}
      downloadLink={downloadLink}
      imageID={imageID}
      sharingLink={sharingLink}
      profileLink={profileLink}
    />
  );

  const fetchMoreItems = useCallback(
    (startIndex: number, stopIndex: number, currentItems: any[]) => {
      getSearchData(searchURL + `&query=${searchParam}` + `&page=${pageNum}`);
    },
    [pageNum]
  );

  const InfiniteMasonary = (props: any) => {
    const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 10,
    });
    return (
      <Masonry
        items={items}
        columnCount={2}
        columnGutter={10}
        // Sets the minimum column width to 172px
        columnWidth={200}
        // Pre-renders 5 windows worth of content
        overscanBy={5}
        // This is the grid item component
        render={FakeCard}
        onRender={maybeLoadMore}
      ></Masonry>
    );
  };

  return (
    <div>
      <div className="w-full text-xl mb-4 text-white font-semibold">
        {searchContent.length > 0
          ? `Showing results for "${searchParam}"`
          : `No results found for "${searchParam}"`}
      </div>
      <InfiniteMasonary />
    </div>
  );
}
