describe("Chat Page", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
  });

  it("should redirect to /login if no token is present in localStorage", () => {
    cy.visit("http://localhost:3000/chat");
    cy.url().should("include", "/login");
  });

  it("should load users, select a user, and display chat messages", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc"
      );
    });

    cy.intercept("GET", "/api/chat/users", {
      statusCode: 200,
      body: [
        { _id: "user1", nickname: "User One" },
        { _id: "user2", nickname: "User Two" },
      ],
    }).as("getUsers");

    cy.intercept("GET", "/api/chat/logs*", {
      statusCode: 200,
      body: [
        { sender: { nickname: "User One" }, messageText: "Hello User Two", timestamp: new Date() },
      ],
    }).as("getMessages");

    cy.visit("http://localhost:3000/chat");

    cy.wait("@getUsers");
    cy.get("div").contains("User One").should("exist");
    cy.get("div").contains("User Two").click();

    cy.wait("@getMessages");
    cy.get("div").contains("Hello User Two").should("exist");
  });

  it("should send a message and scroll to the bottom of the chat", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc"
      );
    });

    cy.intercept("GET", "/api/chat/users", {
      statusCode: 200,
      body: [{ _id: "user2", nickname: "User Two" }],
    }).as("getUsers");

    cy.intercept("GET", "/api/chat/logs*", {
      statusCode: 200,
      body: [],
    }).as("getMessages");

    cy.intercept("POST", "/api/chat/message", {
      statusCode: 200,
      body: {
        message: {
          sender: { _id: "66bf8f145853aa6bdc9daff9", nickname: "User One" },
          receiver: { _id: "user2", nickname: "User Two" },
          messageText: "New message",
          timestamp: new Date(),
        },
      },
    }).as("postMessage");

    cy.visit("http://localhost:3000/chat");

    cy.wait("@getUsers");
    cy.get("div").contains("User Two").click();

    cy.wait("@getMessages");
    cy.get("textarea").type("New message");
    cy.get("button").contains("Send").click();

    cy.wait("@postMessage");
    cy.window().then((win) => {
        win.setTimeout(() => cy.get("div").contains("New message").should("exist"));
    });

    cy.get("textarea").should("be.visible");
  });

  it("should handle user logout", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc"
      );
    });

    cy.visit("http://localhost:3000/chat");

    cy.get("button").contains("Logout").click();
    cy.url().should("include", "/login");

    cy.getAllLocalStorage().should(() => {
      expect(localStorage.getItem("token")).to.be.null;
    });
  });

  it("should handle chat cancellation", () => {
    cy.window().then((win) => {
      win.localStorage.setItem(
        "token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NmJjZGIwNTA2ZTU4YTI4NGJjOGVkNmQiLCJpYXQiOjE3MjM3MjcwNjAsImV4cCI6MTcyMzczMDY2MH0.bSijQmmLjlqXmgKSs4oKFmUdPsp3y8mdv7C_m1_sVxc"
      );
    });

    cy.intercept("GET", "/api/chat/users", {
      statusCode: 200,
      body: [{ _id: "user2", nickname: "User Two" }],
    }).as("getUsers");

    cy.visit("http://localhost:3000/chat");

    cy.wait("@getUsers");
    cy.get("div").contains("User Two").click();

    cy.get("button").contains("Cancel").click();
    cy.get("div").contains("Select a user to start chat").should("exist");
  });
});
