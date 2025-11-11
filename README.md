# Univerbal coding exercise

Thank you for taking the time to complete this coding exercise. We hope you will enjoy it and wish you good luck! 😊

Below you find instructions on how to set up the project and a list of tasks to work on.

You are completely free in choosing what tasks you want to work on and in what order, prioritize them according to how important you think they are. We do not expect yout to finish all of them and prefer quality over quantity. Please read all of them at first carefully, some have dependencies and could be solved at once, others might contradict each other. You are allowed to change anything - feel free to modify any config and add any library or tool to get things done. You can also come up with your own ideas and tasks, but please indicate this if you do so.

We want you to use git while working on the project. Please initialize a git repository in the project directory and commit all files with the message `init`. Keep commiting your changes regularly as you go and tick off tasks you have completed in this README. When you are done, commit the final version with the message `done` (max 4 hours, it's okay if this commit includes WIP). Feel free to continue working on the project after that, but this is not expected.

Don't forget to give us access to the repository by either making it public or inviting us (christopher@univerbal.app).

## Setup

### Global Setup

- If you want to develop with an Android device (not required): ([link](https://docs.expo.dev/workflow/android-studio-emulator/))
- If you want to develop with an iOS device (not required): ([link](https://docs.expo.dev/workflow/ios-simulator/))
- Install node and package manager (npm) e.g. using corepack ([link](https://github.com/nodejs/corepack))

### Project Setup

- Initialize a git repository, stage all files and commit with `init` message
- Install the packages/dependencies
  - Frontend: `cd frontend` then `npm ci`
  - Backend: `cd backend` then `npm ci`
- Create a file `backend/.env` and add the provided openAI key and the port number.
- Start the backend with `npm run start` within the `backend` directory
- Start the frontend with `npm run start` within the `frontend` directory and then select either `a` for android, `i` for ios, `w` for web.
- Note: The frontend won't be able to communicate with the backend. Fixing this is the first task.

# Tasks

## General

- [X] The frontend cannot reach the backend, fix this
- [X] The backend cannot communicate with the OpenAI API, fix this

## Full-stack

- [ ] The frontend allows the user to specify a language but currently this is ignored. Support this feature.
- [ ] Allow users to specify a language level (CEFR) in the frontend and prompt the LLM to respect this.
- [ ] Add another API endpoint that corrects each user message after sending. Display the correction to the user in the frontend (can be very simple).

## API endpoints

- [ ] Add input / argument validation to the controllers
- [ ] Implement the error handling middleware and use it to properly inform the frontend about issues.
- [ ] Some files (e.g. `chat.controller.ts`) contain code that belongs into a service or middleware. Refactor to make the code more modular and clean
- [ ] Make the data in the mock db persist over multiple starts of the backend

## LLM service

- [ ] Add support for other LLM models and make this configurable over a parameter. (Feel free to completely rewrite this / use other OpenAIApi SDK functions)
- [ ] Generalize the `getAIResponse` function: Change it such that it accepts a configuration that consists of at least a prompt and a model, potentially also additional parameters used for the llm generation.
- [ ] When communication with openAI fails, the server currently crashes. Handle this more gracefully.
- [ ] Add a retry mechanism to the communication with the openAI API. I.e. if the model is not able to generate an answer, try again for up to 3 times.

## Prompting

- [ ] In the current setup, each reply from the llm only takes one user message into account. Increase the context by also including the previous 2 messages (i.e. one reply and another user message).
- [ ] Ask users in a first message about what they want to talk about and then make sure that the rest of the conversation sticks to this topic.
- [ ] After a user sent 5 messages, the next message from the AI should include feedback of how they have been doing so far (in English).
- [ ] Make the conversation more interesting. (this is intended to be very open, be creative)

## Code Quality & Testing

- [X] Write tests for the API endpoints
- [ ] There should be no visible type errors
- [ ] The linter should not show errors
- [ ] The linter should not show warnings
