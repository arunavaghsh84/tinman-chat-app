describe("Login Page", () => {
  beforeEach(() => {
    // Clear localStorage before each test to ensure a clean state
    cy.clearLocalStorage();
  });

  it("should redirect to /chat if token is already present in localStorage", () => {
    // Set a token in localStorage to simulate an already logged-in user
    cy.window().then((win) => {
      win.localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc"
      );
    });

    // Visit the login page
    cy.visit("http://localhost:3000/login");

    // Assert that the user is redirected to the chat page
    cy.url().should("include", "/chat");
  });

  it("should allow a user to log in and redirect to /chat", () => {
    // Intercept the login API call and mock the response
    cy.intercept("POST", "/api/auth/login", {
      statusCode: 200,
      body: {
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc",
      },
    }).as("loginRequest");

    // Visit the login page
    cy.visit("http://localhost:3000/login");

    // Enter a nickname
    cy.get('input[placeholder="Nickname"]').type("testuser");

    // Submit the login form
    cy.get("form").submit();

    // Wait for the login API call to be made
    cy.wait("@loginRequest");

    // Assert that the token is stored in localStorage
    cy.getAllLocalStorage().should(() => {
      expect(localStorage.getItem("token")).to.eq(
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc"
      );
    });

    // Assert that the user is redirected to the chat page
    cy.url().should("include", "/chat");
  });
});
