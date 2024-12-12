// Import required modules
const axios = require("axios");
const fs = require("fs");
require("dotenv").config();

// HubSpot API key and Base URL from environment variables
const API_KEY = process.env.HUBSPOT_API_KEY;
const BASE_URL = "https://api.hubapi.com";

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

main();
