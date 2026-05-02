/** @vitest-environment jsdom */

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

import SearchBar from "../components/SearchBar";
import MovieCard from "../components/MovieCard";
import Filter from "../components/Filter";

import Login from "../pages/Login";
import Search from "../pages/Search";
import User from "../pages/User";

// ---------------- MOCKS ----------------
global.fetch = vi.fn();

const mockedNavigate = vi.fn();

// ✅ FIX IMPORTANT : mock propre sans casser react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

// ---------------- UTIL ----------------
const renderWithRouter = (ui) =>
  render(ui, { wrapper: MemoryRouter });

// ---------------- TESTS ----------------
describe("Tests d'intégration - Application Cinéma", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    global.fetch.mockReset();
    window.confirm = vi.fn(() => true);
  });

  // ---------------- LOGIN ----------------
  describe("Page de Connexion", () => {
    it("devrait connecter l'utilisateur", async () => {
      const mockUser = {
        id: 1,
        pseudo: "Tester",
        mail: "test@test.com",
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      renderWithRouter(<Login />);

      fireEvent.change(screen.getByPlaceholderText(/Pseudo/i), {
        target: { value: "Tester" },
      });

      fireEvent.change(screen.getByPlaceholderText(/Mot de passe/i), {
        target: { value: "password123" },
      });

      fireEvent.click(
        screen.getByRole("button", { name: /Se connecter/i })
      );

      await waitFor(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        expect(storedUser.pseudo).toBe("Tester");
      });
    });
  });

  // ---------------- SEARCH ----------------
  describe("Page de Recherche", () => {
    it("devrait afficher les films", async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          { id: 1, title: "Inception" },
          { id: 2, title: "Interstellar" },
        ],
      });

      renderWithRouter(<Search />);

      await waitFor(() => {
        expect(screen.getByText("Inception")).toBeInTheDocument();
        expect(screen.getByText("Interstellar")).toBeInTheDocument();
      });
    });
  });

  // ---------------- USER ----------------
  describe("Page Profil Utilisateur", () => {
    it("devrait modifier le pseudo", async () => {
      const initialUser = {
        id: 1,
        pseudo: "AncienNom",
        mail: "test@test.com",
      };

      localStorage.setItem("user", JSON.stringify(initialUser));

      renderWithRouter(<User />);

      expect(screen.getByText("AncienNom")).toBeInTheDocument();

      fireEvent.click(screen.getAllByText(/Modifier/i)[0]);

      const input = screen.getByDisplayValue("AncienNom");

      fireEvent.change(input, {
        target: { value: "NouveauNom" },
      });

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          ...initialUser,
          pseudo: "NouveauNom",
        }),
      });

      fireEvent.click(screen.getByText("OK"));

      await waitFor(() => {
        const updatedUser = JSON.parse(localStorage.getItem("user"));
        expect(updatedUser.pseudo).toBe("NouveauNom");
      });
    });
  });

  // ---------------- FILTER ----------------
  describe("Filtres (composants)", () => {
    it("devrait appeler onFilterChange", async () => {
      const onFilterChange = vi.fn();

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      renderWithRouter(<Filter onFilterChange={onFilterChange} />);

      const user = userEvent.setup();

      const openBtn = screen.getByRole("button", { name: /open-filters/i });

      await user.click(openBtn);

      const selectSort = screen.getAllByRole("combobox")[1];

      await user.selectOptions(selectSort, "note_desc");

      await user.click(
        screen.getByRole("button", {
          name: /Appliquer les filtres/i,
        })
      );

      expect(onFilterChange).toHaveBeenCalled();
    });
  });
});

// ---------------- NAVIGATION TESTS ----------------
describe("Tests navigation et composants", () => {

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("devrait rediriger vers search avec query", () => {
    render(
      <MemoryRouter>
        <SearchBar />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/Rechercher un film/i);
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "Inception" } });
    fireEvent.submit(form);

    expect(mockedNavigate).toHaveBeenCalledWith("/search?q=Inception");
  });

  it("devrait demander login si non connecté", () => {
    const mockMovie = {
      id: 101,
      title: "Avatar",
      vote_average: 7.8,
      poster_url: "",
    };

    render(
      <MemoryRouter>
        <MovieCard
          movie={mockMovie}
          favorites={[]}
          onToggleFavorite={vi.fn()}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));

    expect(window.confirm).toHaveBeenCalled();
  });

  it("devrait toggle favorite si connecté", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ id: 1, pseudo: "Bob" })
    );

    const mockToggle = vi.fn();
    const mockMovie = { id: 101, title: "Avatar", vote_average: 7.8 };

    render(
      <MemoryRouter>
        <MovieCard
          movie={mockMovie}
          favorites={[]}
          onToggleFavorite={mockToggle}
        />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockToggle).toHaveBeenCalledWith(101);
  });
});