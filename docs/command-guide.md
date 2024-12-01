# Command Guide

**Admin Commands** (Only works in private chat with yourself)

- `!auto [on/off] [message]` - Manage auto-reply system
  ```bash
  !auto on "I'll reply soon"  # Enable with custom message
  !auto off                   # Disable auto-reply
  ```
- `!ai-public [on/off]` - Control public AI access
  ```bash
  !ai-public on  # Allow public use of AI
  !ai-public off # Restrict AI to allowed numbers
  ```
- `!allow [number]` - Add number to allowed list
  ```bash
  !allow 447XXXXXXXXX   # Add single number
  !allow 447XXXXXXXXX 447XXXXXXXXX  # Add multiple numbers
  ```
- `!remove [number/all]` - Remove from allowed list
  ```bash
  !remove 447XXXXXXXXX  # Remove single number
  !remove all           # Clear entire list
  ```
- `!allowed` - Display all allowed numbers
- `!status` - Show assistant settings and status
- `!help` - Display all available commands

**Public AI Commands** (Available based on settings)

- `!ai [text]` - General chat with AI
- `@botname !command [text]` - Use any command in group chat
- `!sum [text]` - Generate text summary
- `!analyze [text]` - Content analysis
- `!idea [text]` - Get suggestions
- `!help` - Display all available AI commands

**Important Notes:**

- All admin commands (including !help) only work when messaging yourself (same number as bot)
- Public AI commands availability depends on:

  - `ai-public` setting:
  - ON: All users can access AI services
  - OFF: Only whitelisted numbers can access

- Phone numbers must be in international format without '+' or spaces:

  - Correct: 447XXXXXXXXX
  - Wrong: +447XXXXXXXXX

- In groups: Always use @botname before any command
