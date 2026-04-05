# Foma Render Engine

**Foma Render Engine** is a high-performance email rendering microservice designed for the **Fordima Inc** ecosystem. It transforms simplified templates in `.fre` format (standard HTML/CSS) into robust emails compatible with all email clients (Gmail, Outlook, Apple Mail, etc.).

## Strengths

* **Layout/View System**: Separate the overall structure (header/footer) from the specific content.

* **Format .fre**: Use standard HTML and CSS without worrying about email complexity.

* **Auto-Inlining**: Automatically integrates CSS into HTML via **Juice**.

* **Handlebars Engine**: Dynamic data injection and simple template logic.

* **Docker Ready**: Instant deployment and complete isolation.

## Project Structure

The engine expects to find a `templates/` folder at the root:

```Plaintext
/templates
├── layout.fre      # The overall structure (must contain {{{body}}})
├── otp.fre         # Example: Template for verification codes
└── welcome.fre     # Example: Welcome Template
```

## Installation and Startup

With Docker (Recommended)

1. Construct the image :
    ```bash
    docker compose build
    ```

2. Launch the service :
    ```bash
    docker compose up
    ```

The server will be available at `http://localhost:3000`.

## Using the API

### Render a Template

**Endpoint** :` POST /render`

**Request body (JSON)** :

```json
{
  "template": "otp",
  "data": {
    "userName": "Fordi Malanda",
    "code": "882941",
    "companyName": "FomaBank",
    "logoUrl": "https://cdn.foma.dev/logo.png"
  }
}
```

**Example answer** :

```json
{
  "success": true,
  "html": "<!DOCTYPE html><html>...</html>"
}
```

## Create a .fre file

1. **The Layout** (`layout.fre`)

It defines the graphic charter. **Important:** You must include `{{{body}}}` where the specific content should be injected.

```html
<html>
  <style> .main { color: #333; } </style>
  <body>
    <div class="main">
      {{{body}}}
    </div>
  </body>
</html>
```

2. **The View** (`otp.fre`)

No need for <html> or <body> tags, focus on the message.

```html
<h1>Code: {{code}}</h1>
<p>Hello {{userName}}, here is your Foma code.</p>
```

## Technical Configuration

**Runtime**: Node.js 22 (Alpine)

**Framework**: Fastify

**Engines**: Handlebars (Logic), Juice (CSS Inlining)

**Port**: 3000