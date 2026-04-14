import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

const origFetch = global.fetch;

afterEach(() => {
  global.fetch = origFetch;
});

test("renders projects shell and empty list when not logged in", async () => {
  global.fetch = jest.fn((url) => {
    const path = String(url);
    if (path.includes("/api/users/me")) {
      return Promise.resolve({
        ok: false,
        status: 401,
        json: async () => ({ message: "Unauthorized" }),
      });
    }
    if (path.includes("/api/projects")) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: async () => [],
      });
    }
    return Promise.resolve({
      ok: false,
      status: 404,
      json: async () => ({}),
    });
  });

  render(<App />);

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /projects/i })).toBeInTheDocument();
  });

  expect(screen.getByText(/no projects yet/i)).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /gittogether/i })).toBeInTheDocument();
});
