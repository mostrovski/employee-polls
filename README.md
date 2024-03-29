# Employee Polls

## A demo React project showcasing work with the global state managed by Redux.

### Minimum requirements

#### UI:

##### User
- The application allows the user to log out and log back in;
- The user should be logged in to submit new polling questions, vote, and view the leaderboard;
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

#### Implementation

I decided to experiment with [Tailwind UI](https://tailwindui.com/)
to quickly compose decently looking visual blocks representing two major states of the application:

- Login form: initial render and after logout;
- Application shell: after login.

As for the state management, I opted for [Redux Toolkit](https://redux-toolkit.js.org/), meaning:

- Relying heavily on `createSlice` to write reducer logic and extract action creators;
- Using `createAsyncThunk` and corresponding utilities to manage async logic;
- Communicating with the store with the help of `useSelector` (reading) and `useDispatch` (changing) hooks.

I came up with three *features*: auth, employees, and polls.
Each feature got its slice of the store, and associated components.

The [original version](https://github.com/mostrovski/employee-polls/tree/fakeAPI) of this project was built around the fake API. To make this demo a bit more realistic, I implemented a simple [Express](https://expressjs.com/)-[MySQL](https://www.mysql.com/)-[Sequelize](https://sequelize.org/) backend.

#### Structure

To simplify the local installation, I decided to containerize the application with [Docker](https://www.docker.com/).
The original React code moved under the `app`, and two more directories appeared in the root of the project:

- `api` contains the backend logic;
- `data` persists the MySQL data locally, making the database state transferable between the container starts.

The `mysql`, `api`, and `app` containers configured in the [docker-compose](./docker-compose.yaml) use mentioned directories as volumes.

### How to run it

1. Make sure you have [Docker](https://docs.docker.com/get-docker/) installed.
2. Clone, or download and extract the repository.
3. Change to the root of the project.
4. Run `docker compose up app`.
5. Wait until it builds.
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
8. Use credentials from [here](./api/seeders/20230527122735-users.js) to sign in.

### Usage

```bash
# Start (will also migrate and seed the database if it is empty)
docker compose up app

# Stop
docker compose down

# Migrate the database
docker exec -it ep-api-1 npm run migrate

# Seed the database
docker exec -it ep-api-1 npm run seed

# Rollback migrations
docker exec -it ep-api-1 npm run migrate:rollback

# Rollback, migrate, seed
docker exec -it ep-api-1 npm run migrate:refresh
```


### Tests

The application is tested with [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro).

To run API tests, execute:

```bash
docker exec -it ep-api-1 npm test
```

To run app tests, execute:

```bash
docker exec -it ep-app-1 npm test
```

### Container IDs

While executing docker commands, instead of the container names (*ep-mysql-1*, *ep-api-1* or *ep-app-1*), one can also reference the container IDs. List active containers with `docker ps` to check these values.

### Kudos

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template. The project requirements were provided as a part of the [React Nanodegree](https://www.udacity.com/course/react-nanodegree--nd019) at Udacity.