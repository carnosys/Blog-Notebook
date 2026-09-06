var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var blogs = new List<Blog>
{
  new Blog{ Title = "My First Blog", Body = "This is the body of my first blog." },
  new Blog{ Title = "My Second Blog", Body = "This is the body of my second blog." }  
};

app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/blogs", () => blogs);

app.MapGet("/blogs/{id:int}", (int id) =>
{
  if (id <0 || id >= blogs.Count)
  {
    return Results.NotFound();
  }
  return Results.Ok(blogs[id]);
});

app.MapPost("/blogs", (Blog blog) =>
{
  if (string.IsNullOrWhiteSpace(blog.Title) || string.IsNullOrWhiteSpace(blog.Body))
    return Results.BadRequest(new { message = "Title and body are required." });

  blogs.Add(blog);
  return Results.Created($"/blogs/{blogs.Count - 1}", blog);
});


app.MapDelete("/blogs/{id:int}", (int id) =>
{
  if(id < 0 || id >= blogs.Count)
  {
    return Results.NotFound();
  }
  else
  {
    blogs.RemoveAt(id);
    return Results.NoContent();
  }
});


app.MapPut("/blogs/{id:int}", (int id, Blog blog) =>
{
  if(id < 0 || id >= blogs.Count)
  {
    return Results.NotFound();
  }
  else
  {
    if (string.IsNullOrWhiteSpace(blog.Title) || string.IsNullOrWhiteSpace(blog.Body))
      return Results.BadRequest(new { message = "Title and body are required." });

    blogs[id] = blog;
    return Results.Ok(blog);
  }
});

app.Run();


public class Blog
{
    public required string Title { get; set; }
    public required string Body { get; set; }

}
