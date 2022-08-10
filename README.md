# Unsplash Clone
This project is built on ReactJs, typescript and Axios and used
Unsplash's API. It has the explore and search parts of unsplash.

## To run the project

To run the project we need to do following:

### `npm install --save --legacy-peer-deps`

There are certain libraries that don't align with the version of React, hence we use `--legacy-peer-deps` to install those

### `npm start`
Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

## To deploy on GitHub pages
Added `gh-pages` npm package to make it deployable. To deploy use,
### `npm run deploy`

## About the Application
The application is a simple webapp that serves users with an explore feed with posts from unsplash API and a search functionality.

## About the tech stack
This app is build upon React, axios(for API side of things), some parts of material UI and finally Tailwind for Cascading.

## Working of the APP
- This app is hosted on the following [Link](https://aatmjeet.github.io/unsplash-clone/). On opening the app, the user will be provided with an explore feed with posts from Unsplash.\
- The user can keep on scrolling infinitely.\
### Basic feed on opening the app
- There post are randomly put in a masonry based on their aspect ratio.\
- The user can share a post but coppying its link or could download the image.\
- User could also open the porfile of the original post ceator by clicking on the avatar of user.\
- The post can also be previewed by clicking on the image, this provide some additional information about the post.\

### Search feed
- The user can search posts based on his intrests by just clicking on the searchbar, entering the query and pressing the search button.\
- Upon searching, the user is provided with a feed of search results. This feed is similar to our explore feed.\

## Development Notes and Important mentions
- The app follows a different UI and color scheme from Unsplash. This is my take on the Infinite feed application, any feedback is appriciated.\
- Main focus of the application is to present a feed and make it really optimised.\
- The core idea was to build a virtual masonry that loads posts infinitely. Most time was spent on the app was to optimise the virual list part.\
- The virtual list only renders components that are in the view.\

### Desgn decisions
- Search feed and explore feed are build upon "masonic" library.\

#### IMPORTANT:
- Working: I am using a masonry and infiniteLoader component from 'Masonic'.
- Masonic is an extension library of "react-virtualized", used to form a virtualized masonry.
- Question: why masonic? \
- Answer: "react-virtualized" also has a infinite-loader virtual list and I could've used a regular masonry to solve the problem,
- but in this case the masonry components were re-rendering and/or the API call was getting duplicated.
- I used memoization of the API calls but re-rendering was still an issue. Masonic's Infinite loader component solved it and optimised the re-sccale processing.
- Working of infinite loader and masonry:
- I am pre-loading 30 posts at the time of component render (when searchquery is changed i.e. when we search something)
- using useEffect() and the infinite-loader loads 5 pages(150 posts) for us as we scroll

## Known improvements ( that could be made with time)
Although there was a lot of effort put in the Application, there are some key improvement that could be done while scaling the application

### The app uses State variables, but not a memory bank
- Current iteration of the app uses state variables (useState). With the size of our application, the state variables are a good fit and make more sense.\
- But as we upscale the application with several layers to the app, it would be easier and would save a lot of resource to use "redux" or some other memory bank.\

#### Observation: 
- I tried redux using reucers in the application, but it was not that efficient with the size of our application.