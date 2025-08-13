/// <reference types="cypress" />

const apiBase = Cypress.env("API_BASE") || "http://0.0.0.0:8000/api/v1";

describe("Priority E2E", () => {
  it("creates, edits, and deletes a priority", () => {
    const key = `e2e-${Date.now()}`;
    // Create via API
    cy.request("POST", `${apiBase}/priorities/`, {
      key,
      name: `E2E ${key}`,
      description: "e2e temp",
      color: "#6b7280",
      icon: "fa-minus",
      order: 99,
    });

    // Visit priorities page
    cy.visit("/priorities");
    cy.contains(`E2E ${key}`).should("exist");

    // Navigate to edit
    cy.contains(`E2E ${key}`)
      .parents("tr")
      .within(() => {
        cy.contains("Edit").click();
      });

    // Change name and save
    cy.get("input#name").clear().type(`E2E ${key} Edited`);
    cy.contains("Update Priority").click();

    // Back to list and verify
    cy.visit("/priorities");
    cy.contains(`E2E ${key} Edited`).should("exist");

    // Delete via API to clean up
    cy.request("DELETE", `${apiBase}/priorities/${key}/`);
    cy.visit("/priorities");
    cy.contains(`E2E ${key} Edited`).should("not.exist");
  });
});
