// Import required modules
const axios = require("axios");
const fs = require("fs");
const express = require("express");
require("dotenv").config();

// HubSpot API key and Base URL from environment variables
const API_KEY = process.env.HUBSPOT_API_KEY;
const BASE_URL = "https://api.hubapi.com";
const PORT = process.env.PORT || 3000;

// Log updates to a file
const logUpdate = (message) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync("contact_updates.log", `${timestamp} - ${message}\n`);
};

// Function to retrieve contacts from a specific list
async function getContactsFromList(listId) {
    const url = `${BASE_URL}/contacts/v1/lists/${listId}/contacts/all`;
    const headers = { Authorization: `Bearer ${API_KEY}` };
    let contacts = [];
    let params = { count: 100 };

    try {
        while (true) {
            const response = await axios.get(url, { headers, params });
            contacts = contacts.concat(response.data.contacts);

            if (!response.data["has-more"]) {
                break;
            }

            params.vidOffset = response.data["vid-offset"];
        }

        return contacts;
    } catch (error) {
        logUpdate(`Error retrieving contacts: ${error.message}`);
        if (error.response && error.response.status === 429) {
            logUpdate("Rate limit exceeded. Retrying after delay...");
            await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
            return getContactsFromList(listId);
        }
        throw error;
    }
}

// Function to update a contact's lifecycle stage
async function updateLifecycleStage(contactId, lifecycleStage) {
    const url = `${BASE_URL}/contacts/v1/contact/vid/${contactId}/profile`;
    const headers = {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
    };
    const payload = {
        properties: [{ property: "lifecyclestage", value: lifecycleStage }],
    };

    try {
        await axios.post(url, payload, { headers });
        logUpdate(
            `Updated contact ID ${contactId} to lifecycle stage '${lifecycleStage}'.`
        );
    } catch (error) {
        logUpdate(`Error updating contact ID ${contactId}: ${error.message}`);
        if (error.response && error.response.status === 429) {
            logUpdate("Rate limit exceeded. Retrying after delay...");
            await new Promise((resolve) => setTimeout(resolve, 10000)); // Wait 10 seconds
            return updateLifecycleStage(contactId, lifecycleStage);
        }
        throw error;
    }
}

// Main function to retrieve contacts and update lifecycle stage
async function main() {
    const listId = process.env.HUBSPOT_LIST_ID; // Replace with your list ID
    const lifecycleStage = "customer";

    try {
        const contacts = await getContactsFromList(listId);
        logUpdate(`Retrieved ${contacts.length} contacts from list ${listId}.`);

        for (const contact of contacts) {
            const contactId = contact.vid;
            await updateLifecycleStage(contactId, lifecycleStage);
        }

        console.log("All contacts updated successfully.");
    } catch (error) {
        console.error("An error occurred. Check the log file for details.");
    }
}

// Set up a simple front-end with Express
const app = express();
app.use(express.static("public"));

app.get("/run-script", async (req, res) => {
    try {
        await main();
        res.send(
            "Script executed successfully. Check the log file for details."
        );
    } catch (error) {
        res.status(500).send(
            "An error occurred. Check the log file for details."
        );
    }
});

app.get("/view-logs", (req, res) => {
    try {
        const logs = fs.readFileSync("contact_updates.log", "utf8");
        res.type("text/plain").send(logs);
    } catch (error) {
        res.status(500).send("Unable to read log file.");
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
