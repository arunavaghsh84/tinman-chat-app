describe("Home Page Redirection", () => {
  it("should redirect to /login if no token is present in localStorage", () => {
    // Clear localStorage to ensure no token is present
    cy.clearLocalStorage();

    // Visit the home page
    cy.visit("http://localhost:3000");

    // Assert that the user is redirected to the login page
    cy.url().should("include", "/login");
  });

  it("should redirect to /chat if token is present in localStorage", () => {
    // Set a token in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc"
      );
    });

    // Visit the home page
    cy.visit("http://localhost:3000");

    // Assert that the user is redirected to the chat page
    cy.url().should("include", "/chat");
  });
});
