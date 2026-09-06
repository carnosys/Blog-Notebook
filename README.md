# API Practice — Blog Notebook

A small **practice project and demo** for learning ASP.NET Core Minimal APIs and basic CRUD operations. This is a learning exercise, not a production blogging platform.

The original work is a simple C# API with an in-memory list of blogs and GET, POST, PUT, and DELETE endpoints. A lightweight HTML, CSS, and JavaScript frontend builds on that work, keeping the original API structure and avoiding extra frameworks or dependencies.

## What you can try

- View the two starter posts and add your own.
- Edit posts and delete them with confirmation.
- Search titles and bodies instantly in the browser.
- Refresh the list and see validation or request feedback.

The small backend additions serve the frontend, reject blank titles/bodies, and fix out-of-range checks for update and delete.

## Run locally

Install the **.NET 10 SDK**, then run from the repository root:

```bash
dotnet run --project WebApplication1 --launch-profile http
```

Open **http://localhost:5005**. No database, Node.js, or frontend build step is required. Stop the server with `Ctrl+C`.

To check compilation:

```bash
dotnet build WebApplication1
```

## API endpoints

| Method | Route | Purpose |
| --- | --- | --- |
| GET | `/blogs` | List all posts |
| GET | `/blogs/{id}` | Get a post |
| POST | `/blogs` | Create a post (201) |
| PUT | `/blogs/{id}` | Update a post |
| DELETE | `/blogs/{id}` | Delete a post (204) |

POST and PUT accept JSON:

```json
{
  "title": "Something I learned",
  "body": "Today I practiced calling an API from JavaScript."
}
```

Blank titles or bodies return `400`. Missing post indices return `404`. You can also try the requests in `request.http` using an HTTP client that supports `.http` files.

## Project layout

```text
WebApplication1/
  Program.cs          # Original Minimal API and blog model
  wwwroot/
    index.html        # Notebook interface
    styles.css        # Responsive styling
    app.js            # Fetch requests and UI interactions
request.http          # Example API requests
```

## Demo limitations

Posts are stored only in server memory: changes disappear when the app restarts. IDs are zero-based list positions and shift after deletion. This intentionally keeps the original implementation simple; use one browser tab at a time for the demo, and refresh after changes from another client. There is no authentication, database, or multi-user concurrency handling.

Possible future practice exercises: stable IDs, database persistence, and automated API tests.
