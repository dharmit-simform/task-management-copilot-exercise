Prompt 1:

Based on the below requirements, help me build a backend system using nodejs for a task management application. The requirements are as per below

Backend Track:

- Implement a RESTful API for task management
- CRUD operations (Create, Read, Update, Delete)
- In-memory data storage (no database)
- Input validation and error handling
- Follow proper REST conventions

Make sure to properly structure the code, for the validation library you can use Zod. Also generate a proper swagger documentation along with the proper request and
response objects so that I can test it out thorughly

Prompt 2:

Also below are the advanced things which can be considered, can you revise the plan accordingly?

- Option 1: Request Logging Middleware
- Option 2: API Pagination
- Option 3: Advanced Validation
- Option 4: Task Filtering & Search

Prompt 3:
I will test the server and its related endpoints

Prompt 4:
I can see that in the swagger related to the task creation all the body parameters are not updated properly in the sample input, can you update that ?

Prompt 5:
Now can we add one authentication module, in which the user can signup with email, first name, last name and password and also login using first name and last name.
Along with that a jwt token will be generated and using that token the user can authenticate and create the tasks. So the tasks would also have the userId of the user
who has created that tasks. Further more, the tasks module will now use userId so based on the userId from the JWT Token on request only those tasks will be served to
the user which the user has created, along with that make sure to add the validation for update and delete as well that the user can only update or delete the task
created by him or her.

Prompt 6:
Now we have 2 new tasks that needs to be done

1. If the task is marked as done, then certain fields should not be ediable like the due date, priority etc., we can change the title and description and if possible we can have a log if the task is mark is done and then the title and description is changed. This change log should contain the previous title and description and the new title and description.

Prompt 7:
The other requirement is that as per below:
I want to show the tasks at the top while fetching them if their priority is set to high and the due date is within the 7 days from today.

Can you help me create a plan on what will be the best approach for this, either it should be with the other tasks only but showing at the top based on ordering done by date or there should be a separate filter for the task due?
