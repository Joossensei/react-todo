/// <reference types="cypress" />

const apiBase = Cypress.env("API_BASE") || "http://0.0.0.0:8000/api/v1";

function createPriorityIfMissing(name, key) {
  return cy
    .request({
      url: `${apiBase}/priorities/`,
      failOnStatusCode: false,
    })
    .then((res) => {
      const existing = (res.body.priorities || res.body || []).find(
        (p) => p.key === key,
      );
      if (!existing) {
        return cy.request("POST", `${apiBase}/priorities/`, {
          name,
          key,
          order: 1,
          color: "#6b7280",
          icon: "fa-minus",
        });
      }
    });
}

describe("Todo E2E", () => {
  it("creates and deletes a todo item", () => {
    // Ensure a priority exists
    createPriorityIfMissing("High", "high");

    // Visit home
    cy.visit("/");

    // Open Add Todo form
    cy.contains("Add Todo").click();
    cy.get('input[placeholder="Add a todo"]').type("E2E Todo Item");
    cy.get("select").last().select("high");
    cy.contains("Add +").click();

    // Confirm appears in list
    cy.contains("E2E Todo Item").should("exist");

    // Delete it via item delete button
    cy.contains("E2E Todo Item")
      .parent()
      .parent()
      .within(() => {
        cy.contains("Delete").click();
      });

    // Confirm removed
    cy.contains("E2E Todo Item").should("not.exist");
  });
});
