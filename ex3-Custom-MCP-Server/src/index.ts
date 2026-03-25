import express from "express";
import { randomUUID } from "node:crypto";
import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// Create the Express app
const app = express();
app.use(express.json());

// Store active transports by session ID
const transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};

// MCP endpoint for POST requests (client → server)
app.post('/mcp', async (req, res) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  let transport: StreamableHTTPServerTransport;

  if (sessionId && transports[sessionId]) {
    // Existing session
    transport = transports[sessionId];
  } else if (!sessionId && isInitializeRequest(req.body)) {
    // New session initialization
    transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        transports[sessionId] = transport;
      },
      // Optionally add DNS rebinding protection here
    });

    // Cleanup on close
    transport.onclose = () => {
      if (transport.sessionId) {
        delete transports[transport.sessionId];
      }
    };

    // Instantiate your MCP server
    const server = new McpServer({
      name: "Demo",
      version: "1.0.0"
    });

    // Tool: Addition
    server.tool("add", { a: z.number(), b: z.number() }, async ({ a, b }) => ({
      content: [{ type: "text", text: String(a + b) }]
    }));

    // Tool: Energy prices
    server.tool("get-energy-prices", {}, async () => {
      const response = await fetch("https://api.awattar.de/v1/marketdata").then(res => res.json());
      return {
        content: [
          { type: "text", text: `Energy prices for tomorrow: ${JSON.stringify(response)}` }
        ]
      };
    });

    // Tool: Todos
    server.tool("get-todos", {}, async () => {
      const response = await fetch("https://jsonplaceholder.typicode.com/todos").then(res => res.json());
      return {
        content: [
          { type: "text", text: `Todos: ${JSON.stringify(response)}` }
        ]
      };
    });

    // Resource: Greeting
    server.resource(
      "greeting",
      new ResourceTemplate("greeting://{name}", { list: undefined }),
      async (uri, { name }) => ({
        contents: [{
          uri: uri.href,
          text: `Hello, ${name}!`
        }]
      })
    );

    // Connect the MCP server to the transport
    await server.connect(transport);
  } else {
    // Invalid request (no valid session)
    res.status(400).json({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Bad Request: No valid session ID provided',
      },
      id: null,
    });
    return;
  }

  // Process the incoming request
  await transport.handleRequest(req, res, req.body);
});

// Shared GET and DELETE handler for SSE and session termination
const handleSessionRequest = async (req: express.Request, res: express.Response) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports[sessionId]) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  const transport = transports[sessionId];
  await transport.handleRequest(req, res);
};

// GET = SSE (Server → Client)
app.get('/mcp', handleSessionRequest);

// DELETE = Session cleanup
app.delete('/mcp', handleSessionRequest);

// Start server on port 3000
app.listen(3000, () => {
  console.log("🚀 MCP server running at http://localhost:3000");
});
