describe("Navigation", () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it("should visit root", () => {
  });

  it("should visit Tuesday", () => {
    cy.contains("[data-testid=day]", "Tuesday")
    .click()
    .should("have.class", "day-list__item--selected");
  });
});