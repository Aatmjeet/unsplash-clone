import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ImageCard from "../imageCard/card";
import { Masonry, useInfiniteLoader } from "masonic";

interface explorefeedprops {}

export default function ExploreFeed(props: explorefeedprops) {
  const clientToken = "8wqqT-o0APEHRm_epwquPJCa1cAzFNKvJ7VBLr0imwQ";
  const [pageNum, setPageNum] = useState<number>(1);
  const exploreURL = `https://api.unsplash.com/photos/?per_page=30&client_id=${clientToken}`;

  const [exploreContent, setExploreContent] = useState<any[]>([]);

  const getExploreData = useCallback(
    (url: string) => {
      axios.get(url).then((response: any) => {
        setExploreContent((currentContent) =>
          currentContent.concat(response.data)
        );
        setPageNum((currentPageNum) => currentPageNum + 1);
      });
    },
    [setExploreContent, setPageNum]
  );

  useEffect(() => {
    getExploreData(exploreURL + `&page=${pageNum}`);
  }, []);

  const items: any[] = [];
  exploreContent.map((obj) => {
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
      getExploreData(exploreURL + `&page=${pageNum}`);
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

  return <InfiniteMasonary />;
}
