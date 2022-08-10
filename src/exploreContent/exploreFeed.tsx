import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import ImageCard from "../imageCard/card";
import { Masonry, useInfiniteLoader } from "masonic";


/**
 * Explore feed is the masonry Object being displayed to user by default or when user switches to explore tab
 * 
 * IMPORTANT:
 * Working: I am using a masonry and infiniteLoader component from 'Masonic'. 
 * Masonic is an extension library of "react-virtualized", used to form a virtualized masonry.
 * 
 * Question: why masonic?
 * Answer: "react-virtualized" also has a infinite-loader virtual list and I could've used a regular masonry to solve the problem,
 * but in this case the masonry components were re-rendering and/or the API call was getting duplicated.
 * I used memoization of the API calls but re-rendering was still an issue. Masonic's Infinite loader component solved it and optimised the re-sccale processing.
 * 
 * Working of infinite loader and masonry:
 * I am pre-loading 30 posts at the time of component render using useEffect() and 
 * the infinite-loader loads 5 pages(150 posts) for us as we scroll
 */

interface explorefeedprops {
  setPreviewState: (val: boolean) => void;
  previewContent: object;
}

export default function ExploreFeed(props: explorefeedprops) {
  // Props we are getting from its parent( our App component)
  const { previewContent, setPreviewState } = props;

  // My private client token (from unsplash API), kindly change it to your own
  const clientToken = "8wqqT-o0APEHRm_epwquPJCa1cAzFNKvJ7VBLr0imwQ";

  // To store the state of page of the API
  const [pageNum, setPageNum] = useState<number>(1);
  const exploreURL = `https://api.unsplash.com/photos/?per_page=30&client_id=${clientToken}`;

  // This stores all the content we are fetching from API to display
  const [exploreContent, setExploreContent] = useState<any[]>([]);

  // Our API fetch function
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

  // Pre-loading content at the time of component render
  useEffect(() => {
    getExploreData(exploreURL + `&page=${pageNum}`);
    // eslint-disable-next-line
  }, []);


  // We are creating items list to take only required parts from our explore content object.
  // Note: At the time of final update, I realised that this could've been added directly in our API call, but running out of time :(
  const items: any[] = [];
  // eslint-disable-next-line
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
      userName:
        obj.user.first_name + " " + obj.user.last_name
          ? obj.user.last_name
          : "",
      userProfile: obj.user.profile_image.small,
      upDate: finalDate,
      description: obj.description,
      downloadLink: obj.links.download,
      imageID: obj.id,
      sharingLink: obj.links.html,
      profileLink: obj.user.links.html,
      likes: obj.likes,
      altDes: obj.alt_description,
    });
  });


  // Our dummy card component, we use this as an element to our masonry
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
      likes,
      altDes,
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
      likes={likes}
      altDes={altDes}
      previewContent={previewContent}
      setPreviewState={setPreviewState}
      isPreview={false}
    />
  );


  // This is our infinite loaded function
  const fetchMoreItems = useCallback(
    (startIndex: number, stopIndex: number, currentItems: any[]) => {
      getExploreData(exploreURL + `&page=${pageNum}`);
    },
    [pageNum, exploreURL, getExploreData]
  );

  // Our final masonry component
  const InfiniteMasonary = (props: any) => {
    const maybeLoadMore = useInfiniteLoader(fetchMoreItems, {
      isItemLoaded: (index, items) => !!items[index],
      minimumBatchSize: 30,
    });
    return (
      <Masonry
        items={items}
        columnCount={2}
        columnGutter={15}
        // Sets the minimum column width to 200px
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
