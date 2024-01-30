# Twimblr
Final project for CSCI 4131, Fall 2023. Done by Chi Vu (vu000153)

# List of features
- Users can see posts regardless of login status.
- The main page can display a maximum of 10 posts per page.
- Users can see more posts by navigating through the pages.
- User can like and unlike posts regardless of login status.
- Like counters are updated in real time (1s interval). Posts are not updated in real time.
- Users can create accounts, as long as their usernames are not taken.
- Users can log into their accounts, and stay logged in for a week.
- Users can only create posts (under 256 letters) when they are logged in.
- Users can edit/delete posts using icons on their posts.
- Users can update their username/password only when logged in. Updating usernames will also change their names on posts.
- Users can log out of their accounts.
- Users can delete their accounts.
- Users can access account functions using the collapsible menu on top right.
- Users can change poss filter using the collapsible menu on bottom right.

# Thoughts on the project
## Non-obvious design choices:
- At first, I tried to have unique user_id and not unique username, but as this website does not store emails, I had to scrap that and use username as primary key.
- Deleting an account will also delete all their posts. It's just easier that way.
- Like and unlike in one session. Since likes are not bound to accounts, reloading will reset like status. Like and unlike will also immediately update the counter instead of waiting for the interval.
- If a post is deleted directly from the database. the like count will show as -1 temporarily.
- The delete account is a POST request because I went into a rabbit hole of HTML forms not being able to send any other requests other than GET and POST. With enough finangling, I could make it work for a DELETE request, but it's more straightforward this way.
- Editing username/password will not warn you if you get the current password wrong (but will warn you if you violate character count/already existing username). If you get the password wrong, it will redirect you to the same page. Not the most user-friendly design, but it works. 
- If you try to edit username/password when not logged in, it will redirect you to the login page.

## Things I want to do:
- Add some kind of encryption to the passwords. Due to time constraint, I didn't get to it.
- Add an user page where users can see all of their posts. This should be simple, but I also didn't get to it due to time.
- I probably should have split up main.js into 2 files. It has a lot of unnecessary functionalities for pages other than main. 
- Make the menu prettier. It works, but it could have been better.
- Error checking is... not the best. Generally, the website will work if the users are using it naturally, and it can handle some bad requests, but I didn't go out of my way to make sure it's error-proof.
- Some functions are not so elegantly designed (especially edit - I was bolting functions on as I see needed to make it work). I would like to calmly fix it if possible.

## Other thoughts:
- Footer template is a bit messy. I probably could have done it with session somehow?
- I thought about this way too late into development, but forced redirection when not logged in - it could have been interesting.
- I probably should have split up main.js into 2 files. It has a lot of unnecessary functionalities for pages other than main. 
- Some functions are not so elegantly designed (especially edit - I was bolting functions on as I see needed to make it work). 

# Initial design thoughts
These are my original notes/draft for the project. Mostly for fun.
- Text post: max 256 letters. Posting is POST request (/post). Editing is POST (/edit). Deleting is DELETE (/delete)
- Liking is POST request (like). Probably no dislike function?. Unlike is POST request (same endpoint) (rethink unlike - this is hard to implement - maybe in that session only?)
- Text post stored in a table with USER_ID (foreign key?), POST_ID, TIMESTAMP, LIKES (all not null) (POST_ID auto increment)
- Use session for user behavior
- User data stored in a table with USER_ID, USERNAME, PASSWORD
- Ability to create new accounts (POST request, /new_user)