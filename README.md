## Requirements

To run the Gator CLI, you need:

- **Node.js** (version 22.15.0 recommended)  
- **npm** 
- **PostgreSQL** (version 16+ recommended)  
- A terminal or command-line interface (CLI)  
- Optionally, a text editor (like VS Code) for configuration

---

### Additional Setup

1. **Node Version Manager (NVM)** (optional but recommended)  
   Install NVM to manage Node.js versions easily. After installing, create a `.nvmrc` file in the root of your project.

## Configuration & Running Gator CLI

1. **Create the config file**  
   Gator uses a JSON file to store your database connection and current user.  
   Create `~/.gatorconfig.json` in your home directory with the following structure:
{
  "db_url": "postgres://username:password@localhost:5432/gator?sslmode=disable",
  "current_user_name": null
}
 
2. **Running Gator CLI**:
npm run start <command> [arguments]:
# Register a new user
npm run start register thamer

# Log in
npm run start login thamer

# Add a feed and follow it
npm run start addfeed "Tech News" https://example.com/rss

# List all feeds
npm run start feeds

# Follow a feed
npm run start follow https://example.com/rss

# Unfollow a feed
npm run start unfollow https://example.com/rss

# List feeds you are following
npm run start following

# Browse latest posts
npm run start browse 5

# Aggregate feeds every 30 seconds
npm run start agg 30s

# Reset all users
npm run start reset

# List all users

npm run start users

