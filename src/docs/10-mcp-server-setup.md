# Agility CMS MCP Server Setup

The Agility CMS Model Context Protocol (MCP) server provides AI assistants like Claude with direct access to your Agility CMS content and configuration. This allows AI tools to help you build, configure, and manage your Agility CMS projects more effectively.

## What is MCP?

The Model Context Protocol (MCP) is a standard that allows AI assistants to connect to external data sources and tools. The Agility CMS MCP server exposes your content models, components, and instance data to compatible AI tools.

## Prerequisites

- Active Agility CMS account with API access
- Valid Agility CMS instance with content models
- MCP-compatible AI tool (Claude Code, GitHub Copilot, Cursor, Windsurf, ChatGPT Pro, etc.)
- Internet connection for OAuth authentication

## Automatic Setup (Recommended)

This project includes a pre-configured MCP server setup in `.claude/settings.json`. If you're using Claude Code CLI, the MCP server should be automatically detected when you open this project.

## Manual Setup by Platform

### Claude Code (CLI)

If the MCP server is not automatically detected, you can add it manually:

```bash
claude mcp add --transport http "Agility-CMS" https://mcp.agilitycms.com/api/mcp
```

### GitHub Copilot for VS Code

1. Install the latest GitHub Copilot extension
2. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Search for "Copilot: Configure MCP Servers"
4. Add the server URL: `https://mcp.agilitycms.com/api/mcp`
5. Select "OAuth" as the authentication method
6. Follow the OAuth flow to connect your Agility CMS account

### Cursor

1. Open Cursor settings
2. Navigate to the MCP servers section
3. Add a new server entry:
   - Name: `Agility-CMS`
   - URL: `https://mcp.agilitycms.com/api/mcp`
   - Auth: OAuth
4. Complete the OAuth authentication flow

### Windsurf

1. Access Windsurf settings/extensions
2. Find the MCP servers configuration
3. Add the Agility CMS server:
   - Endpoint: `https://mcp.agilitycms.com/api/mcp`
   - Authentication: OAuth
4. Authenticate with your Agility CMS credentials

### ChatGPT (Pro/Enterprise)

**Note:** Custom MCP connectors are only available for ChatGPT Pro users and Business/Enterprise/Education workspaces, and are currently only usable in Deep Research mode.

1. Open your ChatGPT profile settings
2. Navigate to "Custom Connectors" or "MCP Servers"
3. Create a new custom connector:
   - Name: `Agility CMS`
   - URL: `https://mcp.agilitycms.com/api/mcp`
4. Complete OAuth authentication
5. Use the connector in Deep Research mode

## Authentication

All platforms use OAuth authentication:

1. When prompted, you'll be redirected to the Agility CMS login page
2. Sign in with your Agility CMS credentials
3. Grant the MCP server access to your instances
4. You'll be redirected back to your AI tool

The authentication is persistent and you won't need to re-authenticate unless you explicitly disconnect.

## Available MCP Tools

Once connected, the AI assistant will have access to these tools:

### Content Management
- View and search content models
- Access content items
- Browse content containers
- Query content lists

### Component Management
- List component models
- Access component instances
- View field types and configurations

### Instance Information
- Get instance details
- Access API keys and configurations
- View available locales

## Using the MCP Server

Once configured, you can ask your AI assistant questions like:

- "What content models are available in my Agility instance?"
- "Show me the fields for the BlogPost content model"
- "List all the components in this project"
- "What are the available locales in my instance?"
- "Help me create a new component that matches the Article content model"

The AI assistant will use the MCP server to fetch real-time data from your Agility CMS instance and provide accurate, context-aware responses.

## Troubleshooting

### MCP Server Not Detected

If the MCP server is not automatically detected:

1. Ensure the `.claude/settings.json` file exists in your project root
2. Check that your AI tool supports MCP servers
3. Try manually adding the server using the platform-specific instructions above
4. Restart your AI tool

### Authentication Failures

If authentication fails:

1. Verify you have an active Agility CMS account
2. Check your internet connection
3. Try clearing your OAuth tokens and re-authenticating
4. Ensure your Agility CMS account has API access enabled

### MCP Tools Not Working

If the MCP tools are not responding:

1. Verify you've completed OAuth authentication
2. Check that your Agility instance is active
3. Ensure you have proper permissions in your Agility CMS account
4. Try disconnecting and reconnecting the MCP server

## More Information

- [Agility CMS MCP Server Documentation](https://mcp.agilitycms.com/instructions)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [Agility CMS Documentation](https://help.agilitycms.com/)

## Security Notes

- The MCP server uses OAuth 2.0 for secure authentication
- Your API keys and credentials are never stored by the MCP server
- All communication is over HTTPS
- You can revoke MCP server access at any time from your Agility CMS account settings
