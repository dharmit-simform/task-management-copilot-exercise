# Submission Summary

## Track Chosen

<!-- Mark your choice with [x] -->

- [x] Backend Only
- [ ] Frontend Only
- [ ] Full-Stack (Both)

## GitHub Copilot Usage Summary

<!-- Describe how you used AI throughout the test. Be specific about when and how you leveraged AI tools. -->

[Write your response here]

## Key Prompts Used

<!-- List 3-5 important prompts you used with your AI assistant -->

1. Based on the below requirements, help me build a backend system using nodejs for a task management application. The requirements are as per below

Backend Track:

- Implement a RESTful API for task management
- CRUD operations (Create, Read, Update, Delete)
- In-memory data storage (no database)
- Input validation and error handling
- Follow proper REST conventions

Make sure to properly structure the code, for the validation library you can use Zod. Also generate a proper swagger documentation along with the proper request and
response objects so that I can test it out thorughly

2. Also below are the advanced things which can be considered, can you revise the plan accordingly?

- Option 1: Request Logging Middleware
- Option 2: API Pagination
- Option 3: Advanced Validation
- Option 4: Task Filtering & Search

3. Now can we add one authentication module, in which the user can signup with email, first name, last name and password and also login using first name and last name.
   Along with that a jwt token will be generated and using that token the user can authenticate and create the tasks. So the tasks would also have the userId of the user
   who has created that tasks. Further more, the tasks module will now use userId so based on the userId from the JWT Token on request only those tasks will be served to
   the user which the user has created, along with that make sure to add the validation for update and delete as well that the user can only update or delete the task
   created by him or her.

4. Extend the task model to include due date. Add support for adding the due date while creating the task, make sure to add the validation for the date that the due date can't be less than today's date. The date to be taken must be in the YYYY-MM-DD format only.

5. Now we have 2 new tasks that needs to be done
   If the task is marked as done, then certain fields should not be ediable like the due date, priority etc., we can change the title and description and if possible we can have a log if the task is mark is done and then the title and description is changed. This change log should contain the previous title and description and the new title and description.

6. The other requirement is that as per below:
   I want to show the tasks at the top while fetching them if their priority is set to high and the due date is within the 7 days from today.

Can you help me create a plan on what will be the best approach for this, either it should be with the other tasks only but showing at the top based on ordering done by date or there should be a separate filter for the task due?

## Design Decisions (optional)

<!-- Explain key architectural or implementation decisions you made and why -->

- **Decision 1:** Repository Pattern for storing data in in-memory
  - **Reasoning:** To maintain single source for the data

- **Decision 2:** Implement Swagger Documentation
  - **Reasoning:** Better testing of the APIs

- **Decision 3:**
  - **Reasoning:**

## Challenges Faced

<!-- Optional: Describe any challenges encountered and how you overcame them -->

The model hallucinates when testing the code, it would prompt again and again to the terminal to start the server, stop the server, build the project and also running in dev mode. The resolution was I would again prompt to the model that this tasks related to server startup, stopping and all would be done by me so it bypassed that and would focus on the business logic

## Time Breakdown

<!-- Optional: Approximate time spent on each phase -->

- Planning & Setup: [5 minutes]
- Core Implementation: [15 minutes]
- Testing & Debugging: [10 minutes]
- Additional Requirements (30-min mark): [10 minutes]
- Additional Requirements (45-min mark): [10 minutes]
- Optional Challenge (if attempted): [10 minutes]

## Optional Challenge

<!-- If you attempted an optional challenge, specify which one -->

- [ ] Not Attempted
- [x] Option 1: Request Logging Middleware
- [x] Option 2: API Pagination
- [x] Option 3: Advanced Validation
- [x] Option 4: Task Filtering & Search
- [ ] Option 5: Form Validation & UX
- [ ] Option 6: Drag-and-Drop Task Reordering
- [ ] Option 7: Local Storage / Offline Support
- [ ] Option 8: Real-time Updates
- [ ] Option 9: Task Statistics Dashboard

## Additional Notes

<!-- Any other information you'd like to share about your implementation -->

[Write your response here]

---

## Submission Checklist

<!-- Verify before submitting -->

- [x] Code pushed to public GitHub repository
- [x] All mandatory requirements completed
- [x] Code is tested and functional
- [x] README updated (if needed)
- [x] This SUBMISSION.md file completed
- [x] MS Teams recording completed and shared
- [x] GitHub repository URL provided to RM
- [x] MS Teams recording link provided to RM
