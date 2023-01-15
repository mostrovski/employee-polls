# Employee Polls

## A demo React & Redux project.

### Minimum requirements

#### UI:

##### User
- The application allows the user to log out and log back in. The user should be
  logged in to submit new polling questions, vote, and view the leaderboard;
- Once the user logs in, the home page is shown;
- The name of the logged in user is visible on the page;
##### Home page
- The answered and unanswered polls are both available on the home page
  (each polling question resides in the correct category);
- The user can alternate between viewing answered and unanswered polls;
- The unanswered polls are shown by default;
- The polls in both categories are arranged from the most recently created (top)
  to the least recently created (bottom);
- A polling question links to details of that poll;
##### Poll details
- When a poll is clicked on the home page, the following is shown:
  - the text “Would You Rather”;
  - the avatar of the user who posted the polling question;
  - the two options;
- For answered polls, each of the two options contains the following:
  - the text of the option;
  - the number of people who voted for that option;
  - the percentage of people who voted for that option;
##### Voting
- Upon voting in a poll, all of the information of the answered poll is displayed;
- The user’s response is recorded and is clearly visible on the poll details page;
- When the user comes back to the home page, the polling question appears in the answered category;
##### Adding new poll
- The user can navigate to the form that allows the user to create a new poll;
- The application shows the text “Would You Rather” and has a form for creating two options;
- Upon submitting the form, a new poll is created and the user is taken to the home page;
- The new polling question appears in the correct category on the home page;
##### Leaderboard
- The user can navigate to the leaderboard;
- Each entry on the leaderboard contains the following:
  - the user’s name;
  - the user’s avatar;
  - the number of questions the user asked;
  - the number of questions the user answered;
- Users are ordered in descending order based on the sum of the number of questions
  they’ve answered and the number of questions they’ve asked;
- Upon voting, the data on the leaderboard changes appropriately;

#### Code:

- The store is the application’s source of truth;
- Components read the necessary state from the store; they do not have their own versions of the same state;
- There are no direct API calls in the components' lifecycle methods;
- Most application state is managed by the Redux store;
- Form inputs and controlled components may have some state handled by the component;
- Updates are triggered by dispatching actions to reducers.

### Approach

TODO

### How to run it

1. Make sure you have [Node.js](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) installed.
2. Clone, or download and extract the repository.
3. Change to the root of the project.
4. Run `npm install` to install the dependencies.
5. Run `npm start` to initiate the development build.
6. In your terminal, you should see something like this:

   ```bash
   Compiled successfully!

   You can now view employee-polls in the browser.

     Local:            http://localhost:3000
     On Your Network:  http://<your-ip>:3000

   Note that the development build is not optimized.
   To create a production build, use npm run build.

   webpack compiled successfully
   ```
7. If it didn't happen automatically during the build, open provided link in your browser.

### Tests

Execute `npm test` to run all the test suites.

### Kudos

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template. The starter fake API and project requirements were provided as a part of the [React Nanodegree](https://www.udacity.com/course/react-nanodegree--nd019) at Udacity.