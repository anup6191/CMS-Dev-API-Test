# HubSpot Developer Evaluation Assignment

Objective: Assess the candidate's ability to work with HubSpot's CMS, APIs, and integrations to solve
practical use cases.

## Part 1: HubSpot CMS Development

## Task 1

Create a custom landing page template using HubSpot CMS. The template should include the following:

- A hero section with a dynamic background image and text editable in the HubSpot editor.
- A three-column feature section with editable icons, titles, and descriptions.
- A blog post section that dynamically pulls the latest three blog posts from HubSpot's blog.
- Ensure the template is responsive and adheres to modern web design principles.

## Output 1: <https://46194485-hs-sites-com.sandbox.hs-sites.com/home>

- ## Hero Section

  - Option to update image from style tab or Use Background Color
  - Option to update text style tab or use heading option to change style in content tab

- ## Feature Section

  - Option to update Icon, Title and descriptions. I also Use Repeater mode add more column.

- ## Latest blog Section

  - Dynamically update and seclect Latest blog.

## Part 2: HubSpot API Integration

## Task 2

Develop a custom script or application that integrates with the HubSpot Contacts API to:

- Retrieve all contacts from a specific list.
- Update the `Lifecycle Stage` property of each contact to "Customer."
- Log the changes in a local file or database.

## Output 2

1.Install All Dependency

- npm install axios express dotenv

2.create private app API to Select Scope for contact and list and update the .env file with the API key and List ID

- HUBSPOT_API_KEY="Add Private App API"
- HUBSPOT_LIST_ID="Add LIST ID"

3.Run index.js using

- npm start

4.Check Contact_updates.log file for the final output logs.

## Part 3: HubSpot API Integration

## Task 3

## Steps to Implement the Integration

Step 1: Set Up HubSpot and Shopify APIs

- Obtain HubSpot API Key (or create a private app with appropriate scopes).
- Required Scopes: Deals (write), Contacts (read).
- Register a Shopify private app or API key.
- Required Scopes: Orders (read), Customers (read).

Step 2: Design the Integration Workflow

- Trigger: A new order is placed in Shopify.
- Action: Automatically create a deal in HubSpot.
- Process flow:
- Shopify sends a webhook when a new order is created.
- The webhook triggers an integration server to retrieve order and customer details.
- The server calls the HubSpot Deals API to create a new deal, associating it with the corresponding contact.

Step 3: Create the Webhook in Shopify

- Set up a webhook in the Shopify Admin for the orders/create event.
- Configure the webhook to send payloads to your integration server endpoint.

Step 4: Build the Integration Server

- Develop a server using Node.js with the following features:
- Endpoint for Shopify Webhooks: Listens to incoming order events.
- Data Transformation: Maps Shopify order details to HubSpot deal fields.
- API Calls to HubSpot: Uses the Deals API to create the deal.
- Error Handling: Retries failed requests and logs errors.

Step 5: Deploy the Integration

- Deploy the server to a cloud platform (e.g., AWS, Heroku, or Vercel).
- Use a secure and publicly accessible URL for the Shopify webhook endpoint.

Step 6: Test the Integration

- Place test orders in Shopify and verify:
- Deals are created in HubSpot with correct data.
- Proper logging and error handling
